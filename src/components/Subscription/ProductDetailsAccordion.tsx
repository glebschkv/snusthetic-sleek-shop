import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Product {
  name: string;
  description: string;
  flavor: string;
  strength_mg: number;
}

interface ProductDetailsAccordionProps {
  product: Product;
}

const ProductDetailsAccordion = ({ product }: ProductDetailsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="product-info">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Flavor:</strong> {product.flavor}</p>
            <p><strong>Strength:</strong> {product.strength_mg}mg</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ingredients">
        <AccordionTrigger>Ingredients & Contents</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>Each can contains premium nicotine pouches made with:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Plant-based fibers</li>
              <li>Food-grade flavorings</li>
              <li>Pharmaceutical-grade nicotine</li>
              <li>Stabilizers and pH adjusters</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Tobacco-free product. Contains nicotine which is an addictive substance.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="usage">
        <AccordionTrigger>Usage Instructions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Place one pouch between your upper lip and gum</li>
              <li>Leave in place for up to 60 minutes</li>
              <li>Dispose of used pouch responsibly</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              For adult use only (18+). Do not use if pregnant or nursing.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <p><strong>Subscription Benefits:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Free shipping on all subscription orders</li>
              <li>Delivered every month on your chosen date</li>
              <li>Skip or pause deliveries anytime</li>
              <li>Cancel with no penalties or fees</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Standard delivery takes 3-5 business days. Tracking information provided.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductDetailsAccordion;
