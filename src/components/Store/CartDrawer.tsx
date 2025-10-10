import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartItem } from '@/types/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Minus, Plus, Trash2, ShoppingBag, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onCheckout: () => void;
  total: number;
}

const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  total
}: CartDrawerProps) => {
  const { formatPrice } = useCurrency();
  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some products to get started</p>
            </div>
            <Button onClick={onClose} variant="secondary">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {items.map((item) => {
            const itemPrice = item.is_subscription 
              ? item.product.price * item.quantity
              : item.product.price + (item.variant?.price_adjustment || 0);
            const displayImage = item.variant?.image_url || item.product.image_url || '/images/placeholder.svg';
            
            return (
              <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={displayImage}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm leading-tight">
                        {item.product.name}
                      </h4>
                      {item.is_subscription && (
                        <Badge variant="secondary" className="text-xs">
                          <Repeat className="h-3 w-3 mr-1" />
                          Monthly
                        </Badge>
                      )}
                    </div>
                    
                    {item.is_subscription && item.subscription_data && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.subscription_data.brand_name && `${item.subscription_data.brand_name} • `}
                        {item.subscription_data.flavor && `${item.subscription_data.flavor} • `}
                        {item.subscription_data.strength_mg && `${item.subscription_data.strength_mg}mg`}
                      </div>
                    )}
                    
                    {!item.is_subscription && item.variant && (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: item.variant.color_hex }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.variant.color_name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {formatPrice(itemPrice)}
                      {item.is_subscription && <span className="text-xs text-muted-foreground">/month</span>}
                    </p>
                    
                    {item.is_subscription && item.subscription_data && (
                      <span className="text-xs text-green-600">
                        {item.subscription_data.quantity_type === '5' && '15% off'}
                        {item.subscription_data.quantity_type === '10' && '20% off'}
                        {item.subscription_data.quantity_type === '20' && '25% off'}
                        {item.subscription_data.quantity_type === 'custom' && '10% off'}
                      </span>
                    )}
                  </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!item.is_subscription ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {item.quantity} cans/month
                      </span>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => onRemoveItem(item.product_id, item.variant_id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <div className="space-y-2">
            <Button onClick={onCheckout} className="w-full" size="lg" variant="outline">
              Proceed to Checkout
            </Button>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;