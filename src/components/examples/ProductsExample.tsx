import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api/products'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

/**
 * Exemplo de componente que usa as funções do Supabase
 * Este é apenas um exemplo - você pode adaptar para seus componentes existentes
 */
export function ProductsExample() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    // Carregar produtos ao montar o componente
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Erro ao carregar produtos:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os produtos',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateProduct = async () => {
        try {
            const newProduct = await createProduct({
                category: 'Laticínios',
                name: 'Leite',
                expiry_date: '2025-12-31',
                dlc_type: 'Primária',
                daysToExpiry: 0,
                status: 'OK',
            })

            setProducts([...products, newProduct])

            toast({
                title: 'Sucesso',
                description: 'Produto criado com sucesso!',
            })
        } catch (error) {
            console.error('Erro ao criar produto:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível criar o produto',
                variant: 'destructive',
            })
        }
    }

    const handleUpdateProduct = async (id: string) => {
        try {
            const updated = await updateProduct(id, {
                expiry_date: '2026-01-01',
            })

            setProducts(products.map(p => p.id === id ? updated : p))

            toast({
                title: 'Sucesso',
                description: 'Produto atualizado com sucesso!',
            })
        } catch (error) {
            console.error('Erro ao atualizar produto:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar o produto',
                variant: 'destructive',
            })
        }
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteProduct(id)
            setProducts(products.filter(p => p.id !== id))

            toast({
                title: 'Sucesso',
                description: 'Produto deletado com sucesso!',
            })
        } catch (error) {
            console.error('Erro ao deletar produto:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível deletar o produto',
                variant: 'destructive',
            })
        }
    }

    if (loading) {
        return <div>Carregando produtos...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <Button onClick={handleCreateProduct}>
                    Adicionar Produto
                </Button>
            </div>

            <div className="grid gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded-lg">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            Categoria: {product.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Validade: {product.expiry_date}
                        </p>
                        <div className="mt-2 space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateProduct(product.id)}
                            >
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                            >
                                Deletar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
