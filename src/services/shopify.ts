import { ShopifyProduct, ShopifyProductsResponse } from '@/types/shopify';

// Shopify Storefront API Service

// Shopify credentials (Storefront API tokens are safe for client-side use)
const SHOPIFY_DOMAIN = 'snusthetic.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '2728d7113f7a5cbd1a80057886d2dd18';

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
  console.log('Making request to:', STOREFRONT_API_URL);
  console.log('Access token:', STOREFRONT_ACCESS_TOKEN);
  console.log('Query variables:', variables);
  
  try {
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

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const result = await response.json();
    console.log('Response data:', result);
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result;
  } catch (error) {
    console.error('Fetch error details:', error);
    throw error;
  }
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