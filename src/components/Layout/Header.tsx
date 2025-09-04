import { useState } from 'react';
import { Menu, X, ShoppingBag, Search, User, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-gradient-primary text-primary-foreground text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Shield className="h-4 w-4" />
          <span>Free Worldwide Shipping on Orders Over $150 | 30-Day Money Back Guarantee</span>
          <Star className="h-4 w-4 fill-current" />
        </div>
      </div>
      
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-medium tracking-tight">Snusthetic</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border-subtle">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;