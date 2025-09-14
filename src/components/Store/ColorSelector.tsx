import { useState } from 'react';
import { ProductVariant } from '@/types/store';
import { Button } from '@/components/ui/button';

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

const ColorSelector = ({ variants, selectedVariant, onVariantChange }: ColorSelectorProps) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Color:</p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((variant) => (
          <Button
            key={variant.id}
            variant={selectedVariant?.id === variant.id ? "default" : "outline"}
            size="sm"
            onClick={() => onVariantChange(variant)}
            className="h-8 px-2"
            disabled={!variant.is_available || variant.stock_quantity <= 0}
          >
            <div
              className="w-3 h-3 rounded-full border border-border mr-1"
              style={{ backgroundColor: variant.color_hex }}
            />
            {variant.color_name}
          </Button>
        ))}
      </div>
      {selectedVariant && selectedVariant.stock_quantity > 0 && selectedVariant.stock_quantity <= 5 && (
        <p className="text-xs text-amber-600">
          Only {selectedVariant.stock_quantity} left in {selectedVariant.color_name}
        </p>
      )}
    </div>
  );
};

export default ColorSelector;