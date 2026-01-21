import { createContext, useContext, ReactNode } from 'react';
import { useCart } from '@/hooks/useCart';
import { Product, ProductVariant } from '@/types/store';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
  imageUrl?: string;
  subscriptionData?: {
    quantity_type: '5' | '10' | '20' | 'custom';
    billing_interval: 'month';
    brand_name?: string;
    flavor?: string;
    strength_mg?: number;
  };
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product, 
    quantity?: number, 
    variant?: ProductVariant,
    subscriptionData?: {
      quantity_type: '5' | '10' | '20' | 'custom';
      billing_interval: 'month';
      brand_name?: string;
      flavor?: string;
      strength_mg?: number;
    }
  ) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getQuantityDiscount: () => number;
  getDiscountAmount: () => number;
  getDiscountedTotal: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  formatTotal: () => string;
  hasSubscriptions: () => boolean;
  hasPhysicalProducts: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartHook = useCart();

  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};