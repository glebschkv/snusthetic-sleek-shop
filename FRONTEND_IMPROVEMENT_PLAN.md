# Snusthetic E-Commerce Frontend Improvement Plan

## Executive Summary

This document provides a comprehensive analysis of the Snusthetic UI design system and a detailed implementation plan for frontend improvements. Any feature added using this guide will seamlessly blend with the existing premium, minimalist aesthetic.

---

## Part 1: Design System Documentation

### 1.1 Brand Identity

**Design Philosophy:** Premium Minimalism (Apple-inspired)
- Clean, spacious layouts with generous whitespace
- Subtle animations that add delight without distraction
- Bold typography for headlines (Impact font)
- Nature-inspired green color palette (forest/sage)
- Transparent/outline button style (not filled)

**Target Aesthetic:**
- Luxury e-commerce feel
- High-end product presentation
- Professional but approachable
- Mobile-first responsive design

---

### 1.2 Color System

#### Primary Colors (Deep Forest Green)
```css
--primary: 140 35% 35%        /* hsl(140, 35%, 35%) - #3d7a4a */
--primary-hover: 140 40% 30%  /* Darker on hover */
--primary-glow: 140 40% 45%   /* Lighter for glow effects */
--primary-foreground: 0 0% 100% /* White text on primary */
```

#### Neutral Colors
```css
--background: 0 0% 100%       /* Pure white */
--foreground: 0 0% 9%         /* Near black text */
--surface: 0 0% 98%           /* Off-white sections */
--surface-elevated: 0 0% 96%  /* Elevated surfaces */
--muted: 0 0% 96%             /* Muted backgrounds */
--muted-foreground: 0 0% 45%  /* Secondary text */
```

#### Accent Colors
```css
--accent: 120 25% 45%         /* Olive green */
--sage: 120 20% 40%           /* Sage green */
--destructive: 0 84% 60%      /* Error red */
```

#### Border Colors
```css
--border: 0 0% 90%            /* Standard borders */
--border-subtle: 0 0% 85%     /* Lighter borders */
```

#### Usage Guidelines
| Color | When to Use |
|-------|-------------|
| `primary` | CTAs, active states, links, focus rings |
| `foreground` | Main text, headings, primary buttons |
| `muted-foreground` | Secondary text, descriptions, placeholders |
| `destructive` | Errors, delete actions, warnings |
| `accent/sage` | Secondary highlights, badges |
| `amber-600` | Stock warnings, caution states |
| `green-600` | Success messages, discounts |

---

### 1.3 Typography System

#### Font Families
```css
font-inter: 'Inter', sans-serif    /* Body text, UI elements */
font-impact: 'Impact', sans-serif  /* Headlines, hero text */
```

#### Type Scale
| Class | Size | Weight | Use Case |
|-------|------|--------|----------|
| `text-display` | 3rem → 3.75rem | Light (300) | Hero displays |
| `text-hero` | 2.25rem → 3rem | Light (300) | Section intros |
| `text-section` | 1.5rem → 1.875rem | Light (300) | Section headers |
| `text-body-large` | 1.125rem | Normal (400) | Important body text |
| `text-body` | 1rem | Normal (400) | Standard content |
| `text-caption` | 0.875rem | Medium (500) | Labels, uppercase |

#### Heading Patterns
```tsx
// Hero headline (homepage)
<h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-impact font-black tracking-wider leading-none">

// Page title (shop, about)
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">

// Section header
<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">

// Card title
<h3 className="font-semibold text-foreground text-sm leading-tight">

// Subsection
<h4 className="font-medium text-sm">
```

#### Text Styling Patterns
```tsx
// Primary text
<p className="text-foreground">

// Secondary/description text
<p className="text-muted-foreground">

// Small helper text
<p className="text-sm text-muted-foreground">

// Extra small text (stock warnings, labels)
<p className="text-xs text-muted-foreground">

// Warning text
<p className="text-xs text-amber-600">

// Success text
<span className="text-green-600">
```

---

### 1.4 Spacing System

#### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```
- Mobile: 16px horizontal padding
- Tablet: 24px horizontal padding
- Desktop: 32px horizontal padding
- Max width: 1280px (7xl)

#### Section Spacing
```tsx
// Standard section
<section className="py-16">

// Hero section with more space
<section className="py-16 lg:py-24">

// Compact section
<section className="py-8 sm:py-12">
```

