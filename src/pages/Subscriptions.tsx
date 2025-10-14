import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
import { useCartContext } from '@/contexts/CartContext';
import { Product as StoreProduct } from '@/types/store';

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
  const { addItem, openCart } = useCartContext();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<number | null>(null);
  const [quantityType, setQuantityType] = useState<'5' | '10' | '20' | 'custom'>('10');
  const [customQuantity, setCustomQuantity] = useState(25);

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
    const basePrice = getSelectedProduct()?.price || 0;
    
    let discountPercent = 0;
    if (quantityType === '5') discountPercent = 15;
    else if (quantityType === '10') discountPercent = 20;
    else if (quantityType === '20') discountPercent = 25;
    else if (quantityType === 'custom') discountPercent = 10;
    
    const pricePerCan = basePrice * (1 - discountPercent / 100);
    const totalPrice = pricePerCan * quantity;
    const savings = (basePrice * quantity) - totalPrice;
    
    return { pricePerCan, totalPrice, savings, discountPercent };
  };

  const handleAddToCart = () => {
    const selectedProduct = getSelectedProduct();
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const quantity = getQuantity();
    if (quantityType === 'custom' && quantity < 25) {
      toast.error('Custom quantity must be at least 25 cans');
      return;
    }

    addItem(
      selectedProduct as unknown as StoreProduct, 
      quantity, 
      undefined,
      {
        quantity_type: quantityType,
        billing_interval: 'month',
        brand_name: selectedBrand?.name,
        flavor: selectedFlavor || undefined,
        strength_mg: selectedStrength || undefined
      }
    );
    
    openCart();
    toast.success('Subscription added to cart!');
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
              <span className="font-semibold">Save up to 25% with subscription</span>
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
            <h3 className="text-2xl font-bold mb-4">Subscription-Only Nicotine Pouches</h3>
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
                  Save 15-25% with subscriptions
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
              }}
            />
          </div>
        </section>

        {/* Product Customization */}
        {selectedBrand && (
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
                basePrice={selectedProduct.price}
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
                <p className="text-2xl font-bold">€{calculatePrice().totalPrice.toFixed(2)}/month</p>
                <p className="text-sm text-green-600">
                  Save €{calculatePrice().savings.toFixed(2)} ({calculatePrice().discountPercent}% off)
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="text-lg px-12 py-6"
              >
                Add to Cart
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Review your subscription in cart before checkout
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
