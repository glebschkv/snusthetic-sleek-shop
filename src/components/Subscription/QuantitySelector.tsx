import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface QuantitySelectorProps {
  basePrice: number;
  selectedQuantity: number;
  quantityType: '5' | '10' | '20' | 'custom';
  customQuantity: number;
  onSelectQuantity: (type: '5' | '10' | '20' | 'custom', customValue?: number) => void;
}

const presetQuantities = [
  { value: '5', quantity: 5, discount: 0, label: '5 Cans' },
  { value: '10', quantity: 10, discount: 5, label: '10 Cans' },
  { value: '20', quantity: 20, discount: 10, label: '20 Cans' },
] as const;

const QuantitySelector = ({
  basePrice,
  selectedQuantity,
  quantityType,
  customQuantity,
  onSelectQuantity,
}: QuantitySelectorProps) => {
  const [customInput, setCustomInput] = useState(customQuantity.toString());
  const { formatPrice } = useCurrency();

  const calculatePrice = (quantity: number, discount: number) => {
    const pricePerCan = basePrice * (1 - discount / 100);
    const total = pricePerCan * quantity;
    const savings = (basePrice * quantity) - total;
    return { pricePerCan, total, savings };
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 5) {
      onSelectQuantity('custom', num);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-semibold">Select Quantity per Month</h3>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
          <span>💰</span>
          <span>50% less than average store price</span>
        </div>
      </div>
      
      {/* Preset Quantities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presetQuantities.map((option) => {
          const { pricePerCan, total, savings } = calculatePrice(option.quantity, option.discount);
          const isSelected = quantityType === option.value;
          
          return (
            <Card
              key={option.value}
              className={cn(
                "p-4 cursor-pointer transition-all hover:scale-105",
                isSelected
                  ? "border-primary border-2 bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectQuantity(option.value as '5' | '10' | '20')}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg">{option.label}</h4>
                  {option.discount > 0 ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      {option.discount}% OFF
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                      Base Price
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(pricePerCan)}/can
                </div>
                {option.value === '5' && (
                  <div className="text-xs text-muted-foreground italic">
                    Average shop price: {formatPrice(6)}/can
                  </div>
                )}
                <div className="text-2xl font-bold">{formatPrice(total)}/month</div>
                {option.discount > 0 ? (
                  <div className="text-sm text-green-600">Save {formatPrice(savings)}</div>
                ) : (
                  <div className="text-sm text-primary">Standard pricing</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Custom Quantity */}
      <Card
        className={cn(
          "p-4 transition-all",
          quantityType === 'custom'
            ? "border-primary border-2 bg-primary/5"
            : "border-border"
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">Custom Quantity</h4>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              10% OFF
            </Badge>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-quantity">Number of cans (minimum 5)</Label>
            <Input
              id="custom-quantity"
              type="number"
              min="5"
              value={customInput}
              onChange={(e) => handleCustomInputChange(e.target.value)}
              onFocus={() => onSelectQuantity('custom', parseInt(customInput) || 5)}
              placeholder="Enter quantity..."
            />
          </div>
          {quantityType === 'custom' && customQuantity >= 5 && (
            <div className="pt-2 space-y-1">
              <div className="text-sm text-muted-foreground">
                {formatPrice(basePrice * 0.9)}/can
              </div>
              <div className="text-2xl font-bold">
                {formatPrice(basePrice * 0.9 * customQuantity)}/month
              </div>
              <div className="text-sm text-green-600">
                Save {formatPrice(basePrice * customQuantity * 0.1)}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Badge component inline for simplicity
const Badge = ({ children, variant, className }: any) => (
  <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", className)}>
    {children}
  </span>
);

export default QuantitySelector;
