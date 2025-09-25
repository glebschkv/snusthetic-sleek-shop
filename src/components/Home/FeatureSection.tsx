import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Package, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const customOrderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  quantity: z.string().trim().min(1, "Quantity is required").max(100, "Quantity must be less than 100 characters"),
  requirements: z.string().trim().min(10, "Please provide at least 10 characters describing your requirements").max(1000, "Requirements must be less than 1000 characters")
})

type CustomOrderForm = z.infer<typeof customOrderSchema>

export const FeatureSection = () => {
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
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">Custom & Bulk Orders</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Need something special? Looking to order in bulk? We're here to help create the perfect 
            snus storage solution for your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bulk Order Information */}
          <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-sage rounded-full">
                    <Users className="h-6 w-6 text-sage-foreground" />
                  </div>
                  <div>
                    <CardTitle>Bulk Orders</CardTitle>
                    <CardDescription>Corporate gifts, events, or large quantities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Perfect for corporate gifts, special events, or when you need multiple units. 
                  We offer competitive pricing for bulk orders and can customize packaging.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4" />
                  <span>Minimum 10 units for bulk pricing</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-sage rounded-full">
                    <Mail className="h-6 w-6 text-sage-foreground" />
                  </div>
                  <div>
                    <CardTitle>Contact for Special Orders</CardTitle>
                    <CardDescription>Custom finishes, engravings, or unique requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For bulk orders or custom requests, reach out to us directly:
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> snusthetic@gmail.com</div>
                  <div><strong>Response Time:</strong> Within 24 hours</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Order Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Custom Order Request</CardTitle>
              <CardDescription>
                Tell us about your specific needs and we'll get back to you with options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
  )
}

export default FeatureSection