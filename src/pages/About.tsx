import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Settings, Package, Sparkles, Scissors, Minimize, Truck, Zap, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import narcoProductImage from '@/assets/narco-product-showcase.jpeg';
import metalRibbedComparison from '@/assets/metal-ribbed-comparison.jpeg';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium">
              About Snusthetic
            </Badge>
            
            <h1 className="text-display leading-tight">
              <span className="block">Built for the culture.</span>
              <span className="block text-muted-foreground">Built to last.</span>
            </h1>
            
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We design premium metal tins for nicotine pouch users who care about durability, 
              function, and clean aesthetics. Pocket-ready, abuse-proof, and undeniably good looking.
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/shop">Shop tins</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <Shield className="w-6 h-6" />
                <span className="text-sm font-medium">Durable metal</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Settings className="w-6 h-6" />
                <span className="text-sm font-medium">Precision-built</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Package className="w-6 h-6" />
                <span className="text-sm font-medium">Pocket-ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-section text-center mb-16">From sketch to pocket</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 space-y-4">
                <Badge variant="outline" className="rounded-full">2023</Badge>
                <h3 className="text-xl font-semibold">The spark</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Four friends. One shared frustration with flimsy tins. A napkin sketch that became a mission.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 space-y-4">
                <Badge variant="outline" className="rounded-full">2024</Badge>
                <h3 className="text-xl font-semibold">Dialing it in</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Prototypes, feedback, refinement. Testing materials until we found the perfect balance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 space-y-4">
                <Badge variant="outline" className="rounded-full">2025</Badge>
                <h3 className="text-xl font-semibold">In stock</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manufacturing locked in. Quality locked down. Ready to ship to your pocket.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 space-y-4">
                <Badge variant="outline" className="rounded-full">Next</Badge>
                <h3 className="text-xl font-semibold">Your pocket</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  New designs, new finishes. We're just getting started. Join the journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-section">Materials, finish, feel</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Premium metals</h3>
                    <p className="text-sm text-muted-foreground">
                      Aluminum and stainless steel. Built to handle daily abuse.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Scissors className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Precision machining</h3>
                    <p className="text-sm text-muted-foreground">
                      CNC-cut tolerances. Smooth edges. That satisfying click.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Minimize className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Pocket-optimized</h3>
                    <p className="text-sm text-muted-foreground">
                      Slim profile. Rounded corners. Designed to disappear until you need it.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Truck className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Ready to ship</h3>
                    <p className="text-sm text-muted-foreground">
                      Quality-tested. Packaged with care. In stock and on the way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <img 
              src={narcoProductImage} 
              alt="Snusthetic Narco collection showing multiple color variants" 
              className="aspect-square object-cover rounded-2xl shadow-lg" 
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-section">Our story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Snusthetic was founded by four friends who were tired of flimsy, forgettable 
                  packaging. We wanted something that felt worthy of the ritual: a tin that's 
                  solid, refined, and made to ride in your pocket every day.
                </p>
                <p>
                  What started as a sketch turned into a full product line—engineered with 
                  premium metals, tuned tolerances, and just the right snap. It's storage, yes. 
                  But it's also gear.
                </p>
              </div>
            </div>
            
            <div className="lg:sticky lg:top-24">
              <img 
                src={metalRibbedComparison} 
                alt="Metal and ribbed design - engineered for longevity and precision" 
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Built to last</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use materials that can handle years of pocket carry. No planned obsolescence here.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Quick access</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One-hand operation. Smooth mechanics. Get what you need without fumbling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Designed responsibly</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Quality over quantity. Products built to reduce waste through longevity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;