import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { format } from 'date-fns';

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

async function sendTestEmail() {
    console.log('🧪 Starting test email...\n');

    // Get first user with role gerente
    const { data: users, error: userError } = await supabase
        .from('user_profiles')
        .select('email, full_name, store_id')
        .eq('role', 'gerente')
        .limit(1);

    if (userError || !users || users.length === 0) {
        console.error('❌ No users with role "gerente" found.');
        console.log('\n💡 Tip: Make sure you have at least one user with role="gerente" in user_profiles table.');
        return;
    }

    const user = users[0];
    console.log(`📧 Sending test email to: ${user.email}`);
    console.log(`👤 User: ${user.full_name}\n`);

    // Mock products for testing
    const mockProducts = [
        { name: 'Leite Mimosa 1L', expiry_date: new Date().toISOString() },
        { name: 'Queijo Fresco', expiry_date: new Date().toISOString() },
        { name: 'Iogurte Natural', expiry_date: new Date().toISOString() }
    ];

    const productListHtml = mockProducts.map(p =>
        `<li style="margin: 8px 0; padding: 8px; background: #f9fafb; border-radius: 4px;">
            <strong>${p.name}</strong> - Vence em: ${format(new Date(p.expiry_date), 'dd/MM/yyyy HH:mm')}
        </li>`
    ).join('');

    try {
        const { data, error } = await resend.emails.send({
            from: 'Alerta TESTE DLC <noreply@dexon.pt>',
            to: [user.email],
            subject: `🧪 TESTE - Sistema de Alertas DLC`,
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
                        <div style="background-color: #3b82f6; color: white; padding: 24px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">🧪 EMAIL DE TESTE</h1>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 24px;">
                            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
                                Olá <strong>${user.full_name || 'Gerente'}</strong>,
                            </p>
                            
                            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                                Este é um <strong>email de teste</strong> do sistema de alertas de validade.
                            </p>
                            
                            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 24px;">
                                <p style="margin: 0; color: #1e40af; font-weight: bold;">
                                    ✅ Se você recebeu este email, o sistema está funcionando perfeitamente!
                                </p>
                            </div>
                            
                            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
                                <strong>Exemplo de como seria um alerta real:</strong>
                            </p>
                            
                            <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                                ${productListHtml}
                            </ul>
                            
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px;">
                                <p style="margin: 0; color: #92400e; font-weight: bold;">
                                    📋 Quando houver produtos realmente vencendo, você receberá um email como este.
                                </p>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                            
                            <p style="font-size: 14px; color: #6b7280;">
                                <strong>Informações do teste:</strong><br>
                                📅 Data: ${format(new Date(), 'dd/MM/yyyy HH:mm')}<br>
                                📧 Email: ${user.email}<br>
                                🏪 Loja: ${user.store_id || 'N/A'}
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">
                                Sistema de Alertas DLC - Email de Teste
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('❌ Error sending email:', error);
            console.log('\n💡 Common issues:');
            console.log('   - Check if VITE_RESEND_API_KEY is correct');
            console.log('   - Verify domain is configured in Resend');
            console.log('   - Check Resend dashboard for errors');
        } else {
            console.log(`✅ Test email sent successfully!`);
            console.log(`📬 Email ID: ${data?.id}`);
            console.log(`\n🎉 Check ${user.email} inbox (and spam folder)!`);
        }
    } catch (e) {
        console.error('❌ Exception sending email:', e);
    }
}

sendTestEmail();
