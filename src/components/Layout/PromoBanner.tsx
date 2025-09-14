import { useState } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  if (!isVisible) return null;

  const desktopText = "BUY 2 GET 15% OFF • FREE SHIPPING OVER $50 • BUY 3+ GET 25% OFF • LIMITED TIME OFFER";
  const mobileText = "BUY 2 GET 15% OFF • FREE SHIPPING $50+ • 25% OFF 3+ ITEMS";
  const displayText = isMobile ? mobileText : desktopText;

  return (
    <div className="relative bg-foreground text-background py-2 overflow-hidden animate-slide-down">
      <div className="relative flex items-center justify-center overflow-hidden w-full max-w-full">
        {/* Scrolling text container */}
        <div className="flex whitespace-nowrap animate-scroll-right w-max no-scrollbar">
          <span className={`inline-block px-8 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {displayText}
          </span>
          <span className={`inline-block px-8 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {displayText}
          </span>
          <span className={`inline-block px-8 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {displayText}
          </span>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-background/20 rounded-full transition-colors z-10"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;