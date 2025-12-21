import { supabase } from '../supabase';

export interface ShiftData {
    m_gerente?: string;
    m_vnd_real?: number;
    m_vnd_plan?: number;
    m_gcs_real?: number;
    m_gcs_plan?: number;
    m_horas?: number;
    m_perdas_real?: number;
    m_perdas_mn?: number;
    m_desinv?: number;
    m_tet?: number;
    m_r2p?: number;
    m_reemb_qtd?: number;
    m_reemb_val?: number;
    n_gerente?: string;
    n_vnd_real?: number;
    n_vnd_plan?: number;
    n_gcs_real?: number;
    n_gcs_plan?: number;
    n_horas?: number;
    n_perdas_real?: number;
    n_perdas_mn?: number;
    n_desinv?: number;
    n_tet?: number;
    n_r2p?: number;
    n_reemb_qtd?: number;
    n_reemb_val?: number;
}

export interface ManagerConfig {
    name: string;
    color: string;
}

export interface ExcelMapping {
    excelUser: string;
    managerName: string;
}

export interface AppConfig {
    gerentes: ManagerConfig[];
    mappings: ExcelMapping[];
    waterPrice?: number;
}

/**
 * Get all shift data for the current year
 */
/**
 * Get all shift data for the current year and store
 */
export async function getShiftData(year: number = new Date().getFullYear(), storeName: string = 'Amadora'): Promise<Record<string, ShiftData>> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('shift_data')
        .select('*')
        .eq('year', year);

    if (error) {
        console.error('Error fetching shift data:', error);
        throw error;
    }

    // Transform array to Record<string, ShiftData>
    const result: Record<string, ShiftData> = {};
    const prefix = storeName === 'Amadora' ? '' : `${storeName}:`;

    data?.forEach(row => {
        let { date_key, ...shiftData } = row;

        // Filter logic:
        // If Amadora (default), take keys WITHOUT prefix (legacy) OR with 'Amadora:' prefix
        // If Other, take keys WITH specific prefix

        let isValid = false;
        let cleanKey = date_key;

        if (storeName === 'Amadora') {
            if (!date_key.includes(':')) {
                isValid = true; // Legacy data
            } else if (date_key.startsWith('Amadora:')) {
                isValid = true;
                cleanKey = date_key.replace('Amadora:', '');
            }
        } else {
            if (date_key.startsWith(prefix)) {
                isValid = true;
                cleanKey = date_key.replace(prefix, '');
            }
        }

        if (isValid) {
            result[cleanKey] = shiftData as ShiftData;
        }
    });

    return result;
}

/**
 * Save shift data for a specific date
 */
export async function saveShiftData(dateKey: string, data: ShiftData, year: number = new Date().getFullYear(), storeName: string = 'Amadora'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Strip automatic columns that might cause null constraint violations on bulk upsert
    const { id, created_at, updated_at, ...cleanData } = data as any;

    // Add prefix if not Amadora
    const finalKey = storeName === 'Amadora' ? dateKey : `${storeName}:${dateKey}`;

    const { error } = await supabase
        .from('shift_data')
        .upsert({
            user_id: user.id,
            date_key: finalKey,
            year,
            ...cleanData
        }, {
            onConflict: 'user_id,date_key,year'
        });

    if (error) {
        console.error('Error saving shift data:', error);
        throw error;
    }
}

/**
 * Save all shift data (bulk operation)
 */
export async function saveAllShiftData(allData: Record<string, ShiftData>, year: number = new Date().getFullYear(), storeName: string = 'Amadora'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const records = Object.entries(allData).map(([dateKey, shiftData]) => {
        const finalKey = storeName === 'Amadora' ? dateKey : `${storeName}:${dateKey}`;
        // Strip automatic columns
        const { id, created_at, updated_at, ...cleanData } = shiftData as any;

        return {
            user_id: user.id,
            date_key: finalKey,
            year,
            ...cleanData
        };
    });

    const { error } = await supabase
        .from('shift_data')
        .upsert(records, {
            onConflict: 'user_id,date_key,year'
        });

    if (error) {
        console.error('Error saving all shift data:', error);
        throw error;
    }
}

/**
 * Delete shift data for a specific date
 */
export async function deleteShiftData(dateKey: string, year: number = new Date().getFullYear()): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('shift_data')
        .delete()
        .eq('user_id', user.id)
        .eq('date_key', dateKey)
        .eq('year', year);

    if (error) {
        console.error('Error deleting shift data:', error);
        throw error;
    }
}

/**
 * Get app configuration (managers and mappings)
 */
export async function getAppConfig(): Promise<AppConfig | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Use maybeSingle with limit to handle potential duplicates (if unique constraint is missing)
    const { data, error } = await supabase
        .from('app_config')
        .select('config_data')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('Error fetching app config:', error);
        throw error;
    }

    if (!data || !data.config_data) {
        return null;
    }

    return JSON.parse(data.config_data) as AppConfig;
}

/**
 * Save app configuration
 */
export async function saveAppConfig(config: AppConfig): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Check if config exists first to avoid duplicate inserts if unique constraint is missing
    const { data: existing } = await supabase
        .from('app_config')
        .select('user_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

    let error;

    if (existing) {
        // Update existing
        const result = await supabase
            .from('app_config')
            .update({
                config_data: JSON.stringify(config)
            })
            .eq('user_id', user.id);
        error = result.error;
    } else {
        // Insert new
        const result = await supabase
            .from('app_config')
            .insert({
                user_id: user.id,
                config_data: JSON.stringify(config)
            });
        error = result.error;
    }

    if (error) {
        console.error('Error saving app config:', error);
        throw error;
    }
}
