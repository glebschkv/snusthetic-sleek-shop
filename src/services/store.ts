import { supabase } from '@/integrations/supabase/client';
import { Product, Category, CartItem, Order, CheckoutData } from '@/types/store';

export const storeService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
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
          category:categories!inner(*)
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

  async createOrder(orderData: CheckoutData): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
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