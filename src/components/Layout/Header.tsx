import { useState } from 'react';
import { Menu, X, ShoppingBag, User, Settings, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import CurrencySwitcher from './CurrencySwitcher';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Header = () => {
  console.log('Header component rendering');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log('About to call useCartContext');
  const { getItemCount, toggleCart } = useCartContext();
  console.log('useCartContext returned successfully');
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const itemCount = getItemCount();

  const navItems = [
    { name: 'Shop', href: '/shop' },
    { name: 'Subscriptions', href: '/subscriptions' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-xl font-bold text-foreground hover:text-primary transition-colors">SNUSTHETIC</h1>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.filter(item => !['Shop', 'Subscriptions'].includes(item.name)).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === item.href 
                    ? "text-primary font-semibold" 
                    : "text-foreground hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Better grouped */}
          <div className="flex items-center space-x-4">
            {/* Currency and Subscribe group */}
            <div className="hidden md:flex items-center space-x-4 border-r border-border pr-4">
              <CurrencySwitcher />
              <Link
                to="/subscriptions"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Subscribe
              </Link>
            </div>
            
            {/* User actions group */}
            <div className="flex items-center space-x-2">
              {/* Admin Button - Compact on mobile */}
              {isAdmin && (
                <Button asChild size="sm" variant="accent" className="text-xs px-2 md:px-3">
                  <Link to="/admin" className="flex items-center gap-1 md:gap-2">
                    <Settings className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 md:p-2 text-foreground hover:text-primary transition-colors">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-border shadow-lg z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="p-1.5 md:p-2 text-foreground hover:text-primary transition-colors">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
              )}
              
              {/* Shopping Cart */}
              <button
                onClick={toggleCart}
                className="relative p-1.5 md:p-2 text-foreground hover:text-primary transition-colors"
              >
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 text-xs flex items-center justify-center p-0 min-w-0"
                  >
                    {itemCount}
                  </Badge>
                )}
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 text-foreground hover:text-primary transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors",
                  location.pathname === item.href 
                    ? "text-primary font-semibold" 
                    : "text-foreground hover:text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile-only items */}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-3 py-2">
                <CurrencySwitcher />
              </div>
            </div>
            
            {/* Mobile Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-primary border-l-2 border-primary bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;