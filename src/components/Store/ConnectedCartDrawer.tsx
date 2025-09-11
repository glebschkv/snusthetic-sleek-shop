import CartDrawer from '@/components/Store/CartDrawer';
import { useCartContext } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const ConnectedCartDrawer = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotal 
  } = useCartContext();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleClose = () => {
    closeCart();
  };

  return (
    <CartDrawer
      isOpen={isOpen}
      onClose={handleClose}
      items={items}
      total={getTotal()}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={handleCheckout}
    />
  );
};

export default ConnectedCartDrawer;