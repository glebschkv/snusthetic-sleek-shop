import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  flavor: string;
  strength_mg: number;
  description: string;
  image_url?: string;
}

interface FlavorStrengthSelectorProps {
  products: Product[];
  selectedFlavor: string | null;
  selectedStrength: number | null;
  onSelectFlavor: (flavor: string) => void;
  onSelectStrength: (strength: number) => void;
}

const FlavorStrengthSelector = ({
  products,
  selectedFlavor,
  selectedStrength,
  onSelectFlavor,
  onSelectStrength,
}: FlavorStrengthSelectorProps) => {
  // Get unique flavors
  const flavors = Array.from(new Set(products.map((p) => p.flavor)));
  
  // Get strengths for selected flavor
  const availableStrengths = selectedFlavor
    ? products
        .filter((p) => p.flavor === selectedFlavor)
        .map((p) => p.strength_mg)
        .sort((a, b) => a - b)
    : [];

  return (
    <div className="space-y-6">
      {/* Flavor Selection */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Select Flavor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flavors.map((flavor) => (
            <Card
              key={flavor}
              className={cn(
                "p-4 cursor-pointer transition-all hover:scale-105",
                selectedFlavor === flavor
                  ? "border-primary border-2 bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectFlavor(flavor)}
            >
              <h4 className="font-semibold text-center">{flavor}</h4>
            </Card>
          ))}
        </div>
      </div>

      {/* Strength Selection */}
      {selectedFlavor && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Select Strength</h3>
          <div className="flex flex-wrap gap-3">
            {availableStrengths.map((strength) => (
              <Badge
                key={strength}
                variant={selectedStrength === strength ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-6 py-3 text-base transition-all",
                  selectedStrength === strength
                    ? "scale-110"
                    : "hover:scale-105"
                )}
                onClick={() => onSelectStrength(strength)}
              >
                {strength}mg
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlavorStrengthSelector;
