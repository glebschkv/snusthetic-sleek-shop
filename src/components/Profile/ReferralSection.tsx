import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, TrendingUp, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  referralCode: string;
  pendingEarnings: number;
  paidEarnings: number;
}

export const ReferralSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    referralCode: '',
    pendingEarnings: 0,
    paidEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferralStats = async () => {
    try {
      // Get user's referral code from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      // Get referral usage stats with commission data
      const { data: usage, error: usageError } = await supabase
        .from('referral_usage')
        .select('discount_amount, commission_amount, payout_status')
        .eq('referrer_id', user?.id);

      if (usageError) throw usageError;

      const totalReferrals = usage?.length || 0;
      const totalEarnings = usage?.reduce((sum, item) => sum + (parseFloat(String(item.discount_amount)) || 0), 0) || 0;
      
      // Calculate pending and paid earnings from commission
      const pendingEarnings = usage
        ?.filter(item => item.payout_status === 'pending' || item.payout_status === 'approved')
        .reduce((sum, item) => sum + (parseFloat(String(item.commission_amount)) || 0), 0) || 0;
      
      const paidEarnings = usage
        ?.filter(item => item.payout_status === 'paid')
        .reduce((sum, item) => sum + (parseFloat(String(item.commission_amount)) || 0), 0) || 0;

      setStats({
        totalReferrals,
        totalEarnings,
        referralCode: profile?.referral_code || '',
        pendingEarnings,
        paidEarnings
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      toast({
        title: "Error",
        description: "Failed to load referral statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(stats.referralCode);
      toast({
        title: "Copied!",
        description: "Your referral code has been copied to clipboard"
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = stats.referralCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied!",
          description: "Your referral code has been copied to clipboard"
        });
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Please manually copy the code",
          variant: "destructive"
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const shareReferralLink = async () => {
    const url = `${window.location.origin}?ref=${stats.referralCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard"
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Link Copied!",
          description: "Your referral link has been copied to clipboard"
        });
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Please manually copy the link",
          variant: "destructive"
        });
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your referral code and earn rewards when friends make purchases!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Code Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Your Referral Code</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
              {stats.referralCode}
            </Badge>
            <Button variant="outline" size="sm" onClick={copyReferralCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={shareReferralLink} className="w-full">
            Share Referral Link
          </Button>
          <p className="text-xs text-muted-foreground">
            Friends get 10% off their order, and you earn 5% commission!
          </p>
        </div>

        {/* Earnings Section */}
        <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Your Commission Earnings
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-xl font-bold text-primary">£{stats.pendingEarnings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-xl font-bold text-green-600">£{stats.paidEarnings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Paid Out</div>
            </div>
          </div>
          {stats.pendingEarnings >= 20 && (
            <div className="pt-2">
              <Badge variant="default" className="w-full justify-center py-2">
                £20 minimum reached - Contact support to request payout
              </Badge>
            </div>
          )}
          {stats.pendingEarnings < 20 && (
            <p className="text-xs text-muted-foreground text-center">
              Earn £{(20 - stats.pendingEarnings).toFixed(2)} more to reach the £20 payout minimum
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">£{stats.totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Discounts Given</div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-2">
          <h4 className="font-medium">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Share your referral code with friends</li>
            <li>• They get 10% off their order</li>
            <li>• You earn 5% commission on their order total</li>
            <li>• Request payout when you reach £20 minimum</li>
            <li>• Get paid via PayPal or bank transfer</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};