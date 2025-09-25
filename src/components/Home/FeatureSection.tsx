import { Package, Users, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const FeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">Custom & Bulk Orders</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Need something special? Looking to order in bulk? We're here to help create the perfect 
            snus storage solution for your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bulk Order Information */}
          <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-sage rounded-full">
                    <Users className="h-6 w-6 text-sage-foreground" />
                  </div>
                  <div>
                    <CardTitle>Bulk Orders</CardTitle>
                    <CardDescription>Corporate gifts, events, or large quantities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Perfect for corporate gifts, special events, or when you need multiple units. 
                  We offer competitive pricing for bulk orders and can customize packaging.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4" />
                  <span>Minimum 10 units for bulk pricing</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-sage rounded-full">
                    <Mail className="h-6 w-6 text-sage-foreground" />
                  </div>
                  <div>
                    <CardTitle>Contact for Special Orders</CardTitle>
                    <CardDescription>Custom finishes, engravings, or unique requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For bulk orders or custom requests, reach out to us directly:
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> orders@snusthetic.com</div>
                  <div><strong>Phone:</strong> +46 123 456 789</div>
                  <div><strong>Response Time:</strong> Within 24 hours</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Order Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Custom Order Request</CardTitle>
              <CardDescription>
                Tell us about your specific needs and we'll get back to you with options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Estimated Quantity</Label>
                <Input id="quantity" type="number" placeholder="10" min="1" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Custom Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Describe your custom requirements: specific colors, engravings, packaging needs, timeline, etc."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                Submit Custom Order Request
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                We'll review your request and get back to you within 24 hours with pricing and availability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;