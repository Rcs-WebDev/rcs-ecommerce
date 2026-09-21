import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

export default function CartDrawer({ onPaymentComplete }) {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, checkout, loading } = useContext(CartContext);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  if (!isCartOpen) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleCheckout = async () => {
    setIsProcessingCheckout(true);
    await checkout(onPaymentComplete);
    setIsProcessingCheckout(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer Panel */}
      <div className="glass-panel animate-slide-in" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '450px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Shopping Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {!cart.items || cart.items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              gap: '12px',
              color: '#9ca3af'
            }}>
              <span style={{ fontSize: '1rem' }}>Your cart is empty</span>
            </div>
          ) : (
            cart.items.map((item) => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                {/* Thumb */}
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#121218'
                  }}
                />
                
                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {item.product_name}
                    </h4>
                    <span style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 500 }}>
                      {formatRupiah(item.product_price)}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '6px 8px', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '6px 8px', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.product_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.items && cart.items.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(10, 10, 14, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Subtotal</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                {formatRupiah(cart.total_price)}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout || loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                borderRadius: '10px'
              }}
            >
              <CreditCard size={18} />
              <span>{isProcessingCheckout ? 'Generating Payment...' : 'Checkout (Midtrans)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
