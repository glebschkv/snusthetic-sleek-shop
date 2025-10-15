import { useState, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '@/types/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const addItem = useCallback((
    product: Product, 
    quantity: number = 1, 
    variant?: ProductVariant,
    subscriptionData?: {
      quantity_type: '5' | '10' | '20' | 'custom';
      billing_interval: 'month';
      brand_name?: string;
      flavor?: string;
      strength_mg?: number;
    }
  ) => {
    setItems(prevItems => {
      const hasSubscriptions = prevItems.some(item => item.is_subscription);
      const hasPhysical = prevItems.some(item => !item.is_subscription);
      const isAddingSubscription = !!subscriptionData;
      
      // Prevent mixing subscription and physical products
      if (hasSubscriptions && !isAddingSubscription) {
        toast.error('Please complete your subscription checkout first, or clear your cart to add physical products');
        return prevItems;
      }
      
      if (hasPhysical && isAddingSubscription) {
        toast.error('Please complete your physical product checkout first, or clear your cart to add a subscription');
        return prevItems;
      }
      
      // For subscriptions, replace any existing subscription
      if (isAddingSubscription) {
        const newItem: CartItem = {
          id: Date.now().toString(),
          product_id: product.id,
          quantity,
          product,
          is_subscription: true,
          subscription_data: subscriptionData
        };
        return [newItem];
      }
      
      // Existing logic for physical products
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
          id: Date.now().toString(),
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

  const hasSubscriptions = useCallback(() => {
    return items.some(item => item.is_subscription);
  }, [items]);

  const hasPhysicalProducts = useCallback(() => {
    return items.some(item => !item.is_subscription);
  }, [items]);

  const getQuantityDiscount = useCallback(() => {
    const totalItems = items.reduce((count, item) => count + item.quantity, 0);
    if (totalItems >= 3) return 25; // 25% off for 3+ items
    if (totalItems >= 2) return 15; // 15% off for 2 items
    return 0; // No discount for 1 item
  }, [items]);

  const getDiscountAmount = useCallback(() => {
    // Only apply quantity discounts to physical products, not subscriptions
    const hasSubs = items.some(item => item.is_subscription);
    if (hasSubs) return 0;
    
    const totalItems = items.reduce((count, item) => count + item.quantity, 0);
    let discount = 0;
    if (totalItems >= 3) discount = 25;
    else if (totalItems >= 2) discount = 15;
    
    const total = items.reduce((total, item) => {
      const itemPrice = item.product.price + (item.variant?.price_adjustment || 0);
      return total + (itemPrice * item.quantity);
    }, 0);
    
    return (total * discount) / 100;
  }, [items]);

  const getDiscountedTotal = useCallback(() => {
    const total = items.reduce((total, item) => {
      const itemPrice = item.product.price + (item.variant?.price_adjustment || 0);
      return total + (itemPrice * item.quantity);
    }, 0);
    
    const hasSubs = items.some(item => item.is_subscription);
    if (hasSubs) return total;
    
    const totalItems = items.reduce((count, item) => count + item.quantity, 0);
    let discount = 0;
    if (totalItems >= 3) discount = 25;
    else if (totalItems >= 2) discount = 15;
    
    return total - (total * discount) / 100;
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
    return formatPrice(getTotal());
  }, [getTotal, formatPrice]);

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    getQuantityDiscount,
    getDiscountAmount,
    getDiscountedTotal,
    toggleCart,
    openCart,
    closeCart,
    formatTotal,
    hasSubscriptions,
    hasPhysicalProducts
  };
};