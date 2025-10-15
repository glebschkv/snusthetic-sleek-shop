import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const isMobile = useIsMobile();

  const desktopMessages = [
    "Buy 2 tins, get 15% OFF • Stock up and save",
    "Buy 3+ tins, get 25% OFF • Limited-time offer",
    "Free shipping on orders over $50 • Worldwide delivery available",
    "Limited Edition Designs now live • Don't miss your favorite tin",
    "New restock just dropped • Grab your favorite tin before it's gone",
    "Snusthetic Rewards coming soon • Stay tuned",
    "Join our newsletter • Exclusive drops & discounts inside",
    "Premium tins for your pouches • Designed for durability and style",
    "Your pouches deserve better • Shop Snusthetic tins now"
  ];

  const mobileMessages = [
    "Buy 2 tins, get 15% OFF",
    "Buy 3+ tins, get 25% OFF",
    "Free shipping over $50",
    "Limited Edition Designs live",
    "New restock just dropped",
    "Snusthetic Rewards coming soon",
    "Join our newsletter",
    "Premium tins for your pouches",
    "Shop Snusthetic tins now"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % desktopMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const displayText = isMobile ? mobileMessages[currentMessageIndex] : desktopMessages[currentMessageIndex];

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