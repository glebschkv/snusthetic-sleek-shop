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

  const handleContinueShopping = () => {
    closeCart();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => {
        if (!open) closeCart();
      }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</SheetTitle>
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
                    <div key={`${item.id}-${item.variant?.id}`} className="flex gap-2 p-2 border rounded-lg bg-card/50">
                      {(item.variant?.image_url || item.product?.image_url) && (
                        <img
                          src={item.variant?.image_url || item.product?.image_url}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-xs leading-tight pr-2">{item.product?.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product_id, item.variant?.id)}
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {item.variant?.color_name && (
                          <div className="flex items-center gap-1 mb-1">
                            <div 
                              className="w-2 h-2 rounded-full border border-border" 
                              style={{ backgroundColor: item.variant.color_hex }}
                            />
                            <span className="text-xs text-muted-foreground">{item.variant.color_name}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-foreground">{formatPrice(item.product?.price || 0)}</p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1), item.variant?.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-medium min-w-[1rem] text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant?.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleCheckout} className="w-full text-xs uppercase font-medium py-3">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" onClick={handleContinueShopping} className="w-full text-xs uppercase font-medium py-3">
                    Continue Shopping
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