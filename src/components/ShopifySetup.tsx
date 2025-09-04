import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';

const ShopifySetup = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Shopify Configuration Required</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>
            To display your Shopify products, you need to configure your Shopify Storefront API credentials.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Environment Variables:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code>VITE_SHOPIFY_DOMAIN</code> - Your shop domain (e.g., your-shop.myshopify.com)</li>
              <li><code>VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> - Your Storefront API access token</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a 
                href="https://shopify.dev/docs/api/storefront" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Shopify Storefront API Docs
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a 
                href="https://help.shopify.com/en/manual/apps/private-apps#generate-credentials-from-the-admin-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Get API Credentials
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-medium mb-1">Quick Setup Steps:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Go to your Shopify Admin → Apps → App and sales channel settings</li>
              <li>Click "Develop apps" → Create an app</li>
              <li>Configure Storefront API access and generate access token</li>
              <li>Add the credentials to your environment variables</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ShopifySetup;