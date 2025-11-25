import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { format, addDays, isBefore, parseISO } from 'date-fns';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Using service role key for backend access
const resendApiKey = process.env.VITE_RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    console.error('Missing environment variables. Check .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

async function checkExpiryAndNotify() {
    console.log('Starting expiry check...');

    // 1. Calculate date range (Today + 1 day)
    const today = new Date();
    const oneDayFromNow = addDays(today, 1);

    console.log(`Checking products expiring before: ${format(oneDayFromNow, 'dd/MM/yyyy')}`);

    // 2. Fetch active products with DLC Primária
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

    // 3. Filter expiring products
    const expiringProducts = products.filter(product => {
        const expiryDate = parseISO(product.expiry_date);
        return isBefore(expiryDate, oneDayFromNow) && isBefore(today, expiryDate);
    });

    console.log(`Found ${expiringProducts.length} expiring products.`);

    if (expiringProducts.length === 0) return;

    // 4. Group by Store
    const productsByStore: Record<string, typeof expiringProducts> = {};

    expiringProducts.forEach(product => {
        if (!product.store_id) return;
        if (!productsByStore[product.store_id]) {
            productsByStore[product.store_id] = [];
        }
        productsByStore[product.store_id].push(product);
    });

    // 5. Notify Store Owners
    for (const [storeId, storeProducts] of Object.entries(productsByStore)) {
        // Get store users (gerente only)
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
        const productListHtml = storeProducts.map(p =>
            `<li><strong>${p.name}</strong> - Vence em: ${format(parseISO(p.expiry_date), 'dd/MM/yyyy')}</li>`
        ).join('');

        for (const user of users) {
            console.log(`Sending email to ${user.email} for store ${storeName}...`);

            try {
                const { data, error } = await resend.emails.send({
                    from: 'Alertas KPIS <noreply@dexon.pt>',
                    to: [user.email],
                    subject: `⚠️ Alerta de Validade - ${storeName}`,
                    html: `
                        <h1>Produtos Vencendo em Breve</h1>
                        <p>Olá ${user.full_name || 'Usuário'},</p>
                        <p>Os seguintes produtos na loja <strong>${storeName}</strong> estão próximos da data de validade:</p>
                        <ul>
                            ${productListHtml}
                        </ul>
                        <p>Por favor, verifique o estoque.</p>
                    `
                });

                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent successfully:', data?.id);
                }
            } catch (e) {
                console.error('Exception sending email:', e);
            }
        }
    }
}

checkExpiryAndNotify();
