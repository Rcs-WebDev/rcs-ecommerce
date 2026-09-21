import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Search, MessageSquare, ChevronRight, Coins, Percent, Play, CreditCard } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import '../styles/MyOrders.css';

const DEFAULT_MOCK_ORDERS = [
  {
    id: 'ORD-882910',
    shopName: 'Bloods Official Shop',
    isMall: true,
    isLive: true,
    status: 'Selesai',
    statusCategory: 'Selesai',
    productName: 'Bloods Series Jacket Outdoor Vaporene 0...',
    variant: 'M',
    quantity: 1,
    originalPrice: 525000,
    finalPrice: 262500,
    totalPrice: 205695,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    coinAlert: 'Nilai pesanan sebelum 30 Nov untuk dapatkan',
    coinAmount: '145 Koin'
  },
  {
    id: 'ORD-771234',
    shopName: 'Centro Medical Neo',
    isMall: false,
    isLive: false,
    status: 'Selesai',
    statusCategory: 'Selesai',
    productName: '[PROMO] SWISS PARIS Penghilang Kutil dan Tahi Lalat BPOM Original',
    variant: 'x1',
    quantity: 1,
    originalPrice: 60000,
    finalPrice: 19900,
    totalPrice: 19906,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300',
    coinAlert: 'Nilai pesanan sebelum 21 Nov untuk dapatkan',
    coinAmount: '140 Koin'
  },
  {
    id: 'ORD-993811',
    shopName: 'SEENDA Official Store',
    isMall: true,
    isLive: false,
    status: 'Dikirim',
    statusCategory: 'Dikirim',
    productName: 'SEENDA MOE300 Mouse Ergonomic Vertical Wireless Dual Mode',
    variant: 'Black',
    quantity: 1,
    originalPrice: 350000,
    finalPrice: 277920,
    totalPrice: 277920,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300',
    coinAlert: 'Pesanan sedang dalam perjalanan oleh kurir RCS Express',
    coinAmount: ''
  },
  {
    id: 'ORD-109283',
    shopName: 'TechGadget Indonesia',
    isMall: false,
    isLive: false,
    status: 'Dikemas',
    statusCategory: 'Dikemas',
    productName: 'Wireless Bluetooth Earbuds Noise Cancelling TWS High Bass',
    variant: 'White Edition',
    quantity: 1,
    originalPrice: 299000,
    finalPrice: 149000,
    totalPrice: 149000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
    coinAlert: 'Penjual sedang menyiapkan pesanan Anda',
    coinAmount: ''
  }
];

