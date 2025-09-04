import { useState, useEffect } from 'react';
import { shopifyService } from '@/services/shopify';
import { ShopifyProduct } from '@/types/shopify';

export const useShopifyProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await shopifyService.getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = shopifyService.getProductCategories(products);

  return {
    products,
    categories,
    loading,
    error,
    refetch: () => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const fetchedProducts = await shopifyService.getProducts();
          setProducts(fetchedProducts);
          setError(null);
        } catch (err) {
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    },
  };
};