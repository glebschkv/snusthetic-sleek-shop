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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      currencyDisplay: 'symbol'
    }).format(convertedPrice);
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