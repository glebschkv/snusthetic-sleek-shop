import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { z } from 'zod';

const customBrandSchema = z.object({
  brandName: z.string().trim().min(1, 'Brand name is required').max(100),
  flavor: z.string().trim().min(1, 'Flavor is required').max(100),
  strength: z.string().trim().min(1, 'Strength is required'),
  email: z.string().trim().email('Valid email is required').max(255),
  quantityPreference: z.string().trim().optional(),
  additionalNotes: z.string().trim().max(1000).optional(),
});

type CustomBrandForm = z.infer<typeof customBrandSchema>;

interface CustomBrandRequestProps {
  userEmail?: string;
}

const CustomBrandRequest = ({ userEmail }: CustomBrandRequestProps) => {
  const [formData, setFormData] = useState<CustomBrandForm>({
    brandName: '',
    flavor: '',
    strength: '',
    email: userEmail || '',
    quantityPreference: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CustomBrandForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = customBrandSchema.parse(formData);
      setIsSubmitting(true);

      // Format the custom requirements for the edge function
      const customRequirements = `
Custom Brand Request:
Brand: ${validated.brandName}
Flavor: ${validated.flavor}
Strength: ${validated.strength}
Quantity Preference: ${validated.quantityPreference || 'Not specified'}
Additional Notes: ${validated.additionalNotes || 'None'}
      `.trim();

      const { error } = await supabase.functions.invoke('send-custom-order', {
        body: {
          firstName: 'Custom Brand',
          lastName: 'Request',
          email: validated.email,
          quantity: validated.quantityPreference || 'To be determined',
          customRequirements,
        },
      });

      if (error) throw error;

      toast({
        title: 'Request Submitted!',
        description: `We'll contact you at ${validated.email} if we can source ${validated.brandName} in ${validated.flavor} (${validated.strength}).`,
      });

      // Reset form
      setFormData({
        brandName: '',
        flavor: '',
        strength: '',
        email: userEmail || '',
        quantityPreference: '',
        additionalNotes: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        console.error('Error submitting custom brand request:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit request. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Request Custom Brand</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Don't see your preferred brand? Let us know what you're looking for and we'll contact you if we can source it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name *</Label>
            <Input
              id="brandName"
              placeholder="e.g., Siberia, Nordic Spirit"
              value={formData.brandName}
              onChange={handleChange('brandName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flavor">Flavor *</Label>
            <Input
              id="flavor"
              placeholder="e.g., Mint, Berry Frost"
              value={formData.flavor}
              onChange={handleChange('flavor')}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="strength">Strength *</Label>
            <Input
              id="strength"
              placeholder="e.g., 6mg, 9mg, 12mg"
              value={formData.strength}
              onChange={handleChange('strength')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantityPreference">Quantity Preference (optional)</Label>
          <Input
            id="quantityPreference"
            placeholder="e.g., 5 cans/month, 10 cans/month, 20 cans/month"
            value={formData.quantityPreference}
            onChange={handleChange('quantityPreference')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any other requirements or preferences..."
            value={formData.additionalNotes}
            onChange={handleChange('additionalNotes')}
            rows={4}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Card>
  );
};

export default CustomBrandRequest;
