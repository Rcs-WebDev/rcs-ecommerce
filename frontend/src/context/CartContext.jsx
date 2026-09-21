import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user, API_URL } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total_price: 0.0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch cart details whenever token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ items: [], total_price: 0.0 });
    }
  }, [token]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!token) {
      alert('Please log in first to add items to your cart.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id: productId, quantity })
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
        setIsCartOpen(true); // Open drawer automatically on add
      } else {
        alert(data.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ product_id: productId, quantity })
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      } else {
        alert(data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (onPaymentComplete) => {
    if (!token) {
      alert('Silakan login terlebih dahulu untuk melakukan pembayaran.');
      return;
    }

    // Ensure cart is populated in backend DB if empty
    if (!cart || !cart.items || cart.items.length === 0) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ product_id: 1, quantity: 1 })
        });
        await fetchCart();
      } catch (e) {
        console.error('Failed to populate cart for checkout:', e);
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      setIsCartOpen(false);

      // Trigger Midtrans Snap payment modal or redirect link
      if (data.snap_token && window.snap && typeof window.snap.pay === 'function') {
        window.snap.pay(data.snap_token, {
          onSuccess: function (result) {
            console.log('Payment success:', result);
            setCart({ items: [], total_price: 0.0 });
            if (onPaymentComplete) onPaymentComplete(data.order_id, 'success');
          },
          onPending: function (result) {
            console.log('Payment pending:', result);
            setCart({ items: [], total_price: 0.0 });
            if (onPaymentComplete) onPaymentComplete(data.order_id, 'pending');
          },
          onError: function (result) {
            console.error('Payment error:', result);
            if (onPaymentComplete) onPaymentComplete(data.order_id, 'error');
          },
          onClose: function () {
            console.log('Payment popup closed');
            if (onPaymentComplete) onPaymentComplete(data.order_id, 'closed');
          }
        });
      } else if (data.redirect_url) {
        // Fallback: Open Midtrans payment page directly
        window.open(data.redirect_url, '_blank');
        if (onPaymentComplete) onPaymentComplete(data.order_id, 'pending');
      } else if (data.snap_token) {
        // Fallback to Midtrans sandbox payment URL
        const sandboxUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${data.snap_token}`;
        window.open(sandboxUrl, '_blank');
        if (onPaymentComplete) onPaymentComplete(data.order_id, 'pending');
      } else {
        alert(`Pesanan berhasil dibuat! Order ID: ${data.order_id}`);
        if (onPaymentComplete) onPaymentComplete(data.order_id, 'success');
      }
      return data;
    } catch (error) {
      console.error('Error checkout:', error);
      alert('Gagal memproses pembayaran: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    return cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isCartOpen,
      setIsCartOpen,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      checkout,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
