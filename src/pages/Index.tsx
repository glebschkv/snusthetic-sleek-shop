import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/Home/HeroSection';
import ProductGrid from '@/components/Home/ProductGrid';
import FeatureSection from '@/components/Home/FeatureSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductGrid />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
