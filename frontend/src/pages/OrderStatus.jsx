import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function OrderStatus({ orderId, status, setCurrentPage, setMyOrdersInitialTab }) {
  const { API_URL, token } = useContext(AuthContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setOrderDetails(data);
        }
      } catch (error) {
        console.error('Error fetching order status details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, token]);

  const renderStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={64} color="#10b981" />;
      case 'pending':
        return <AlertTriangle size={64} color="#f59e0b" />;
      case 'error':
        return <XCircle size={64} color="#ef4444" />;
      default:
        return <AlertTriangle size={64} color="#9ca3af" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!';
      case 'pending':
        return 'Payment Pending';
      case 'error':
        return 'Payment Failed';
      case 'closed':
        return 'Payment Process Interrupted';
      default:
        return 'Order Processing';
    }
  };

  const getStatusDesc = () => {
    switch (status) {
      case 'success':
        return 'Thank you for your purchase. Your payment has been confirmed and we are preparing your hardware gear.';
      case 'pending':
        return 'Your payment is being processed. Please complete your transaction in the selected payment channel.';
      case 'error':
        return 'An error occurred during the payment transaction. Please try checking out again.';
      case 'closed':
        return 'You closed the payment screen before completing the payment. You can retry anytime.';
      default:
        return 'Checking transaction details...';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        color: '#a78bfa',
        gap: '12px'
      }}>
        <Loader2 className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
        <span>Loading order details...</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Status Icon */}
        <div>
          {renderStatusIcon()}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {getStatusTitle()}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '400px' }}>
            {getStatusDesc()}
          </p>
        </div>

        {/* Order Details Card */}
        {orderDetails && (
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#9ca3af' }}>Order ID</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{orderDetails.order_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#9ca3af' }}>Total Payment</span>
              <span style={{ color: '#a78bfa', fontWeight: 700 }}>{formatRupiah(orderDetails.total_amount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#9ca3af' }}>Payment Status</span>
              <span style={{ 
                color: orderDetails.status === 'paid' ? '#34d399' : '#f59e0b',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {orderDetails.status}
              </span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '8px', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>ITEMS PURCHASED</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {orderDetails.items && orderDetails.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#d1d5db' }}>{item.product_name} <span style={{ color: '#6b7280' }}>x{item.quantity}</span></span>
                    <span style={{ color: '#fff' }}>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          <button 
            onClick={() => {
              if (setMyOrdersInitialTab) setMyOrdersInitialTab('Dikemas');
              setCurrentPage('my-orders');
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', background: 'var(--primary)' }}
          >
            <span>Lihat Pesanan Saya (Tab Dikemas)</span>
          </button>
          <button 
            onClick={() => setCurrentPage('home')}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px' }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
