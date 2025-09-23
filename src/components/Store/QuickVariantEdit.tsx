import { useState } from 'react';
import { ProductVariant } from '@/types/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { storeService } from '@/services/store';
import { useToast } from '@/hooks/use-toast';

interface QuickVariantEditProps {
  variant: ProductVariant;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedVariant: ProductVariant) => void;
}

const QuickVariantEdit = ({ variant, isOpen, onClose, onUpdate }: QuickVariantEditProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    stock_quantity: variant.stock_quantity.toString(),
    price_adjustment: variant.price_adjustment.toString(),
    is_available: variant.is_available,
    image_url: variant.image_url || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = {
        stock_quantity: parseInt(formData.stock_quantity),
        price_adjustment: parseFloat(formData.price_adjustment),
        is_available: formData.is_available,
        image_url: formData.image_url || null,
      };

      const updated = await storeService.updateProductVariant(variant.id, updatedData);
      if (updated) {
        onUpdate(updated);
        onClose();
        toast({
          title: "Success",
          description: "Variant updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update variant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {variant.color_name} Variant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border border-border"
              style={{ backgroundColor: variant.color_hex }}
            />
            <span className="font-medium">{variant.color_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price Adjustment ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price_adjustment}
                onChange={(e) => setFormData(prev => ({ ...prev, price_adjustment: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="/assets/your-image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
            />
            <Label htmlFor="available">Available for purchase</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickVariantEdit;