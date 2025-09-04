import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-hero mb-8">About Snusthetic</h1>
          <p className="text-body-large text-muted-foreground leading-relaxed">
            We believe that true beauty lies in simplicity. Founded on the principles 
            of minimalism and craftsmanship, Snusthetic creates products that enhance 
            your daily life through thoughtful design and uncompromising quality.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-section">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Born from a passion for clean design and functional beauty, Snusthetic 
                  emerged as a response to the cluttered world around us. Our founders 
                  envisioned a brand that would strip away the unnecessary and focus on 
                  what truly matters.
                </p>
                <p>
                  Every product we create follows our core philosophy: form follows 
                  function, and beauty emerges from purposeful design. We work with 
                  master craftsmen and use only the finest materials to ensure each 
                  piece meets our exacting standards.
                </p>
              </div>
            </div>
            
            <div className="aspect-square bg-muted rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-section mb-6">Our Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Simplicity</h3>
              <p className="text-muted-foreground">
                We eliminate the unnecessary to reveal the essential, creating products 
                that are both beautiful and functional.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Quality</h3>
              <p className="text-muted-foreground">
                Every detail matters. We use premium materials and time-tested 
                techniques to ensure lasting quality.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Sustainability</h3>
              <p className="text-muted-foreground">
                We believe in creating products that stand the test of time, reducing 
                waste through thoughtful design and durable construction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;