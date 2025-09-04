import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SHOPIFY-API] ${step}${detailsStr}`);
};

const SHOPIFY_DOMAIN = Deno.env.get('SHOPIFY_DOMAIN');
const STOREFRONT_ACCESS_TOKEN = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

// Validate environment variables
if (!SHOPIFY_DOMAIN) {
  console.error('[SHOPIFY-API] SHOPIFY_DOMAIN environment variable is not set');
}
if (!STOREFRONT_ACCESS_TOKEN) {
  console.error('[SHOPIFY-API] SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is not set');
}

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
logStep('Environment setup', { 
  domain: SHOPIFY_DOMAIN, 
  hasToken: !!STOREFRONT_ACCESS_TOKEN,
  apiUrl: STOREFRONT_API_URL 
});

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

const fetchShopifyGraphQL = async (query: string, variables: any = {}) => {
  console.log('Making request to Shopify:', STOREFRONT_API_URL);
  console.log('Query variables:', variables);
  
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    console.log('Shopify response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const result = await response.json();
    console.log('Shopify response data:', result);
    
    if (result.errors) {
      console.error('Shopify GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
};

serve(async (req) => {
  logStep('Function invoked', { method: req.method, url: req.url });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logStep('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Validate environment variables before processing
  if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    const errorMsg = 'Missing required environment variables';
    logStep('ERROR: Environment validation failed', { 
      hasDomain: !!SHOPIFY_DOMAIN, 
      hasToken: !!STOREFRONT_ACCESS_TOKEN 
    });
    return new Response(JSON.stringify({ 
      error: errorMsg,
      details: 'SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    logStep('Attempting to parse request body');
    let requestBody;
    
    try {
      const bodyText = await req.text();
      logStep('Request body text received', { bodyLength: bodyText.length, bodyPreview: bodyText.substring(0, 100) });
      
      if (!bodyText) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(bodyText);
      logStep('Request body parsed successfully', requestBody);
    } catch (parseError) {
      logStep('ERROR: Failed to parse request body', { error: parseError.message });
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, query, variantId, quantity } = requestBody;
    logStep('Extracted request parameters', { action, query, variantId, quantity });

    if (!action) {
      logStep('ERROR: No action specified');
      return new Response(JSON.stringify({ 
        error: 'Missing required parameter: action',
        validActions: ['getProducts', 'createCart']
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getProducts') {
      logStep('Processing getProducts action', { query });
      
      try {
        const response = await fetchShopifyGraphQL(PRODUCTS_QUERY, {
          first: 20,
          query: query || '',
        });

        const products = response.data?.products.edges.map((edge: any) => edge.node) || [];
        logStep('Products fetched successfully', { productCount: products.length });
        
        return new Response(JSON.stringify({ products }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (shopifyError) {
        logStep('ERROR: Shopify API call failed', { error: shopifyError.message });
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch products from Shopify',
          details: shopifyError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'createCart') {
      logStep('Processing createCart action', { variantId, quantity });
      
      if (!variantId) {
        logStep('ERROR: Missing variantId for createCart');
        return new Response(JSON.stringify({ 
          error: 'Missing required parameter: variantId' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      try {
        const response = await fetchShopifyGraphQL(CREATE_CART_MUTATION, {
          input: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: quantity || 1,
              },
            ],
          },
        });

        const checkoutUrl = response.data?.cartCreate?.cart?.checkoutUrl || null;
        logStep('Cart created successfully', { checkoutUrl: !!checkoutUrl });
        
        return new Response(JSON.stringify({ checkoutUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (shopifyError) {
        logStep('ERROR: Shopify cart creation failed', { error: shopifyError.message });
        return new Response(JSON.stringify({ 
          error: 'Failed to create cart in Shopify',
          details: shopifyError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    logStep('ERROR: Invalid action received', { action });
    return new Response(JSON.stringify({ 
      error: 'Invalid action',
      receivedAction: action,
      validActions: ['getProducts', 'createCart']
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('ERROR: Unexpected error in function', { 
      error: error.message, 
      stack: error.stack 
    });
    return new Response(JSON.stringify({ 
      error: 'Unexpected server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});