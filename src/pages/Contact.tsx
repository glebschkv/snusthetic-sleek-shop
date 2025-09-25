import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const customOrderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  quantity: z.string().trim().min(1, "Quantity is required").max(100, "Quantity must be less than 100 characters"),
  requirements: z.string().trim().min(10, "Please provide at least 10 characters describing your requirements").max(1000, "Requirements must be less than 1000 characters")
})

type CustomOrderForm = z.infer<typeof customOrderSchema>

const Contact = () => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema)
  })

  const onSubmit = async (data: CustomOrderForm) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.functions.invoke('send-custom-order', {
        body: data
      })

      if (error) throw error

      toast({
        title: "Custom order request sent!",
        description: "We'll get back to you within 24-48 hours.",
      })
      
      reset()
    } catch (error) {
      console.error('Error submitting custom order:', error)
      toast({
        title: "Error sending request",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-hero mb-8">Contact Us</h1>
          <p className="text-body-large text-muted-foreground">
            Custom orders, bulk purchases, or general questions - we're here to help you find the perfect solution.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-section mb-6">How Can We Help?</h2>
                <div className="space-y-4 mb-8">
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Custom Orders</h3>
                    <p className="text-muted-foreground text-sm">Looking for a unique design or personalization? We create bespoke pieces tailored to your specifications.</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Bulk Orders</h3>
                    <p className="text-muted-foreground text-sm">Need larger quantities for your business or event? Contact us for special pricing and customization options.</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">General Questions</h3>
                    <p className="text-muted-foreground text-sm">Have questions about our products, shipping, or anything else? We're here to help.</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Reach out to us through any of the following channels. 
                  We typically respond within 24 hours.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">snusthetic@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">+44 7821 710722</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Order Request Form */}
            <Card className="bg-surface/50 border-border/50">
              <CardHeader>
                <CardTitle>Custom Order Request</CardTitle>
                <CardDescription>
                  Tell us about your specific needs and we'll get back to you with options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity Needed</Label>
                    <Input 
                      id="quantity" 
                      placeholder="e.g., 50 units, 10 sets" 
                      {...register("quantity")}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="requirements">Custom Requirements</Label>
                    <Textarea 
                      id="requirements" 
                      placeholder="Please describe your custom requirements, preferred materials, colors, engraving details, etc."
                      className="min-h-[100px]"
                      {...register("requirements")}
                    />
                    {errors.requirements && (
                      <p className="text-sm text-destructive mt-1">{errors.requirements.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Submit Custom Order Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;