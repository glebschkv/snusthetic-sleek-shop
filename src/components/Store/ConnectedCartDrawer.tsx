import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import CheckoutDialog from './CheckoutDialog';

export default function ConnectedCartDrawer() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, getItemCount, isOpen, closeCart } = useCartContext();
  const total = getTotal();
  const itemCount = getItemCount();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    closeCart();
    setCheckoutOpen(true);
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => {
        if (!open) closeCart();
      }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
          </SheetHeader>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant?.id}`} className="flex items-center gap-3 p-3 border rounded-lg">
                      {(item.variant?.image_url || item.product?.image_url) && (
                        <img
                          src={item.variant?.image_url || item.product?.image_url}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product?.name}</h4>
                        {item.variant?.color_name && (
                          <p className="text-xs text-muted-foreground">Color: {item.variant.color_name}</p>
                        )}
                        <p className="text-sm font-medium">{formatPrice(item.product?.price || 0)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1), item.variant?.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant?.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product_id, item.variant?.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleViewCart} className="text-sm">
                    View Cart
                  </Button>
                  <Button onClick={handleCheckout} className="text-sm">
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </>
  );
}