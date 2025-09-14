import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminPromoter = () => {
  const [loading, setLoading] = useState(false);

  const promoteUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('promote-admin', {
        body: { email: 'suchkov.gleb@icloud.com' }
      });
      
      if (error) {
        toast.error('Failed to promote user: ' + error.message);
      } else {
        toast.success('User promoted to admin successfully!');
        console.log('Success:', data);
      }
    } catch (error) {
      toast.error('Failed to promote user');
      console.error('Failed to promote user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={promoteUser} disabled={loading}>
        {loading ? 'Promoting...' : 'Promote suchkov.gleb@icloud.com to Admin'}
      </Button>
    </div>
  );
};

export default AdminPromoter;