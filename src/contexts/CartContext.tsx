import { createContext, useContext, ReactNode } from 'react';
import { useCart } from '@/hooks/useCart';
import { Product, ProductVariant } from '@/types/store';

interface CartContextType {
  items: any[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  formatTotal: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  console.log('CartProvider rendering');
  const cartHook = useCart();
  console.log('CartProvider cartHook:', cartHook);
  
  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  console.log('useCartContext called');
  const context = useContext(CartContext);
  console.log('useCartContext context:', context);
  if (context === undefined) {
    console.error('useCartContext: context is undefined');
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};