#### Component Spacing
```tsx
// Card padding
<div className="p-4">        // 16px - standard card
<div className="p-6">        // 24px - larger cards

// Button padding (built into variants)
size="default" → h-12 px-6 py-3
size="sm" → h-9 px-4 py-2
size="lg" → h-14 px-8 py-4

// Gap patterns
gap-2   // 8px - tight grouping
gap-4   // 16px - standard grouping
gap-6   // 24px - card grids
gap-8   // 32px - section spacing
gap-12  // 48px - large section gaps
```

#### Vertical Rhythm
```tsx
// Between form fields
<div className="space-y-4">

// Between paragraphs
<div className="space-y-3">

// Between small elements
<div className="space-y-2">

// Between major sections
<div className="space-y-8">
```

---

### 1.5 Component Patterns

#### Cards
```tsx
// Standard product card
<div className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg">

// Card with lift effect (premium)
<div className="bg-gradient-card rounded-lg overflow-hidden transition-all duration-500 hover:shadow-prominent hover:-translate-y-2">

// Muted/subtle card (cart items)
<div className="p-3 bg-muted/50 rounded-lg">
```

#### Buttons
```tsx
// Primary action (high contrast)
<Button variant="default">Shop Now</Button>

// Secondary action
<Button variant="outline">Add to Cart</Button>

// Tertiary/subtle action
<Button variant="secondary">Continue Shopping</Button>

// Brand accent
<Button variant="accent">Admin</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Text link style
<Button variant="link">Learn More</Button>

// Icon only
<Button variant="ghost" size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

#### Inputs
```tsx
// Standard input
<Input
  className="h-10 border border-input rounded-md px-3 py-2 text-base md:text-sm"
  placeholder="Enter value..."
/>

// With label
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
  <Input id="email" type="email" />
</div>

// Error state
<div className="space-y-1">
  <Input className="border-destructive" />
  <p className="text-xs text-destructive">Error message</p>
</div>
```

#### Icons
```tsx
// Standard icon size
<Icon className="h-4 w-4" />

// Larger icons (header, empty states)
<Icon className="h-5 w-5" />

// Extra large (empty state hero)
<Icon className="h-16 w-16 text-muted-foreground" />

// Icon with text
<div className="flex items-center gap-2">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</div>
```

#### Badges
```tsx
// Cart count badge
<Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 text-xs flex items-center justify-center p-0 min-w-0">
  {count}
</Badge>

// Status badge
<Badge variant="secondary" className="text-xs">
  <Icon className="h-3 w-3 mr-1" />
  Monthly
</Badge>
```

---

### 1.6 Animation & Transitions

#### Standard Transitions
```tsx
// All properties (default for interactive)
transition-all duration-300

// Color only (links, text)
transition-colors

// Transform only (scale, translate)
transition-transform duration-300
```

#### Hover Effects
```tsx
// Card lift effect
hover:shadow-lg hover:-translate-y-2

// Image zoom (inside group)
group-hover:scale-105

// Color change
hover:text-primary

// Button scale
hover:scale-105

// Opacity reveal
opacity-70 hover:opacity-100
```

#### Loading States
```tsx
// Spinner
<Loader2 className="h-8 w-8 animate-spin" />

// With text
<div className="flex items-center gap-2">
  <Loader2 className="h-4 w-4 animate-spin" />
  <span>Loading...</span>
</div>

// Skeleton placeholder
<div className="animate-pulse rounded-md bg-muted h-[200px]" />
```

---

### 1.7 Layout Patterns

#### Page Structure
```tsx
<div className="min-h-screen bg-background">
  <Header />
  <main>
    {/* Hero/Banner Section */}
    <section className="bg-primary/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1>...</h1>
        <p className="text-muted-foreground">...</p>
      </div>
    </section>

    {/* Content Section */}
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
      </div>
    </section>
  </main>
  <Footer />
</div>
```

#### Grid Layouts
```tsx
// Product grid (responsive)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Two column layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// Footer columns
<div className="grid grid-cols-1 md:grid-cols-5 gap-12">
```

#### Flex Patterns
```tsx
// Horizontal with space between
<div className="flex items-center justify-between">

// Centered
<div className="flex items-center justify-center">

// Horizontal grouping
<div className="flex items-center gap-4">

// Vertical stack
<div className="flex flex-col space-y-4">
```

---

### 1.8 Responsive Breakpoints

```
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

