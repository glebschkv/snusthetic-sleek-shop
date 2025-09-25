import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-hero mb-8">Contact Us</h1>
          <p className="text-body-large text-muted-foreground">
            Custom orders, bulk purchases, or general questions - we're here to help you find the perfect solution.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-section mb-6">How Can We Help?</h2>
                <div className="space-y-4 mb-8">
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Custom Orders</h3>
                    <p className="text-muted-foreground text-sm">Looking for a unique design or personalization? We create bespoke pieces tailored to your specifications.</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Bulk Orders</h3>
                    <p className="text-muted-foreground text-sm">Need larger quantities for your business or event? Contact us for special pricing and customization options.</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">General Questions</h3>
                    <p className="text-muted-foreground text-sm">Have questions about our products, shipping, or anything else? We're here to help.</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Reach out to us through any of the following channels. 
                  We typically respond within 24 hours.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">hello@snusthetic.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">+46 8 123 456 78</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Stockholm, Sweden<br />
                      Handcrafted with care
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface rounded-lg p-8">
              <h3 className="text-xl font-medium mb-6">Tell us about your project</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="subject">Type of Inquiry</Label>
                  <select id="subject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select inquiry type...</option>
                    <option value="custom">Custom Order</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="general">General Question</option>
                    <option value="support">Product Support</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please provide details about your custom design, quantity needed, or any questions you have..."
                    rows={6}
                  />
                </div>
                
                <Button className="btn-primary w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;