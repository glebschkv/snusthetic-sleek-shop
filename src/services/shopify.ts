import { ShopifyProduct, ShopifyProductsResponse } from '@/types/shopify';

// Shopify Storefront API Service

// Replace these with your actual Shopify credentials
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-shop.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token';

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const fetchGraphQL = async (query: string, variables: any = {}) => {
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const shopifyService = {
  async getProducts(query?: string): Promise<ShopifyProduct[]> {
    try {
      const response = await fetchGraphQL(PRODUCTS_QUERY, {
        first: 20,
        query: query || '',
      });

      return response.data?.products.edges.map((edge: any) => edge.node) || [];
    } catch (error) {
      console.error('Error fetching products from Shopify:', error);
      return [];
    }
  },

  async createCart(variantId: string, quantity: number = 1): Promise<string | null> {
    try {
      const response = await fetchGraphQL(CREATE_CART_MUTATION, {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        },
      });

      return response.data?.cartCreate?.cart?.checkoutUrl || null;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  },

  getProductCategories(products: ShopifyProduct[]): string[] {
    const categories = new Set(['All']);
    products.forEach(product => {
      if (product.productType) {
        categories.add(product.productType);
      }
    });
    return Array.from(categories);
  },
};