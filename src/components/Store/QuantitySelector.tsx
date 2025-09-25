import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 99, 
  disabled = false 
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="h-10 w-10"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 text-center"
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="h-10 w-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;