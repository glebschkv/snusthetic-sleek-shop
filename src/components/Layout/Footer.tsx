const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium tracking-tight">Snusthetic</h3>
            <p className="text-muted-foreground leading-relaxed">
              Premium minimalism for the modern lifestyle. Clean design, exceptional quality.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-medium">Shop</h4>
            <ul className="space-y-3">
              <li><a href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">All Products</a></li>
              <li><a href="/shop/accessories" className="text-muted-foreground hover:text-foreground transition-colors">Accessories</a></li>
              <li><a href="/shop/lifestyle" className="text-muted-foreground hover:text-foreground transition-colors">Lifestyle</a></li>
              <li><a href="/shop/new" className="text-muted-foreground hover:text-foreground transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-3">
              <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="/press" className="text-muted-foreground hover:text-foreground transition-colors">Press</a></li>
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Snusthetic. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;