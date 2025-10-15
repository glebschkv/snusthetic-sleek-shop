// Shipping cost utility functions

// EU member states country codes
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

// Shipping costs in GBP
const SHIPPING_COSTS = {
  EU_UK: 3.50,  // £3.50 for EU and UK
  US: 10.00     // £10.00 for US
};

/**
 * Determines shipping cost in GBP based on country code
 */
export const getShippingCostGBP = (countryCode: string): number => {
  const normalizedCode = countryCode.toUpperCase();
  
  if (normalizedCode === 'US') {
    return SHIPPING_COSTS.US;
  }
  
  if (normalizedCode === 'GB' || EU_COUNTRIES.includes(normalizedCode)) {
    return SHIPPING_COSTS.EU_UK;
  }
  
  // Default to EU/UK rate for other countries
  return SHIPPING_COSTS.EU_UK;
};

/**
 * Converts GBP shipping cost to USD equivalent for Stripe
 * GBP to USD conversion: divide by 0.73
 */
export const convertGBPtoUSD = (gbpAmount: number): number => {
  return gbpAmount / 0.73;
};

/**
 * Get shipping cost in cents for Stripe based on currency
 */
export const getShippingCostInCents = (countryCode: string, currency: string): number => {
  const gbpCost = getShippingCostGBP(countryCode);
  const usdCost = convertGBPtoUSD(gbpCost);
  
  // Stripe requires amounts in cents/smallest currency unit
  return Math.round(usdCost * 100);
};

/**
 * Get shipping cost estimate ranges for display
 */
export const getShippingEstimate = () => {
  return {
    euUk: `£${SHIPPING_COSTS.EU_UK.toFixed(2)}`,
    us: `£${SHIPPING_COSTS.US.toFixed(2)}`,
    euUkGBP: SHIPPING_COSTS.EU_UK,
    usGBP: SHIPPING_COSTS.US
  };
};
