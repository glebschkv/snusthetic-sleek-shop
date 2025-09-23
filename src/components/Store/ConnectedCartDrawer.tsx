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
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant?.id}`} className="flex gap-4 p-4 border rounded-xl bg-card/50">
                      {(item.variant?.image_url || item.product?.image_url) && (
                        <img
                          src={item.variant?.image_url || item.product?.image_url}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="font-semibold text-base leading-tight">{item.product?.name}</h4>
                        {item.variant?.color_name && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border-2 border-border" 
                              style={{ backgroundColor: item.variant.color_hex }}
                            />
                            <span className="text-sm text-muted-foreground">{item.variant.color_name}</span>
                          </div>
                        )}
                        <p className="text-lg font-bold text-primary">{formatPrice(item.product?.price || 0)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product_id, item.variant?.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1), item.variant?.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-base font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant?.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
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
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleContinueShopping} className="text-sm uppercase font-medium">
                    Continue Shopping
                  </Button>
                  <Button onClick={handleCheckout} className="text-sm uppercase font-medium">
                    Proceed to Checkout
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