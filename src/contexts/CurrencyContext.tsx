import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.73, name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', rate: 1.35, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.45, name: 'Australian Dollar' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency.code);
  };

  const convertPrice = (price: number): number => {
    return price * selectedCurrency.rate;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
    
    // Only remove trailing zeros if they come after the decimal point and are truly trailing
    // e.g., "€28.00" → "€28" or "€28.10" → "€28.1", but keep "€28.90" as "€28.9"
    return formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  };

  return (
    <CurrencyContext.Provider 
      value={{
        selectedCurrency,
        currencies,
        setCurrency,
        formatPrice,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};