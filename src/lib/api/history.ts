import { supabase } from '../supabase';

export interface ProductHistory {
    id: string;
    product_id: string;
    user_id: string;
    action: 'CRIACAO' | 'EDICAO' | 'EXCLUSAO';
    changes: Record<string, unknown>;
    created_at: string;
    user?: {
        full_name: string;
        email: string;
    };
}

export async function getProductHistory(productId: string) {
    const { data, error } = await supabase
        .from('product_history')
        .select(`
      *,
      user:user_profiles(full_name, email)
    `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProductHistory[];
}

export async function logProductAction(
    productId: string,
    action: 'CRIACAO' | 'EDICAO' | 'EXCLUSAO',
    changes: Record<string, unknown>
) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
        .from('product_history')
        .insert([{
            product_id: productId,
            user_id: user.id,
            action,
            changes
        }]);

    if (error) {
        console.error('Error logging product action:', error);
        // Don't throw error to avoid blocking the main action
    }
}
