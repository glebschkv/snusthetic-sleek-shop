import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, PackageCheck, Calendar, CreditCard } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import BrandSelector from '@/components/Subscription/BrandSelector';
import FlavorStrengthSelector from '@/components/Subscription/FlavorStrengthSelector';
import QuantitySelector from '@/components/Subscription/QuantitySelector';
import ProductDetailsAccordion from '@/components/Subscription/ProductDetailsAccordion';
import CustomBrandRequest from '@/components/Subscription/CustomBrandRequest';

interface Brand {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  brand_id: string;
  flavor: string;
  strength_mg: number;
  image_url?: string;
}

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice, convertPrice, selectedCurrency } = useCurrency();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  
  // Selection state
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<number | null>(null);
  const [quantityType, setQuantityType] = useState<'5' | '10' | '20' | 'custom'>('10');
  const [customQuantity, setCustomQuantity] = useState(25);
  const [isCustomBrandRequest, setIsCustomBrandRequest] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

      // Fetch nicotine pouch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          currency,
          brand_id,
          flavor,
          strength_mg,
          image_url
        `)
        .eq('product_type', 'nicotine_pouch')
        .eq('is_available', true)
        .order('flavor');

      if (productsError) throw productsError;
      setProducts(productsData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription options');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedProduct = () => {
    if (!selectedBrand || !selectedFlavor || selectedStrength === null) return null;
    return products.find(
      p => p.brand_id === selectedBrand.id && 
           p.flavor === selectedFlavor && 
           p.strength_mg === selectedStrength
    );
  };

  const getQuantity = () => {
    if (quantityType === 'custom') return customQuantity;
    return parseInt(quantityType);
  };

  const handleSelectQuantity = (type: '5' | '10' | '20' | 'custom', customValue?: number) => {
    setQuantityType(type);
    if (type === 'custom' && customValue !== undefined) {
      setCustomQuantity(customValue);
    }
  };

  const calculatePrice = () => {
    const quantity = getQuantity();
    const product = getSelectedProduct();
    if (!product) return { pricePerCan: 0, totalPrice: 0, savings: 0, discountPercent: 0, storePricePerCan: 0 };
    
    // Average store price per can in GBP
    const STORE_PRICE_GBP = 7;
    
    // Products are stored in GBP, convert to USD base first (GBP rate is 0.73)
    // Then convertPrice will handle USD to selected currency
    const priceInUSD = product.price / 0.73;
    const basePrice = convertPrice(priceInUSD);
    
    // Convert store price to selected currency
    const storePriceInUSD = STORE_PRICE_GBP / 0.73;
    const storePriceConverted = convertPrice(storePriceInUSD);
    
    let discountPercent = 0;
    if (quantityType === '5') discountPercent = 0;
    else if (quantityType === '10') discountPercent = 5;
    else if (quantityType === '20') discountPercent = 10;
    else if (quantityType === 'custom') discountPercent = 10;
    
    const pricePerCan = basePrice * (1 - discountPercent / 100);
    const totalPrice = pricePerCan * quantity;
    
    // Calculate real savings vs store price
    const totalStorePrice = storePriceConverted * quantity;
    const realSavings = totalStorePrice - totalPrice;
    
    return { pricePerCan, totalPrice, savings: realSavings, discountPercent, storePricePerCan: storePriceConverted };
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      navigate('/auth');
      return;
    }

    const selectedProduct = getSelectedProduct();
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const quantity = getQuantity();
    if (quantityType === 'custom' && quantity < 5) {
      toast.error('Custom quantity must be at least 5 cans');
      return;
    }

    try {
      setSubscribing(true);
      
      const { totalPrice } = calculatePrice();
      
      console.log('Calling create-subscription with:', {
        product_id: selectedProduct.id,
        quantity_type: quantityType,
        quantity: quantity,
        currency: selectedCurrency.code,
        converted_price: totalPrice,
      });
      
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          product_id: selectedProduct.id,
          quantity_type: quantityType,
          quantity: quantity,
          currency: selectedCurrency.code.toLowerCase(),
          converted_price: totalPrice,
          return_url: `${window.location.origin}/profile?subscription_success=true`
        }
      });

      console.log('Response from create-subscription:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from edge function');
      }

      // Check multiple possible response structures
      const checkoutUrl = data.checkout_url || data?.data?.checkout_url;
      
      console.log('Checkout URL:', checkoutUrl);

      if (checkoutUrl) {
        console.log('Redirecting to:', checkoutUrl);
        // Open in new tab (works in sandboxed iframes like Lovable preview)
        const newWindow = window.open(checkoutUrl, '_blank');
        if (!newWindow) {
          toast.error('Please allow popups to complete checkout');
        } else {
          toast.success('Opening Stripe checkout...');
        }
      } else {
        console.error('Full response data:', JSON.stringify(data, null, 2));
        throw new Error('No checkout URL received. Check console for details.');
      }
      
    } catch (error) {
      console.error('Error creating subscription:', error);
      
      // More detailed error message
      if (error instanceof Error) {
        toast.error(`Failed to start subscription: ${error.message}`);
      } else {
        toast.error('Failed to start subscription. Please try again.');
      }
      
      setSubscribing(false);
    }
  };

  const brandProducts = selectedBrand
    ? products.filter(p => p.brand_id === selectedBrand.id)
    : [];

  const selectedProduct = getSelectedProduct();
  const isProductSelected = selectedProduct !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Never Miss Your Favorite Nicotine Pouches
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe and save on Zyn and Velo products. Cancel anytime, pause deliveries, and enjoy free shipping.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <PackageCheck className="h-5 w-5" />
              <span className="font-semibold">Save up to 10% with subscription</span>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="p-6 text-center">
                <Check className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  All subscription orders ship for free
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Pause, skip, or cancel anytime
                </p>
              </Card>
              <Card className="p-6 text-center">
                <CreditCard className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Bulk Discounts</h3>
                <p className="text-sm text-muted-foreground">
                  Save more when you order more
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscription-Only Info Section */}
        <section className="py-8 bg-accent/5">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">Introducing the SnusScription</h3>
            <p className="text-muted-foreground mb-4">
              Our nicotine pouch products (Zyn & Velo) are available exclusively through 
              monthly subscriptions. This ensures you never run out and always get the best pricing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Never Run Out</h4>
                <p className="text-sm text-muted-foreground">
                  Automatic monthly deliveries
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">💰 Best Pricing</h4>
                <p className="text-sm text-muted-foreground">
                  Save up to 10% with bulk orders
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">🔄 Flexible</h4>
                <p className="text-sm text-muted-foreground">
                  Cancel or modify anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Selection */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <BrandSelector
              brands={brands}
              selectedBrand={selectedBrand}
              onSelectBrand={(brand) => {
                setSelectedBrand(brand);
                setSelectedFlavor(null);
                setSelectedStrength(null);
                setIsCustomBrandRequest(false);
              }}
              onSelectCustom={() => {
                setIsCustomBrandRequest(true);
                setSelectedBrand(null);
                setSelectedFlavor(null);
                setSelectedStrength(null);
              }}
              isCustomSelected={isCustomBrandRequest}
            />
          </div>
        </section>

        {/* Custom Brand Request */}
        {isCustomBrandRequest && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <CustomBrandRequest userEmail={user?.email} />
            </div>
          </section>
        )}

        {/* Product Customization */}
        {selectedBrand && !isCustomBrandRequest && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <FlavorStrengthSelector
                products={brandProducts}
                selectedFlavor={selectedFlavor}
                selectedStrength={selectedStrength}
                onSelectFlavor={(flavor) => {
                  setSelectedFlavor(flavor);
                  setSelectedStrength(null);
                }}
                onSelectStrength={setSelectedStrength}
              />
            </div>
          </section>
        )}

        {/* Quantity Selection */}
        {isProductSelected && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <QuantitySelector
                basePrice={selectedProduct.price / 0.73}
                selectedQuantity={getQuantity()}
                quantityType={quantityType}
                customQuantity={customQuantity}
                onSelectQuantity={handleSelectQuantity}
              />
            </div>
          </section>
        )}

        {/* Product Details */}
        {isProductSelected && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <ProductDetailsAccordion product={selectedProduct} />
            </div>
          </section>
        )}

        {/* Subscribe Button */}
        {isProductSelected && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
              <div className="mb-4">
                <p className="text-2xl font-bold">{formatPrice(calculatePrice().totalPrice)}/month</p>
                <p className="text-sm text-green-600 font-semibold">
                  Save {formatPrice(calculatePrice().savings)} vs. {formatPrice(calculatePrice().storePricePerCan)} average shop price per can
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Shipping will be calculated at checkout based on your location
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="text-lg px-12 py-6"
              >
                {subscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                You'll be taken to secure checkout
              </p>
            </div>
          </section>
        )}

        {/* Cancellation Policy */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cancellation & Flexibility</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Cancel anytime - no penalties or fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Pause or skip deliveries when you need</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Modify quantities or flavors between deliveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Manage everything from your account dashboard</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;
