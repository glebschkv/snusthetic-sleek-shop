import { useState, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '@/types/store';
import { storeService } from '@/services/store';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.product_id === product.id && item.variant_id === variant?.id
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product_id === product.id && item.variant_id === variant?.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(), // Simple ID for local cart
          product_id: product.id,
          variant_id: variant?.id,
          quantity,
          product,
          variant
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prevItems => prevItems.filter(item => 
      !(item.product_id === productId && item.variant_id === variantId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = item.product.price + (item.variant?.price_adjustment || 0);
      return total + (itemPrice * item.quantity);
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const formatTotal = useCallback(() => {
    return storeService.formatPrice(getTotal());
  }, [getTotal]);

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    toggleCart,
    openCart,
    closeCart,
    formatTotal
  };
};