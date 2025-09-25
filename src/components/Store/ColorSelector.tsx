import { useState } from 'react';
import { ProductVariant } from '@/types/store';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Edit } from 'lucide-react';
import QuickVariantEdit from './QuickVariantEdit';

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  onVariantUpdate?: (updatedVariant: ProductVariant) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ColorSelector = ({ variants, selectedVariant, onVariantChange, onVariantUpdate, size = 'md' }: ColorSelectorProps) => {
  const { isAdmin } = useAuth();
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  
  if (!variants || variants.length === 0) return null;

  // Size-based styling for different display modes
  const sizeClasses = {
    sm: { button: 'h-6 px-1.5 text-xs', dot: 'w-2 h-2', gap: 'gap-1' },
    md: { button: 'h-8 px-2', dot: 'w-3 h-3', gap: 'gap-2' },
    lg: { button: 'h-10 px-3', dot: 'w-4 h-4', gap: 'gap-3' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="space-y-2">
      {size !== 'sm' && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Color:</p>
          {isAdmin && selectedVariant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingVariant(selectedVariant)}
              className="h-6 px-2 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      )}
      
      <div className={`flex flex-wrap ${currentSize.gap}`}>
        {variants.map((variant) => (
          <Button
            key={variant.id}
            variant={selectedVariant?.id === variant.id ? "default" : "outline"}
            size="sm"
            onClick={() => onVariantChange(variant)}
            className={`${currentSize.button} relative`}
            disabled={!variant.is_available || variant.stock_quantity <= 0}
          >
            <div
              className={`${currentSize.dot} rounded-full border border-border mr-1`}
              style={{ backgroundColor: variant.color_hex }}
            />
            {variant.color_name}
            {variant.stock_quantity <= 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </Button>
        ))}
      </div>
      
      {selectedVariant && selectedVariant.stock_quantity > 0 && selectedVariant.stock_quantity <= 5 && (
        <p className="text-xs text-amber-600">
          Only {selectedVariant.stock_quantity} left in {selectedVariant.color_name}
        </p>
      )}
      
      {selectedVariant && selectedVariant.stock_quantity <= 0 && (
        <p className="text-xs text-destructive">
          {selectedVariant.color_name} is out of stock
        </p>
      )}

      {editingVariant && onVariantUpdate && (
        <QuickVariantEdit
          variant={editingVariant}
          isOpen={!!editingVariant}
          onClose={() => setEditingVariant(null)}
          onUpdate={(updated) => {
            onVariantUpdate(updated);
            setEditingVariant(null);
            // Update selection if this was the selected variant
            if (selectedVariant?.id === updated.id) {
              onVariantChange(updated);
            }
          }}
        />
      )}
    </div>
  );
};

export default ColorSelector;