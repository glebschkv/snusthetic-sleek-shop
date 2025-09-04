import { ShopifyProduct } from '@/types/shopify';
import { supabase } from '@/integrations/supabase/client';

// Shopify API Service via Supabase Edge Functions
const EDGE_FUNCTION_URL = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/functions/v1/shopify-api';

export const shopifyService = {
  async getProducts(query?: string): Promise<ShopifyProduct[]> {
    try {
      console.log('Fetching products via Edge Function:', query);
      
      const { data, error } = await supabase.functions.invoke('shopify-api', {
        body: { action: 'getProducts', query: query || '' },
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function error:', error);
        return [];
      }

      console.log('Edge Function response:', data);
      return data?.products || [];
    } catch (error) {
      console.error('Error fetching products via Edge Function:', error);
      return [];
    }
  },

  async createCart(variantId: string, quantity: number = 1): Promise<string | null> {
    try {
      console.log('Creating cart via Edge Function:', variantId, quantity);
      
      const { data, error } = await supabase.functions.invoke('shopify-api', {
        body: { action: 'createCart', variantId, quantity },
      });

      if (error) {
        console.error('Edge Function error:', error);
        return null;
      }

      console.log('Cart creation response:', data);
      return data?.checkoutUrl || null;
    } catch (error) {
      console.error('Error creating cart via Edge Function:', error);
      return null;
    }
  },

  getProductCategories(products: ShopifyProduct[]): string[] {
    const categories = new Set(['All']);
    products.forEach(product => {
      if (product.productType) {
        categories.add(product.productType);
      }
    });
    return Array.from(categories);
  },
};