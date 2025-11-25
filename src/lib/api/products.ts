import { supabase } from '../supabase'
import type { Product, ProductHistoryLog } from '@/types/product'

/**
 * Fetch all products from Supabase
 */
export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching products:', error)
        throw error
    }

    return data as Product[]
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        throw error
    }

    return data as Product
}

/**
 * Create a new product
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()

    if (error) {
        console.error('Error creating product:', error)
        throw error
    }

    return data as Product
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating product:', error)
        throw error
    }

    return data as Product
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting product:', error)
        throw error
    }

    return true
}

/**
 * Get product history logs
 */
export async function getProductHistory(productId: string) {
    const { data, error } = await supabase
        .from('product_history')
        .select(`
      *,
      profiles:updated_by (
        full_name
      )
    `)
        .eq('product_id', productId)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching product history:', error)
        throw error
    }

    return data as ProductHistoryLog[]
}

/**
 * Get products expiring soon (within specified days)
 */
export async function getProductsExpiringSoon(days: number = 7) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('expiry_date', futureDate.toISOString())
        .order('expiry_date', { ascending: true })

    if (error) {
        console.error('Error fetching expiring products:', error)
        throw error
    }

    return data as Product[]
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('expiry_date', { ascending: true })

    if (error) {
        console.error('Error fetching products by category:', error)
        throw error
    }

    return data as Product[]
}

/**
 * Search products by name
 */
export async function searchProducts(searchTerm: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })

    if (error) {
        console.error('Error searching products:', error)
        throw error
    }

    return data as Product[]
}
