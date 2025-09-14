import { supabase } from '@/integrations/supabase/client';
import { Product, Category, CartItem, Order, CheckoutData, ProductVariant } from '@/types/store';

export const storeService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
      if (categorySlug === 'all') {
        return this.getProducts();
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(*),
          variants:product_variants(*)
        `)
        .eq('categories.slug', categorySlug)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  async createProductVariant(variant: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variant)
        .select()
        .single();

      if (error) {
        console.error('Error creating product variant:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating product variant:', error);
      return null;
    }
  },

  async updateProductVariant(id: string, variant: Partial<ProductVariant>): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .update(variant)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product variant:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating product variant:', error);
      return null;
    }
  },

  async deleteProductVariant(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product variant:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting product variant:', error);
      return false;
    }
  },

  async createOrder(orderData: CheckoutData): Promise<Order | null> {
    try {
      // Get current user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null, // Set user_id for authenticated users, null for guests
          total_amount: orderData.total,
          customer_email: orderData.customer_email,
          customer_name: orderData.customer_name,
          shipping_address: orderData.shipping_address,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  },

  getProductCategories(products: Product[]): string[] {
    const categories = new Set(['All']);
    products.forEach(product => {
      if (product.category?.name) {
        categories.add(product.category.name);
      }
    });
    return Array.from(categories);
  }
};