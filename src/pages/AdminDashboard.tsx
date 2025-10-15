import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit, Trash2, Package, Users, ShoppingCart, Tags, Home, DollarSign, TrendingUp, Clock, CheckCircle2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductVariantForm from '@/components/Admin/ProductVariantForm';
import { ProductVariant } from '@/types/store';

interface Product {
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
  category?: { name: string };
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

interface Order {
  id: string;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface ReferralUsage {
  id: string;
  referrer_id: string;
  referee_email: string;
  order_id?: string;
  discount_amount: number;
  commission_amount: number;
  commission_percentage: number;
  payout_status: string;
  payout_date?: string;
  payout_method?: string;
  payout_reference?: string;
  created_at: string;
  referrer?: {
    display_name?: string;
    payout_email?: string;
  };
  order?: {
    total_amount: number;
    status: string;
  };
}

interface ReferrerStats {
  referrer_id: string;
  display_name?: string;
  payout_email?: string;
  total_referrals: number;
  total_commission: number;
  pending_amount: number;
  paid_amount: number;
  last_referral_date: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [referralUsages, setReferralUsages] = useState<ReferralUsage[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('all');
  const [payoutDialog, setPayoutDialog] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<ReferrerStats | null>(null);
  const [payoutForm, setPayoutForm] = useState({
    payment_method: '',
    payment_reference: '',
    notes: '',
  });
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock_quantity: '',
    is_available: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    slug: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      return;
    }

    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, categoriesRes, ordersRes, referralsRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(name), variants:product_variants(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('referral_usage').select(`
          *,
          referrer:profiles!referrer_id(display_name, payout_email)
        `).order('created_at', { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (referralsRes.data) {
        // Fetch order details separately for each referral
        const referralsWithOrders = await Promise.all(
          referralsRes.data.map(async (ref: any) => {
            if (ref.order_id) {
              const { data: orderData } = await supabase
                .from('orders')
                .select('total_amount, status')
                .eq('id', ref.order_id)
                .single();
              return { ...ref, order: orderData };
            }
            return ref;
          })
        );
        setReferralUsages(referralsWithOrders as ReferralUsage[]);
        calculateReferrerStats(referralsWithOrders as ReferralUsage[]);
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateReferrerStats = (referrals: ReferralUsage[]) => {
    const statsMap = new Map<string, ReferrerStats>();
    
    referrals.forEach((ref) => {
      const existing = statsMap.get(ref.referrer_id) || {
        referrer_id: ref.referrer_id,
        display_name: ref.referrer?.display_name,
        payout_email: ref.referrer?.payout_email,
        total_referrals: 0,
        total_commission: 0,
        pending_amount: 0,
        paid_amount: 0,
        last_referral_date: ref.created_at,
      };

      existing.total_referrals += 1;
      existing.total_commission += Number(ref.commission_amount);
      if (ref.payout_status === 'pending') {
        existing.pending_amount += Number(ref.commission_amount);
      } else if (ref.payout_status === 'paid') {
        existing.paid_amount += Number(ref.commission_amount);
      }
      
      if (new Date(ref.created_at) > new Date(existing.last_referral_date)) {
        existing.last_referral_date = ref.created_at;
      }

      statsMap.set(ref.referrer_id, existing);
    });

    setReferrerStats(Array.from(statsMap.values()).sort((a, b) => b.pending_amount - a.pending_amount));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description || null,
        price: parseFloat(productForm.price),
        currency: 'USD',
        category_id: productForm.category_id || null,
        image_url: productForm.image_url || null,
        stock_quantity: parseInt(productForm.stock_quantity),
        is_available: productForm.is_available,
      };

      let result;
      if (editingProduct) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) throw result.error;

      toast({
        title: editingProduct ? "Product updated" : "Product created",
        description: `${productForm.name} has been ${editingProduct ? 'updated' : 'created'} successfully.`,
      });

      setShowProductDialog(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        stock_quantity: '',
        is_available: true,
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product.`,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductVariants(product.variants || []);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
      is_available: product.is_available,
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description || null,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      };

      let result;
      if (editingCategory) {
        result = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
      } else {
        result = await supabase
          .from('categories')
          .insert([categoryData]);
      }

      if (result.error) throw result.error;

      toast({
        title: editingCategory ? "Category updated" : "Category created",
        description: `${categoryForm.name} has been ${editingCategory ? 'updated' : 'created'} successfully.`,
      });

      setShowCategoryDialog(false);
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        slug: '',
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'create'} category.`,
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (referralIds: string[]) => {
    if (!selectedReferrer) return;
    
    try {
      const { error } = await supabase
        .from('referral_usage')
        .update({
          payout_status: 'paid',
          payout_date: new Date().toISOString(),
          payout_method: payoutForm.payment_method,
          payout_reference: payoutForm.payment_reference,
        })
        .in('id', referralIds);

      if (error) throw error;

      // Create payout record
      const { error: payoutError } = await supabase
        .from('referral_payouts')
        .insert({
          referrer_id: selectedReferrer.referrer_id,
          total_amount: selectedReferrer.pending_amount,
          referral_usage_ids: referralIds,
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: payoutForm.payment_method,
          payment_reference: payoutForm.payment_reference,
          notes: payoutForm.notes,
          currency: 'gbp',
        });

      if (payoutError) throw payoutError;

      toast({
        title: "Payout processed",
        description: `Successfully processed payout of £${selectedReferrer.pending_amount.toFixed(2)}`,
      });

      setPayoutDialog(false);
      setSelectedReferrer(null);
      setPayoutForm({ payment_method: '', payment_reference: '', notes: '' });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payout.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store products, categories, and orders</p>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referrals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                          {editingProduct ? 'Update the product details below.' : 'Fill in the product details below.'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleProductSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm">Product Name</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="price" className="text-sm">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                              required
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="description" className="text-sm">Description</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="category" className="text-sm">Category</Label>
                            <Select value={productForm.category_id} onValueChange={(value) => setProductForm(prev => ({ ...prev, category_id: value }))}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="stock" className="text-sm">Stock Quantity</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={productForm.stock_quantity}
                              onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                              required
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="image" className="text-sm">Image Filename</Label>
                          <Input
                            id="image"
                            value={productForm.image_url}
                            onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                            placeholder="product-name.jpg"
                            className="h-8"
                          />
                          <p className="text-xs text-muted-foreground">
                            First upload your image to Supabase Storage (product-images bucket), then enter just the filename here (e.g., product-name.jpg)
                          </p>
                          {productForm.image_url && (
                            <div className="mt-1">
                              <img 
                                src={`https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/${productForm.image_url}`}
                                alt="Product preview"
                                className="w-16 h-16 object-cover rounded border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {editingProduct && (
                          <ProductVariantForm
                            productId={editingProduct.id}
                            variants={productVariants}
                            onVariantsChange={setProductVariants}
                          />
                        )}
                        
                        <DialogFooter className="pt-3">
                          <Button type="submit" size="sm">
                            {editingProduct ? 'Update Product' : 'Create Product'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_available ? 'default' : 'secondary'}>
                            {product.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage your product categories</CardDescription>
                  </div>
                  <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? 'Update the category details below.' : 'Fill in the category details below.'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name">Category Name</Label>
                          <Input
                            id="category-name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category-slug">Slug</Label>
                          <Input
                            id="category-slug"
                            value={categoryForm.slug}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                            placeholder="auto-generated from name if empty"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category-description">Description</Label>
                          <Textarea
                            id="category-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Optional category description"
                          />
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit">
                            {editingCategory ? 'Update Category' : 'Create Category'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{category.slug}</Badge>
                        </TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{order.customer_name || 'Guest'}</TableCell>
                        <TableCell>{order.customer_email || '-'}</TableCell>
                        <TableCell>${order.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{referrerStats.length}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{referralUsages.length}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Commissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">
                        £{referrerStats.reduce((sum, r) => sum + r.pending_amount, 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">
                        £{referrerStats.reduce((sum, r) => sum + r.paid_amount, 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* View Toggle & Export */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('all')}
                  >
                    All Referrals
                  </Button>
                  <Button
                    variant={viewMode === 'grouped' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grouped')}
                  >
                    By Referrer
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewMode === 'all') {
                      exportToCSV(
                        referralUsages.map(r => ({
                          referrer_name: r.referrer?.display_name || 'N/A',
                          referrer_email: r.referrer?.payout_email || 'N/A',
                          referee_email: r.referee_email,
                          order_total: r.order?.total_amount || 0,
                          discount_amount: r.discount_amount,
                          commission_amount: r.commission_amount,
                          payout_status: r.payout_status,
                          created_at: new Date(r.created_at).toLocaleDateString(),
                        })),
                        'referral-usage.csv'
                      );
                    } else {
                      exportToCSV(
                        referrerStats.map(r => ({
                          referrer_name: r.display_name || 'N/A',
                          payout_email: r.payout_email || 'N/A',
                          total_referrals: r.total_referrals,
                          total_commission: r.total_commission,
                          pending_amount: r.pending_amount,
                          paid_amount: r.paid_amount,
                          last_referral: new Date(r.last_referral_date).toLocaleDateString(),
                        })),
                        'referrer-stats.csv'
                      );
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* All Referrals View */}
              {viewMode === 'all' && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Referral Activity</CardTitle>
                    <CardDescription>Complete history of referral uses and commissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Referrer</TableHead>
                          <TableHead>Referee Email</TableHead>
                          <TableHead>Order Total</TableHead>
                          <TableHead>Discount</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralUsages.map((usage) => (
                          <TableRow key={usage.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{usage.referrer?.display_name || 'Unknown'}</span>
                                <span className="text-xs text-muted-foreground">{usage.referrer?.payout_email}</span>
                              </div>
                            </TableCell>
                            <TableCell>{usage.referee_email}</TableCell>
                            <TableCell>£{usage.order?.total_amount?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell>£{Number(usage.discount_amount).toFixed(2)}</TableCell>
                            <TableCell className="font-medium">£{Number(usage.commission_amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(usage.payout_status)}>
                                {usage.payout_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(usage.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Grouped by Referrer View */}
              {viewMode === 'grouped' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Referrer Statistics</CardTitle>
                    <CardDescription>Aggregated stats and payout management per referrer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Referrer</TableHead>
                          <TableHead>Total Referrals</TableHead>
                          <TableHead>Total Commission</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>Paid</TableHead>
                          <TableHead>Last Referral</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrerStats.map((stats) => (
                          <TableRow key={stats.referrer_id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{stats.display_name || 'Unknown'}</span>
                                <span className="text-xs text-muted-foreground">{stats.payout_email}</span>
                              </div>
                            </TableCell>
                            <TableCell>{stats.total_referrals}</TableCell>
                            <TableCell>£{stats.total_commission.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">£{stats.pending_amount.toFixed(2)}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">£{stats.paid_amount.toFixed(2)}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(stats.last_referral_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {stats.pending_amount >= 20 && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReferrer(stats);
                                    setPayoutDialog(true);
                                  }}
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Process Payout
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Payout Dialog */}
              <Dialog open={payoutDialog} onOpenChange={setPayoutDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Payout</DialogTitle>
                    <DialogDescription>
                      Mark pending commissions as paid for {selectedReferrer?.display_name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedReferrer && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Referrer:</span>
                          <span className="font-medium">{selectedReferrer.display_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="font-medium">{selectedReferrer.payout_email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Pending Amount:</span>
                          <span className="font-bold text-lg">£{selectedReferrer.pending_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select
                          value={payoutForm.payment_method}
                          onValueChange={(value) => setPayoutForm(prev => ({ ...prev, payment_method: value }))}
                        >
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment-reference">Payment Reference / Transaction ID</Label>
                        <Input
                          id="payment-reference"
                          value={payoutForm.payment_reference}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, payment_reference: e.target.value }))}
                          placeholder="TX123456789"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={payoutForm.notes}
                          onChange={(e) => setPayoutForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes about this payout..."
                        />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPayoutDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            const pendingReferralIds = referralUsages
                              .filter(r => r.referrer_id === selectedReferrer.referrer_id && r.payout_status === 'pending')
                              .map(r => r.id);
                            handleMarkAsPaid(pendingReferralIds);
                          }}
                          disabled={!payoutForm.payment_method || !payoutForm.payment_reference}
                        >
                          Mark as Paid
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;