#### Common Responsive Patterns
```tsx
// Text size scaling
text-4xl sm:text-5xl lg:text-6xl

// Padding scaling
px-4 sm:px-6 lg:px-8

// Grid columns
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

// Show/hide
hidden md:flex    // Hide on mobile
md:hidden         // Hide on desktop

// Icon sizing
h-4 w-4 md:h-5 md:w-5
```

---

## Part 2: Recommended Improvements

### Priority 1: Product Search (Critical - Missing Feature)

**Problem:** No way for users to search for products by name or description.

**Implementation:**

```tsx
// src/components/Store/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search products..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value); // Real-time filtering
          }}
          placeholder={placeholder}
          className="pl-10 pr-10 h-10 border-border"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
```

**Integration in Shop.tsx:**
```tsx
// Add to existing filter section
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
    <SearchBar
      onSearch={setSearchQuery}
      placeholder="Search holders..."
    />
    <CategoryFilter ... />
  </div>
  {/* View mode toggle */}
</div>

// Filter logic
const filteredProducts = physicalProducts
  .filter(p => selectedCategory === 'all' || p.category?.slug === selectedCategory)
  .filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });
```

---

### Priority 2: Skeleton Loading States (UX Enhancement)

**Problem:** Generic spinner doesn't show content structure while loading.

**Implementation:**

```tsx
// src/components/Store/ProductCardSkeleton.tsx
const ProductCardSkeleton = ({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden p-4">
        <div className="flex gap-4">
          <div className="w-32 h-32 rounded-lg bg-muted animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-muted rounded animate-pulse w-20" />
              <div className="h-9 bg-muted rounded-lg animate-pulse w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden min-h-[420px]">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        <div className="flex gap-2 py-2">
          <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
          <div className="h-9 bg-muted rounded-lg animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
```

**Usage:**
```tsx
{loading ? (
  <div className={gridClasses}>
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} viewMode={viewMode} />
    ))}
  </div>
) : (
  // Actual products
)}
```

---

### Priority 3: Empty Search Results State

**Implementation:**

```tsx
// When no products match search/filter
{filteredProducts.length === 0 && !loading && (
  <div className="text-center py-16">
    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">No products found</h3>
    <p className="text-muted-foreground mb-6">
      {searchQuery
        ? `No results for "${searchQuery}"`
        : 'No products in this category'}
    </p>
    <div className="flex justify-center gap-4">
      {searchQuery && (
        <Button variant="outline" onClick={() => setSearchQuery('')}>
          Clear Search
        </Button>
      )}
      {selectedCategory !== 'all' && (
        <Button variant="secondary" onClick={() => setSelectedCategory('all')}>
          View All Products
        </Button>
      )}
    </div>
  </div>
)}
```

---

### Priority 4: Wishlist Feature

**Implementation Plan:**

1. **Database:** Add `wishlists` table in Supabase
2. **Context:** Create `WishlistContext` for state management
3. **UI Components:**

```tsx
// Heart button on ProductCard
<button
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  }}
  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-all z-10"
>
  <Heart
    className={cn(
      "h-4 w-4 transition-colors",
      isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
    )}
  />
</button>

// Wishlist page (new route /wishlist)
// Similar layout to Shop.tsx but filtering by wishlist items
```

---

### Priority 5: Price Range Filter

**Implementation:**

```tsx
// src/components/Store/PriceRangeFilter.tsx
import { Slider } from '@/components/ui/slider';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeFilter = ({ min, max, value, onChange }: PriceRangeFilterProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4 w-full max-w-xs">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Price Range</span>
        <span className="font-medium">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={5}
        value={value}
        onValueChange={onChange}
        className="w-full"
      />
    </div>
  );
};

export default PriceRangeFilter;
```

---

### Priority 6: Quick View Modal

**Implementation:**

```tsx
// src/components/Store/QuickViewModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, ProductVariant } from '@/types/store';
import ColorSelector from './ColorSelector';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';
import { Eye } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
}

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) => {
  const { formatPrice } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );

  if (!product) return null;

  const currentPrice = product.price + (selectedVariant?.price_adjustment || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={selectedVariant?.image_url || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Color</p>
                <ColorSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-2xl font-bold mb-4">{formatPrice(currentPrice)}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onAddToCart(product, selectedVariant);
                    onClose();
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  View Full Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Quick view button for ProductCard
<Button
  variant="ghost"
  size="icon"
  className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
  onClick={(e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  }}
>
  <Eye className="h-4 w-4" />
</Button>
```

---

### Priority 7: Recently Viewed Products

**Implementation:**

