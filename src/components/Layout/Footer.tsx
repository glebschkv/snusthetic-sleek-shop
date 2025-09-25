import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-medium tracking-tight">Snusthetic</h3>
            
            {/* Social Media */}
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-medium">Collections</h4>
            <ul className="space-y-3">
              <li><a href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Luxury Series</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Limited Edition</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Custom Orders</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-medium">Customer Care</h4>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Care Instructions</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Warranty</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-3">
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Craftsmanship</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Press Kit</a></li>
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2024 Snusthetic AB. All rights reserved. Handcrafted in Stockholm, Sweden.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                VAT Registration: SE123456789001 | Company Reg: 556123-4567
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Cookie Policy
              </a>
              <a href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;