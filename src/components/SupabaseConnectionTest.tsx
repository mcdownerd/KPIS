import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/api/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { Product } from '@/types/product'

/**
 * Componente para testar a conexão com o Supabase
 * Adicione este componente temporariamente na sua página Index para testar
 */
export function SupabaseConnectionTest() {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Product[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const testConnection = async () => {
        setLoading(true)
        setError(null)
        setSuccess(false)
        setProducts(null)

        try {
            const data = await getProducts()
            setProducts(data)
            setSuccess(true)
        } catch (err: any) {
            console.error('Erro ao conectar:', err)
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                    {success && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {error && <XCircle className="h-5 w-5 text-red-500" />}
                    Teste de Conexão Supabase
                </CardTitle>
                <CardDescription>
                    Clique no botão para testar a conexão com o banco de dados
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={testConnection} disabled={loading}>
                    {loading ? 'Testando...' : 'Testar Conexão'}
                </Button>

                {success && products && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                            ✅ Conexão bem-sucedida!
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Encontrados <strong>{products.length} produtos</strong> no banco de dados.
                        </p>

                        {products.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="font-medium text-sm text-green-800 dark:text-green-200">
                                    Primeiros produtos:
                                </h4>
                                <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                                    {products.slice(0, 5).map((product) => (
                                        <li key={product.id} className="flex justify-between">
                                            <span>{product.name}</span>
                                            <span className="text-muted-foreground">
                                                {product.category}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                            ❌ Erro na conexão
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        <div className="mt-3 text-xs text-red-600 dark:text-red-400">
                            <p className="font-medium mb-1">Possíveis causas:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Verifique se o arquivo .env está configurado corretamente</li>
                                <li>Confirme que o servidor foi reiniciado após criar o .env</li>
                                <li>Verifique se as credenciais do Supabase estão corretas</li>
                                <li>Confirme que as políticas RLS permitem acesso aos dados</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || '❌ Não configurada'}</p>
                    <p><strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}</p>
                </div>
            </CardContent>
        </Card>
    )
}
