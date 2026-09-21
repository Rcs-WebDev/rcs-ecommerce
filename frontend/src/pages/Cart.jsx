import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
  ArrowLeft,
  MessageCircle,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Ticket,
  Coins,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import '../styles/Cart.css';

export default function Cart({ setCurrentPage, onPaymentComplete, onSelectProduct, onOpenChat }) {
  const { cart, updateQuantity, removeItem, checkout, loading } = useContext(CartContext);
  const { token, API_URL } = useContext(AuthContext);

  const [selectedItems, setSelectedItems] = useState({});
  const [useCoins, setUseCoins] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recomProducts, setRecomProducts] = useState([]);

  // Fetch recommendation products from backend
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecomProducts(data.slice(0, 4));
        }
      })
      .catch(err => console.log('Recom fetch error:', err));
  }, [API_URL]);

  // Default select all items on cart load
  useEffect(() => {
    if (cart.items && cart.items.length > 0) {
      const initial = {};
      cart.items.forEach(item => {
        initial[item.id] = true;
      });
      setSelectedItems(initial);
    }
  }, [cart.items]);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  const handleToggleSelect = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleToggleSelectAll = () => {
    const allSelected = isAllSelected();
    const updated = {};
    if (cart.items) {
      cart.items.forEach(item => {
        updated[item.id] = !allSelected;
      });
    }
    setSelectedItems(updated);
  };

  const isAllSelected = () => {
    if (!cart.items || cart.items.length === 0) return false;
    return cart.items.every(item => selectedItems[item.id]);
  };

  const getSelectedCount = () => {
    if (!cart.items) return 0;
    return cart.items.filter(item => selectedItems[item.id]).length;
  };

  const calculateSubtotal = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      if (selectedItems[item.id]) {
        return sum + (item.product_price * item.quantity);
      }
      return sum;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }
    if (getSelectedCount() === 0) {
      alert('Silakan pilih minimal 1 produk untuk di-checkout.');
      return;
    }

    if (isEditMode) {
      // Delete selected items mode
      for (const item of cart.items) {
        if (selectedItems[item.id]) {
          await removeItem(item.product_id);
        }
      }
      setIsEditMode(false);
    } else {
      // Navigate to Checkout page
      if (setCurrentPage) {
        setCurrentPage('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Group items by dummy store name for Shopee-like store cards
  const storeGroup = {
    name: "Delisa Official Shop",
    badgeType: "mall",
    items: cart.items || []
  };

  return (
    <div className="cart-page-container">
      {/* Header Bar */}
      <div className="cart-header-bar">
        <div className="cart-header-title">
          <button
            onClick={() => {
              if (setCurrentPage) setCurrentPage('home');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}
          >
            <ArrowLeft size={22} />
          </button>
          <span>Keranjang Saya</span>
        </div>

        <div className="cart-header-actions">
          <button
            className="cart-header-btn"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Selesai' : 'Ubah'}
          </button>

          <button
            className="cart-header-btn"
            onClick={() => {
              if (onOpenChat) onOpenChat();
              else alert('Menghubungkan ke Chat CS Center...');
            }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <MessageCircle size={22} color="#ee4d2d" />
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ee4d2d'
            }} />
          </button>
        </div>
      </div>

      {/* Main Cart Items / Empty State */}
      {!cart.items || cart.items.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'var(--card-bg, #fff)',
          margin: '16px 12px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border, #e5e7eb)'
        }}>
          <ShoppingBag size={48} color="#ee4d2d" style={{ marginBottom: '12px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Keranjang Anda Kosong</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Temukan produk menarik dan tambahkan ke keranjang sekarang!
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="btn btn-primary"
            style={{ marginTop: '16px', padding: '10px 24px', background: 'linear-gradient(135deg, #ee4d2d 0%, #dc2626 100%)' }}
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        /* Store Group Card (Shopee Style) */
        <div className="cart-store-card">
          {/* Store Header */}
          <div className="cart-store-header">
            <div className="cart-store-info">
              <input
                type="checkbox"
                className="cart-checkbox"
                checked={isAllSelected()}
                onChange={handleToggleSelectAll}
              />
              <span className="cart-badge-mall">Mall | ORI</span>
              <span className="cart-store-name">
                Delisa Official Shop <ChevronRight size={14} />
              </span>
            </div>
            <button className="cart-header-btn" onClick={() => setIsEditMode(!isEditMode)}>
              Ubah
            </button>
          </div>

          {/* Cart Item Rows */}
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item-row">
              <input
                type="checkbox"
                className="cart-checkbox"
                checked={!!selectedItems[item.id]}
                onChange={() => handleToggleSelect(item.id)}
                style={{ marginTop: '30px' }}
              />

              <img
                src={item.product_image}
                alt={item.product_name}
                className="cart-item-img"
              />

              <div className="cart-item-details">
                <div className="cart-item-title">{item.product_name}</div>

                {/* Variant Selector Pill */}
                <div className="cart-variant-pill" onClick={() => alert('Pilih variasi produk')}>
                  <span>120X80, SATIN</span>
                  <ChevronDown size={12} />
                </div>

                {/* Badges */}
                <div className="cart-badge-tags">
                  <span className="cart-tag-xtra">PROMO XTRA+</span>
                  <span className="cart-tag-xtra" style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                    GRATIS ONGKIR XTRA
                  </span>
                </div>

                {/* Price & Quantity Controls */}
                <div className="cart-price-qty-row">
                  <span className="cart-item-price">{formatRupiah(item.product_price)}</span>

                  <div className="cart-qty-box">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-val">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Sub Offers & Store Vouchers */}
          <div className="cart-offer-line" onClick={() => alert('Promo Toko: Tambah 2 produk lagi diskon 1%')}>
            <div className="cart-offer-left">
              <ShoppingBag size={15} color="#ee4d2d" />
              <span>Tambah 2 produk lagi diskon 1%</span>
            </div>
            <ChevronRight size={14} />
          </div>

          <div className="cart-offer-line" onClick={() => alert('Voucher Toko diklaim!')}>
            <div className="cart-offer-left">
              <Ticket size={15} color="#ee4d2d" />
              <span>Tersedia Voucher Diskon s/d Rp2RB</span>
              <span className="cart-tag-xtra" style={{ marginLeft: '4px' }}>Baru</span>
            </div>
            <ChevronRight size={14} />
          </div>
        </div>
      )}

      {/* Recommendation Section: Kamu Mungkin Juga Suka */}
      <div className="cart-recom-divider">
        <span>——</span>
        <span>Kamu Mungkin Juga Suka</span>
        <span>——</span>
      </div>

      <div className="cart-recom-grid">
        {recomProducts.map((p, idx) => {
          const discountPct = [14, 39, 25, 50][idx % 4];
          return (
            <div
              key={p.id}
              className="cart-recom-card"
              onClick={() => {
                if (onSelectProduct) onSelectProduct(p);
              }}
            >
              <div className="cart-recom-tag">-{discountPct}%</div>
              <img src={p.image_url} alt={p.name} className="cart-recom-img" />
              <div className="cart-recom-body">
                <div className="cart-recom-title">{p.name}</div>
                <div className="cart-recom-price">{formatRupiah(p.price)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Checkout Bar */}
      <div className="cart-bottom-sticky">
        {/* Row 1: Voucher bar */}
        <div className="cart-bottom-row1" onClick={() => alert('Pilih Voucher Belanja / Cashback')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={16} color="#ee4d2d" />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Voucher</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-subtle)' }}>
            <span>Gunakan/ masukkan kode</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Row 2: Coins/Points bar */}
        <div className="cart-bottom-row2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={16} color="#f59e0b" />
            <span>Tidak ada produk yang dipilih</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '0 4px' }}>?</span>
          </div>
          <input
            type="checkbox"
            checked={useCoins}
            onChange={(e) => setUseCoins(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#ee4d2d', cursor: 'pointer' }}
          />
        </div>

        {/* Row 3: Main Footer Row */}
        <div className="cart-bottom-main">
          <label className="cart-select-all">
            <input
              type="checkbox"
              className="cart-checkbox"
              checked={isAllSelected()}
              onChange={handleToggleSelectAll}
            />
            <span>Semua</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="cart-total-box">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-price">{formatRupiah(calculateSubtotal())}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || getSelectedCount() === 0}
              className="cart-checkout-btn"
            >
              {isEditMode ? `Hapus (${getSelectedCount()})` : `Checkout (${getSelectedCount()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
