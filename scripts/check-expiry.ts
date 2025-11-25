import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { format, addDays, isBefore, isAfter, startOfDay, endOfDay, parseISO } from 'date-fns';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;
const resendApiKey = process.env.VITE_RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    console.error('Missing environment variables. Check .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

async function checkExpiryAndNotify() {
    console.log('Starting expiry check...');

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const tomorrowEnd = endOfDay(addDays(today, 1));

    console.log(`Checking products expiring today (${format(today, 'dd/MM/yyyy')}) and tomorrow (${format(addDays(today, 1), 'dd/MM/yyyy')})`);

    // Fetch products with DLC Primária
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            expiry_date,
            dlc_type,
            store_id,
            stores (name)
        `)
        .not('expiry_date', 'is', null)
        .eq('dlc_type', 'Primária');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    if (!products || products.length === 0) {
        console.log('No products found.');
        return;
    }

    console.log(`Total products in database: ${products.length}`);

    // Separate products by urgency
    const productsExpiringToday: typeof products = [];
    const productsExpiringTomorrow: typeof products = [];

    products.forEach(product => {
        const expiryDate = parseISO(product.expiry_date);

        // Check if expires today
        if (isAfter(expiryDate, todayStart) && isBefore(expiryDate, todayEnd)) {
            productsExpiringToday.push(product);
        }
        // Check if expires tomorrow
        else if (isAfter(expiryDate, todayEnd) && isBefore(expiryDate, tomorrowEnd)) {
            productsExpiringTomorrow.push(product);
        }
    });

    console.log(`Products expiring TODAY: ${productsExpiringToday.length}`);
    console.log(`Products expiring TOMORROW: ${productsExpiringTomorrow.length}`);

    // Process urgent alerts (expiring today)
    if (productsExpiringToday.length > 0) {
        await sendAlerts(productsExpiringToday, 'urgent');
    }

    // Process warning alerts (expiring tomorrow)
    if (productsExpiringTomorrow.length > 0) {
        await sendAlerts(productsExpiringTomorrow, 'warning');
    }
}

async function sendAlerts(products: any[], urgency: 'urgent' | 'warning') {
    // Group by Store
    const productsByStore: Record<string, typeof products> = {};

    products.forEach(product => {
        if (!product.store_id) return;
        if (!productsByStore[product.store_id]) {
            productsByStore[product.store_id] = [];
        }
        productsByStore[product.store_id].push(product);
    });

    // Notify Store Managers
    for (const [storeId, storeProducts] of Object.entries(productsByStore)) {
        const { data: users, error: userError } = await supabase
            .from('user_profiles')
            .select('email, full_name')
            .eq('store_id', storeId)
            .eq('role', 'gerente');

        if (userError || !users || users.length === 0) {
            console.log(`No users found for store ${storeId}`);
            continue;
        }

        const storeName = storeProducts[0].stores?.name || 'Sua Loja';

        // Email configuration based on urgency
        const emailConfig = urgency === 'urgent'
            ? {
                from: 'Alerta URGENTE DLC <noreply@dexon.pt>',
                subject: `🔴 URGENTE: Produtos vencendo HOJE - ${storeName}`,
                headerColor: '#dc2626', // red-600
                headerText: 'URGENTE - Produtos vencendo HOJE',
                icon: '🔴'
            }
            : {
                from: 'Alertas DLC vencida <noreply@dexon.pt>',
                subject: `⚠️ Produtos vencendo AMANHÃ - ${storeName}`,
                headerColor: '#f59e0b', // amber-500
                headerText: 'ATENÇÃO - Produtos vencendo AMANHÃ',
                icon: '🟡'
            };

        const productListHtml = storeProducts.map(p =>
            `<li style="margin: 8px 0; padding: 8px; background: #f9fafb; border-radius: 4px;">
                <strong>${p.name}</strong> - Vence em: ${format(parseISO(p.expiry_date), 'dd/MM/yyyy HH:mm')}
            </li>`
        ).join('');

        for (const user of users) {
            console.log(`Sending ${urgency} email to ${user.email} for store ${storeName}...`);

            try {
                const { data, error } = await resend.emails.send({
                    from: emailConfig.from,
                    to: [user.email],
                    subject: emailConfig.subject,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                                <!-- Header -->
                                <div style="background-color: ${emailConfig.headerColor}; color: white; padding: 24px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px;">${emailConfig.icon} ${emailConfig.headerText}</h1>
                                </div>
                                
                                <!-- Content -->
                                <div style="padding: 24px;">
                                    <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
                                        Olá <strong>${user.full_name || 'Gerente'}</strong>,
                                    </p>
                                    
                                    <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                                        Os seguintes produtos na loja <strong>${storeName}</strong> estão próximos da data de validade:
                                    </p>
                                    
                                    <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                                        ${productListHtml}
                                    </ul>
                                    
                                    <div style="background-color: #fef3c7; border-left: 4px solid ${emailConfig.headerColor}; padding: 16px; margin-bottom: 24px;">
                                        <p style="margin: 0; color: #92400e; font-weight: bold;">
                                            ${urgency === 'urgent'
                            ? '⚡ Ação imediata necessária! Verifique o estoque agora.'
                            : '📋 Planeje a retirada destes produtos do estoque.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- Footer -->
                                <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">
                                        Sistema de Alertas DLC - ${storeName}
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });

                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log(`✅ Email sent successfully: ${data?.id}`);
                }
            } catch (e) {
                console.error('Exception sending email:', e);
            }
        }
    }
}

checkExpiryAndNotify();
