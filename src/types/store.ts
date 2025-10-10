export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  image_url?: string;
  stock_quantity: number;
  price_adjustment: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category_id?: string;
  image_url?: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
  is_subscription?: boolean;
  subscription_data?: {
    quantity_type: '5' | '10' | '20' | 'custom';
    billing_interval: 'month';
    brand_name?: string;
    flavor?: string;
    strength_mg?: number;
  };
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: string;
  customer_email?: string;
  customer_name?: string;
  shipping_address?: any;
  created_at: string;
}

export interface CheckoutData {
  customer_name: string;
  customer_email: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: CartItem[];
  total: number;
}