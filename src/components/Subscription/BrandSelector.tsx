import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  description: string;
}

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand) => void;
  onSelectCustom: () => void;
  isCustomSelected: boolean;
}

const BrandSelector = ({ brands, selectedBrand, onSelectBrand, onSelectCustom, isCustomSelected }: BrandSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Choose Your Brand</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className={cn(
              "p-8 cursor-pointer transition-all hover:scale-105",
              selectedBrand?.id === brand.id && !isCustomSelected
                ? "border-primary border-2 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelectBrand(brand)}
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">{brand.name}</h3>
              <p className="text-muted-foreground">{brand.description}</p>
            </div>
          </Card>
        ))}
        
        <Card
          className={cn(
            "p-8 cursor-pointer transition-all hover:scale-105",
            isCustomSelected
              ? "border-primary border-2 bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={onSelectCustom}
        >
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Request Custom Brand</h3>
            <p className="text-muted-foreground">Don't see your brand? We'll find it for you</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BrandSelector;
