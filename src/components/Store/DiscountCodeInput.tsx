import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, Percent, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DiscountCodeInputProps {
  orderTotal: number;
  onDiscountApplied: (code: string, discountType: string, discountValue: number, discountAmount: number) => void;
  onDiscountRemoved: () => void;
  appliedCode?: string;
  appliedDiscountType?: string;
  appliedDiscountValue?: number;
  disabled?: boolean;
}

export const DiscountCodeInput = ({
  orderTotal,
  onDiscountApplied,
  onDiscountRemoved,
  appliedCode,
  appliedDiscountType,
  appliedDiscountValue,
  disabled,
}: DiscountCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateDiscountCode = async (discountCode: string) => {
    if (!discountCode.trim()) return;

    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-discount-code', {
        body: {
          code: discountCode.toUpperCase(),
          order_total: orderTotal,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: 'Error',
          description: 'Failed to validate discount code',
          variant: 'destructive',
        });
        return;
      }

      if (!data.success) {
        toast({
          title: 'Invalid Code',
          description: data.error || "This discount code doesn't exist",
          variant: 'destructive',
        });
        return;
      }

      onDiscountApplied(
        data.code,
        data.discount_type,
        data.discount_value,
        data.discount_amount
      );

      const discountLabel =
        data.discount_type === 'percentage'
          ? `${data.discount_value}% off`
          : `£${data.discount_value} off`;

      toast({
        title: 'Discount Code Applied!',
        description: `You get ${discountLabel} your order`,
      });

      setCode('');
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: 'Error',
        description: 'Failed to validate discount code',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscountCode = () => {
    onDiscountRemoved();
    toast({
      title: 'Discount Code Removed',
      description: 'Discount has been removed from your order',
    });
  };

  if (appliedCode) {
    return (
      <div className="space-y-2">
        <Label>Discount Code Applied</Label>
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <Check className="h-4 w-4 text-green-600" />
          <Badge variant="secondary" className="font-mono">
            {appliedCode}
          </Badge>
          <div className="flex items-center gap-1 text-green-700">
            {appliedDiscountType === 'percentage' ? (
              <>
                <Percent className="h-3 w-3" />
                <span className="text-sm font-medium">{appliedDiscountValue}% OFF</span>
              </>
            ) : (
              <>
                <Tag className="h-3 w-3" />
                <span className="text-sm font-medium">£{appliedDiscountValue} OFF</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeDiscountCode}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-code">Discount Code (Optional)</Label>
      <div className="flex gap-2">
        <Input
          id="discount-code"
          placeholder="Enter discount code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              validateDiscountCode(code);
            }
          }}
          disabled={disabled}
        />
        <Button
          onClick={() => validateDiscountCode(code)}
          disabled={!code.trim() || isValidating || disabled}
          variant="outline"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground">
          Remove your referral code to use a discount code instead.
        </p>
      )}
      {!disabled && (
        <p className="text-xs text-muted-foreground">
          Have a promo code? Enter it here for a discount!
        </p>
      )}
    </div>
  );
};