import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductVariant } from '@/types/store';
import { storeService } from '@/services/store';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface ProductVariantFormProps {
  productId: string;
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const PRESET_COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Orange', hex: '#F97316' },
];

const ProductVariantForm = ({ productId, variants, onVariantsChange }: ProductVariantFormProps) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVariant, setNewVariant] = useState({
    color_name: '',
    color_hex: '#000000',
    image_url: '',
    stock_quantity: '0',
    price_adjustment: '0',
    is_available: true,
  });

  const handleAddVariant = async () => {
    try {
      const variantData = {
        product_id: productId,
        color_name: newVariant.color_name,
        color_hex: newVariant.color_hex,
        image_url: newVariant.image_url || undefined,
        stock_quantity: parseInt(newVariant.stock_quantity),
        price_adjustment: parseFloat(newVariant.price_adjustment),
        is_available: newVariant.is_available,
      };

      const createdVariant = await storeService.createProductVariant(variantData);
      if (createdVariant) {
        onVariantsChange([...variants, createdVariant]);
        setNewVariant({
          color_name: '',
          color_hex: '#000000',
          image_url: '',
          stock_quantity: '0',
          price_adjustment: '0',
          is_available: true,
        });
        setShowAddDialog(false);
        toast({
          title: "Success",
          description: "Color variant added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add color variant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const success = await storeService.deleteProductVariant(variantId);
      if (success) {
        onVariantsChange(variants.filter(v => v.id !== variantId));
        toast({
          title: "Success",
          description: "Color variant deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete color variant",
        variant: "destructive",
      });
    }
  };

  const selectPresetColor = (color: { name: string; hex: string }) => {
    setNewVariant(prev => ({
      ...prev,
      color_name: color.name,
      color_hex: color.hex,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Color Variants</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Color
        </Button>
      </div>

      {variants.length > 0 && (
        <div className="border rounded-lg">
          <div className="p-4 space-y-3">
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: variant.color_hex }}
                  />
                  <div>
                    <p className="font-medium">{variant.color_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {variant.stock_quantity} | Adjustment: {variant.price_adjustment >= 0 ? '+' : ''}${variant.price_adjustment}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Color Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preset Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => selectPresetColor(color)}
                    className="flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color_name">Color Name</Label>
                <Input
                  id="color_name"
                  value={newVariant.color_name}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color_name: e.target.value }))}
                  placeholder="e.g., Red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color_hex">Color Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="color_hex"
                    type="color"
                    value={newVariant.color_hex}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, color_hex: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={newVariant.color_hex}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, color_hex: e.target.value }))}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variant_image">Color-specific Image URL</Label>
              <Input
                id="variant_image"
                value={newVariant.image_url}
                onChange={(e) => setNewVariant(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="Optional: specific image for this color"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant_stock">Stock Quantity</Label>
                <Input
                  id="variant_stock"
                  type="number"
                  value={newVariant.stock_quantity}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_adjustment">Price Adjustment ($)</Label>
                <Input
                  id="price_adjustment"
                  type="number"
                  step="0.01"
                  value={newVariant.price_adjustment}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price_adjustment: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddVariant}
                disabled={!newVariant.color_name.trim()}
              >
                Add Variant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductVariantForm;