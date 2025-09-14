import AdminPromoter from '@/components/AdminPromoter';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/Home/HeroSection';
import ProductGrid from '@/components/Home/ProductGrid';
import FeatureSection from '@/components/Home/FeatureSection';
import TrustSection from '@/components/Home/TrustSection';
import NewsletterSection from '@/components/Home/NewsletterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
    <main>
      <AdminPromoter />
      <HeroSection />
        <ProductGrid />
        <TrustSection />
        <FeatureSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
