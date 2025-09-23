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
              <ShoppingCart className="h-20 w-20 mb-6 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-center">Add some products to get started</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant?.id}`} className="flex gap-3 p-3 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                      {(item.variant?.image_url || item.product?.image_url) && (
                        <img
                          src={item.variant?.image_url || item.product?.image_url}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm leading-tight pr-2">{item.product?.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product_id, item.variant?.id)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.variant?.color_name && (
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full border border-border shadow-sm" 
                              style={{ backgroundColor: item.variant.color_hex }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">{item.variant.color_name}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-black">{formatPrice(item.product?.price || 0)}</p>
                          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1), item.variant?.id)}
                              className="h-8 w-8 p-0 border-0 hover:bg-accent transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-semibold min-w-[1.5rem] text-center px-2">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant?.id)}
                              className="h-8 w-8 p-0 border-0 hover:bg-accent transition-colors"
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
              
              <div className="border-t pt-6 space-y-4 bg-background/80 backdrop-blur-sm">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleCheckout} className="w-full text-sm font-semibold py-4 shadow-lg hover:shadow-xl transition-shadow">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" onClick={handleContinueShopping} className="w-full text-sm font-medium py-3 hover:bg-accent transition-colors">
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