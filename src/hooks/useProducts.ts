import { useState, useEffect } from 'react';
import { storeService } from '@/services/store';
import { Product, Category } from '@/types/store';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories()
        ]);
        
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories()
        ]);
        
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    await fetchData();
  };

  return {
    products,
    categories,
    loading,
    error,
    refetch,
    categoryNames: storeService.getProductCategories(products),
    physicalProducts: products.filter(p => p.product_type === 'physical'),
    nicotinePouches: products.filter(p => p.product_type === 'nicotine_pouch'),
  };
};