export default function MyOrders({ setCurrentPage, initialTab = 'Semua' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ratingModalOrder, setRatingModalOrder] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const { cart, addToCart, removeItem } = useContext(CartContext);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rcs_saved_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to load saved orders:', e);
      }
    }
    return DEFAULT_MOCK_ORDERS;
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    localStorage.setItem('rcs_saved_orders', JSON.stringify(orders));
  }, [orders]);

  const tabs = [
    { key: 'Semua', label: 'Semua' },
    { key: 'Belum Bayar', label: 'Belum Bayar' },
    { key: 'Dikemas', label: 'Dikemas' },
    { key: 'Dikirim', label: 'Dikirim' },
    { key: 'Selesai', label: 'Selesai' },
    { key: 'Pengembalian', label: 'Pengembalian' },
    { key: 'Dibatalkan', label: 'Dibatalkan' }
  ];

  // Convert active Cart items into dynamic "Belum Bayar" order cards
  const cartAsOrders = (cart && cart.items && cart.items.length > 0)
    ? cart.items.map(item => ({
        id: `CART-${item.product_id || item.id}`,
        isCartItem: true,
        productId: item.product_id || item.id,
        shopName: 'RCSMART Official Store',
        isMall: true,
        isLive: false,
        status: 'Belum Bayar',
        statusCategory: 'Belum Bayar',
        productName: item.product_name || item.name || 'Produk Pilihan Keranjang',
        variant: 'Standard',
        quantity: item.quantity || 1,
        originalPrice: (item.product_price || item.price || 150000) * 1.2,
        finalPrice: item.product_price || item.price || 150000,
        totalPrice: (item.product_price || item.price || 150000) * (item.quantity || 1),
        image: item.product_image || item.image || 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300',
        coinAlert: 'Selesaikan pembayaran sebelum batas waktu berakhir',
        coinAmount: ''
      }))
    : [];

  // Filter out any duplicate saved orders that match cart items, then merge
  const savedOrdersFiltered = orders.filter(o => !o.isCartItem);
  const combinedOrders = [...cartAsOrders, ...savedOrdersFiltered];

  const filteredOrders = activeTab === 'Semua'
    ? combinedOrders
    : combinedOrders.filter(o => o.statusCategory === activeTab);

  const handlePayOrder = (order) => {
    const paidOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      shopName: order.shopName || 'RCSMART Official Store',
      isMall: true,
      isLive: false,
      status: 'Dikemas',
      statusCategory: 'Dikemas',
      productName: order.productName,
      variant: order.variant || 'Default',
      quantity: order.quantity || 1,
      originalPrice: order.originalPrice || order.finalPrice * 1.2,
      finalPrice: order.finalPrice,
      totalPrice: order.totalPrice,
      image: order.image,
      coinAlert: 'Penjual sedang menyiapkan pesanan Anda',
      coinAmount: ''
    };

    const newOrdersList = [paidOrder, ...savedOrdersFiltered];
    setOrders(newOrdersList);

    if (order.isCartItem && removeItem && order.productId) {
      removeItem(order.productId);
    }

    setActiveTab('Dikemas');
    alert(`Pembayaran Berhasil! Pesanan "${order.productName}" telah diteruskan ke tab "Dikemas".`);
  };

  const handleBuyAgain = (order) => {
    addToCart(order.productId || order.id, order.quantity || 1);
    alert(`Produk "${order.productName}" telah ditambahkan ke Keranjang!`);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    alert(`Terima kasih! Penilaian ${ratingStars} Bintang untuk ${ratingModalOrder?.shopName} berhasil dikirim.`);
    setRatingModalOrder(null);
    setRatingComment('');
  };

  return (
    <div className="myorders-container animate-fade-in">
      {/* Header Bar */}
      <div className="myorders-header">
        <div className="myorders-top-bar">
          <div className="myorders-top-left">
            <button className="myorders-back-btn" onClick={() => setCurrentPage('profile')}>
              <ArrowLeft size={22} />
            </button>
            <span className="myorders-title">Pesanan Saya</span>
          </div>
          <div className="myorders-top-actions">
            <button className="myorders-icon-btn" onClick={() => alert('Fitur Cari Pesanan')}>
              <Search size={20} />
            </button>
            <button className="myorders-icon-btn" onClick={() => alert('Layanan Chat Pembeli')}>
              <MessageSquare size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Status Tabs */}
        <div className="myorders-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`myorders-tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === 'Belum Bayar' && cartAsOrders.length > 0 && (
                <span style={{
                  marginLeft: '4px',
                  background: '#ee4d2d',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.7rem'
                }}>
                  {cartAsOrders.length}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="myorders-list">
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Tidak ada pesanan di kategori "{activeTab}"</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '16px', fontSize: '0.85rem' }}
              onClick={() => setCurrentPage('home')}
            >
              Mulai Belanja Now
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Shop Header */}
              <div className="order-card-header">
                <div className="order-shop-info">
                  {order.isMall && <span className="badge-mall">Mall | ORI</span>}
                  <span className="order-shop-name">{order.shopName}</span>
                  {order.isLive && <span className="badge-live"><Play size={10} inline /> LIVE</span>}
                </div>
                <span className="order-status-tag" style={{
                  color: order.status === 'Belum Bayar' ? '#f59e0b' : order.status === 'Dikemas' ? '#3b82f6' : '#10b981'
                }}>
                  {order.status}
                </span>
              </div>

              {/* Order Item */}
              <div className="order-item-row">
                <img src={order.image} alt={order.productName} className="order-item-img" />
                <div className="order-item-details">
                  <span className="order-item-title">{order.productName}</span>
                  <span className="order-item-variant">{order.variant}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>x{order.quantity}</span>
                    <div className="order-item-pricing">
                      {order.originalPrice > order.finalPrice && (
                        <span className="original-price">Rp{order.originalPrice.toLocaleString('id-ID')}</span>
                      )}
                      <span className="final-price">Rp{order.finalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div className="order-total-row">
                <span>Total {order.quantity} produk:</span>
                <span className="order-total-amount">Rp{order.totalPrice.toLocaleString('id-ID')}</span>
              </div>

              {/* Coin Alert Box if exists */}
              {order.coinAlert && (
                <div className="coin-alert-box" onClick={() => order.status === 'Selesai' && setRatingModalOrder(order)}>
                  <div className="coin-alert-left">
                    <Coins size={16} color="#f59e0b" />
                    <span>{order.coinAlert} <strong className="coin-highlight">{order.coinAmount}</strong></span>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="order-actions-row">
                {order.status === 'Belum Bayar' ? (
                  <>
                    <button className="btn-order-outline" onClick={() => setCurrentPage('cart')}>
                      Lihat Keranjang
                    </button>
                    <button className="btn-order-primary" onClick={() => handlePayOrder(order)}>
                      <CreditCard size={14} style={{ marginRight: '4px' }} />
                      Bayar Sekarang
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-order-outline" onClick={() => handleBuyAgain(order)}>
                      Beli Lagi
                    </button>
                    {order.status === 'Selesai' && (
                      <button className="btn-order-primary" onClick={() => setRatingModalOrder(order)}>
                        Nilai
                      </button>
                    )}
                    {order.status === 'Dikirim' && (
                      <button className="btn-order-primary" onClick={() => alert(`Lacak No Resi: RCS-${order.id}`)}>
                        Lacak Paket
                      </button>
                    )}
                    {order.status === 'Dikemas' && (
                      <button className="btn-order-outline" onClick={() => alert(`Pesanan #${order.id} sedang dikemas dan siap dikirim.`)}>
                        Rincian Pengemasan
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* "Beli lagi produk ini?" Recommendation Box */}
      <div className="buy-again-section">
        <div className="buy-again-header">
          <div className="buy-again-title">
            <Percent size={18} color="#ee4d2d" />
            <span>Beli lagi produk ini?</span>
          </div>
          <span className="see-all-link" onClick={() => setCurrentPage('home')}>Lihat semua &gt;</span>
        </div>

        <div className="buy-again-card">
          <img
            src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300"
            alt="SEENDA Ergonomic Mouse"
            className="buy-again-img"
          />
          <div className="buy-again-info">
            <div className="buy-again-name">SEENDA MOE300 Mouse Ergonomic Vertical</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Black Edition</div>
            <div className="buy-again-price">Rp277.920</div>
          </div>
          <button
            className="btn-buy-now"
            onClick={() => {
              addToCart(4, 1);
              alert('SEENDA Mouse ditambahkan ke Keranjang!');
            }}
          >
            Beli Lagi
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {ratingModalOrder && (
        <div className="glass-panel" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '450px',
            width: '100%',
            color: 'var(--text-main)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
              Nilai Pesanan #{ratingModalOrder.id}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {ratingModalOrder.productName}
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= ratingStars ? '#f59e0b' : 'var(--input-border)'
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="form-input"
              rows={3}
              placeholder="Tulis ulasan produk dan dapatkan hingga 150 Koin RCS..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              style={{ marginBottom: '20px' }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setRatingModalOrder(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRatingSubmit}
              >
                Kirim Penilaian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
