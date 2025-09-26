import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReferralCodeInputProps {
  onReferralApplied: (code: string, discount: number) => void;
  onReferralRemoved: () => void;
  appliedCode?: string;
}

export const ReferralCodeInput = ({ 
  onReferralApplied, 
  onReferralRemoved, 
  appliedCode 
}: ReferralCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateReferralCode = async (referralCode: string) => {
    if (!referralCode.trim()) return;

    setIsValidating(true);
    try {
      // Use the validate-referral edge function to bypass RLS restrictions
      const { data, error } = await supabase.functions.invoke('validate-referral', {
        body: {
          referral_code: referralCode.toUpperCase(),
          customer_email: 'temp@validation.com', // Dummy email for validation
          order_total: 100 // Dummy order total for validation
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Error",
          description: "Failed to validate referral code",
          variant: "destructive"
        });
        return;
      }

      if (!data.success) {
        toast({
          title: "Invalid Code",
          description: "This referral code doesn't exist",
          variant: "destructive"
        });
        return;
      }

      // Apply the discount from the validation response
      const discountPercent = data.discount_percent || 10;
      onReferralApplied(referralCode.toUpperCase(), discountPercent);
      
      toast({
        title: "Referral Code Applied!",
        description: `You get ${discountPercent}% off your order`,
      });
      
      setCode('');
    } catch (error) {
      console.error('Error validating referral code:', error);
      toast({
        title: "Error",
        description: "Failed to validate referral code",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removeReferralCode = () => {
    onReferralRemoved();
    toast({
      title: "Referral Code Removed",
      description: "Discount has been removed from your order"
    });
  };

  // Check URL for referral code on component mount
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !appliedCode) {
      setCode(refCode);
      validateReferralCode(refCode);
    }
  });

  if (appliedCode) {
    return (
      <div className="space-y-2">
        <Label>Referral Code Applied</Label>
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <Check className="h-4 w-4 text-green-600" />
          <Badge variant="secondary" className="font-mono">
            {appliedCode}
          </Badge>
          <div className="flex items-center gap-1 text-green-700">
            <Percent className="h-3 w-3" />
            <span className="text-sm font-medium">10% OFF</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeReferralCode}
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
      <Label htmlFor="referral-code">Referral Code (Optional)</Label>
      <div className="flex gap-2">
        <Input
          id="referral-code"
          placeholder="Enter referral code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              validateReferralCode(code);
            }
          }}
        />
        <Button 
          onClick={() => validateReferralCode(code)}
          disabled={!code.trim() || isValidating}
          variant="outline"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Have a referral code? Get 10% off your order!
      </p>
    </div>
  );
};