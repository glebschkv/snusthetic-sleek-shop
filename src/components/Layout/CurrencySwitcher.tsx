import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencySwitcher = () => {
  const { selectedCurrency, currencies, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Globe className="h-3 w-3" />
          <span className="hidden sm:inline">{selectedCurrency.code}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency)}
            className={`flex items-center justify-between ${
              selectedCurrency.code === currency.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm">{currency.symbol}</span>
              <span>{currency.code}</span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {currency.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;