```tsx
// src/hooks/useRecentlyViewed.ts
import { useState, useEffect } from 'react';
import { Product } from '@/types/store';

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addToRecentlyViewed };
};

// Component to display
const RecentlyViewedSection = ({ products, recentIds }: Props) => {
  const recentProducts = recentIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} ... />
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### Priority 8: Accessibility Improvements

**Required ARIA Labels:**

```tsx
// Header icons
<button
  onClick={toggleCart}
  aria-label={`Shopping cart with ${itemCount} items`}
  className="..."
>
  <ShoppingBag className="h-5 w-5" />
</button>

<button
  aria-label="Open user menu"
  className="..."
>
  <User className="h-5 w-5" />
</button>

<button
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  className="..."
>
  <Menu className="h-5 w-5" />
</button>

// Color selector
<button
  aria-label={`Select ${variant.color_name} color`}
  aria-pressed={selectedVariant?.id === variant.id}
  className="..."
>
  <div style={{ backgroundColor: variant.color_hex }} />
</button>

// View mode toggle
<Button
  aria-label="Grid view"
  aria-pressed={viewMode === 'grid'}
  ...
>
  <Grid className="h-4 w-4" />
</Button>
```

---

### Priority 9: Code Splitting (Performance)

**Implementation in App.tsx:**

```tsx
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// In routes
<Route
  path="/admin"
  element={
    <Suspense fallback={<PageLoader />}>
      <AdminDashboard />
    </Suspense>
  }
/>
```

---

### Priority 10: Toast Notification Improvements

**Standardized toast patterns:**

```tsx
// Success
toast({
  title: "Added to cart",
  description: `${product.name} has been added to your cart.`,
});

// Error
toast({
  title: "Error",
  description: "Failed to add item. Please try again.",
  variant: "destructive",
});

// Warning
toast({
  title: "Low stock",
  description: `Only ${stock} items remaining.`,
});

// With action
toast({
  title: "Item removed",
  description: `${product.name} was removed from your cart.`,
  action: (
    <Button variant="outline" size="sm" onClick={undoRemove}>
      Undo
    </Button>
  ),
});
```

---

## Part 3: Implementation Checklist

### Phase 1: Quick Wins (1-2 hours each)
- [ ] Add product search bar to Shop page
- [ ] Implement skeleton loading states
- [ ] Add empty state for no search results
- [ ] Add ARIA labels to all interactive icons
- [ ] Add code splitting for heavy pages

### Phase 2: Core Features (2-4 hours each)
- [ ] Price range filter
- [ ] Quick view modal
- [ ] Recently viewed products section
- [ ] Improved toast notifications with undo

### Phase 3: Major Features (4-8 hours each)
- [ ] Wishlist feature (database + UI + context)
- [ ] Customer reviews/ratings system
- [ ] Order history page

### Phase 4: Polish
- [ ] Keyboard navigation testing
- [ ] Mobile gesture improvements
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit

---

## Part 4: Component Templates

### New Component Checklist
When creating any new component, ensure it follows these patterns:

1. **Styling:** Use Tailwind classes that match the design system
2. **Spacing:** Use the established spacing scale (gap-4, p-4, space-y-4)
3. **Colors:** Only use CSS variable colors (text-foreground, bg-card, etc.)
4. **Border radius:** Use rounded-lg (8px) for cards, rounded-md for inputs
5. **Transitions:** Use transition-all duration-300 for interactive elements
6. **Typography:** Match existing text sizes and weights
7. **Responsive:** Always add mobile-first responsive classes
8. **Accessibility:** Include aria-labels for icon buttons
9. **Loading states:** Use Loader2 with animate-spin
10. **Icons:** Use Lucide React, size h-4 w-4 or h-5 w-5

### Standard Component Template
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  // ... other props
}

const MyComponent = ({ className, ...props }: MyComponentProps) => {
  return (
    <div className={cn(
      "bg-card rounded-lg border border-border p-4 transition-all duration-300",
      className
    )}>
      {/* Content */}
    </div>
  );
};

export default MyComponent;
```

---

## Summary

This plan provides everything needed to maintain design consistency while adding new features. The key principles to remember:

1. **Minimalism:** Don't add unnecessary elements
2. **Consistency:** Use existing patterns, don't invent new ones
3. **Performance:** Lazy load, use skeletons, optimize images
4. **Accessibility:** Always add ARIA labels and keyboard support
5. **Responsiveness:** Mobile-first, test all breakpoints

Any feature implemented following this guide will seamlessly blend with the existing Snusthetic aesthetic.
