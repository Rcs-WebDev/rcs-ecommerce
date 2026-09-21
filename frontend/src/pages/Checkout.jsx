import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  Ticket,
  Coins,
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import '../styles/Checkout.css';

export default function Checkout({ setCurrentPage, onPaymentComplete }) {
  const { cart, checkout, loading } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const [selectedPayment, setSelectedPayment] = useState('seabank');
  const [useCoins, setUseCoins] = useState(false);
  const [isDropship, setIsDropship] = useState(false);
  const [sellerNote, setSellerNote] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('cargo');

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  };

  const subtotalProducts = calculateSubtotal() || 17400;
  const shippingFee = selectedShipping === 'cargo' ? 3500 : 6500;
  const serviceFee = 1100;
  const shippingDiscount = selectedShipping === 'cargo' ? 3500 : 0;
  const voucherDiscount = 500;
  const grandTotal = Math.max(0, subtotalProducts + shippingFee + serviceFee - shippingDiscount - voucherDiscount);

  const handleCreateOrder = async () => {
    if (!token) {
      alert('Silakan login terlebih dahulu untuk membuat pesanan.');
      if (setCurrentPage) setCurrentPage('login');
      return;
    }
    // Trigger Midtrans Snap payment modal via checkout service
    if (checkout) {
      await checkout(onPaymentComplete);
    }
  };

  const displayItems = (cart && cart.items && cart.items.length > 0) ? cart.items : [
    {
      id: 1,
      product_name: "Bendera Merah Putih Premium Bahan Katun & Satin",
      product_price: 17400,
      quantity: 1,
      product_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200"
    }
  ];

  return (
    <div className="co-container">
      {/* Header Bar */}
      <div className="co-header-bar">
        <button
          onClick={() => {
            if (setCurrentPage) setCurrentPage('cart');
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="co-header-title">Checkout</span>
      </div>

      {/* 1. Alamat Pengiriman Card */}
      <div className="co-card co-address-box" onClick={() => alert('Ubah alamat pengiriman')}>
        <MapPin size={22} color="#ee4d2d" style={{ marginTop: '2px' }} />
        <div className="co-address-content">
          <div className="co-address-name">
            Andrena Rosita Wattimena <span style={{ color: 'var(--text-subtle)', fontWeight: 500 }}>(+62) 895-5530-0911</span>
          </div>
          <div className="co-address-detail">
            Kp Sukaseuri Timur, RT 016/RW 007 desa Sarimulya (belakang bakso rusuk joss rumah cat kuning pagar hitam) KOTABARU, KAB. KARAWANG, JAWA BARAT, ID 41374
          </div>
        </div>
        <ChevronRight size={18} color="var(--text-muted)" />
      </div>

      {/* 2. Store Items & Shipping Details Card */}
      <div className="co-card">
        <div className="co-store-header">
          <span className="co-badge-mall">Mall | ORI</span>
          <span className="co-store-name">Delisa Official Shop</span>
        </div>

        {displayItems.map((item) => (
          <div key={item.id} className="co-item-row">
            <img src={item.product_image} alt={item.product_name} className="co-item-img" />
            <div className="co-item-details">
              <div className="co-item-title">{item.product_name}</div>
              <div className="co-item-variant">120X80, SATIN</div>
              <div className="co-item-price-row">
                <div>
                  <span className="co-item-price">{formatRupiah(item.product_price)}</span>
                  <span className="co-item-original-price">{formatRupiah(item.product_price * 2)}</span>
                </div>
                <span className="co-item-qty">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Voucher Toko Row */}
        <div className="co-subrow" onClick={() => alert('Voucher Toko Rp500 digunakan')}>
          <span>Voucher Toko</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ee4d2d', fontWeight: 600 }}>
            <span style={{ border: '1px solid #ee4d2d', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Rp500</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Pesan untuk Penjual */}
        <div className="co-subrow">
          <span>Pesan untuk Penjual</span>
          <input
            type="text"
            placeholder="Tinggalkan pesan >"
            value={sellerNote}
            onChange={(e) => setSellerNote(e.target.value)}
            style={{
              border: 'none',
              background: 'none',
              textAlign: 'right',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none',
              width: '180px'
            }}
          />
        </div>

        {/* Opsi Pengiriman */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            <span>Opsi Pengiriman</span>
            <span style={{ color: 'var(--text-subtle)', cursor: 'pointer' }} onClick={() => alert('Lihat opsi pengiriman')}>
              Lihat Semua &gt;
            </span>
          </div>

          <div
            className="co-shipping-box"
            style={{ borderColor: selectedShipping === 'cargo' ? '#10b981' : 'var(--glass-border)' }}
            onClick={() => setSelectedShipping('cargo')}
          >
            <div className="co-shipping-option">
              <div>
                <span className="co-shipping-badge">15 - 16 Ags</span>
                <strong style={{ fontSize: '0.85rem' }}>Hemat Kargo</strong>
              </div>
              <div>
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.78rem', marginRight: '6px' }}>Rp3.500</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>Rp0</span>
              </div>
            </div>

            <div
              className="co-shipping-option"
              style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #e5e7eb' }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedShipping('reguler');
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>🚚 16 Ags - Reguler</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Rp6.500</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
            <Info size={13} color="#6b7280" />
            <span>Voucher s/d Rp10.000 jika pesanan terlambat.</span>
          </div>
        </div>

        {/* Total produk line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f3f4f6', fontSize: '0.88rem', fontWeight: 700 }}>
          <span>Total {displayItems.length} Produk</span>
          <span style={{ color: '#ee4d2d' }}>{formatRupiah(subtotalProducts)}</span>
        </div>
      </div>

      {/* 3. Beli Sekalian Box (Add-on Deal) */}
      <div className="co-card">
        <div className="co-addon-header">
          <div>
            <strong style={{ color: '#ee4d2d', fontSize: '0.9rem', marginRight: '8px' }}>Beli Sekalian</strong>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Hemat Rp500</span>
          </div>
          <div className="co-addon-timer">
            <span>00</span>:<span>59</span>:<span>35</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f9fafb', padding: '10px', borderRadius: '10px' }}>
          <img src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=120" alt="Addon" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>TIANG GORDEN KOLONG DAPU...</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>2 PCS HOOK</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ee4d2d', marginTop: '4px' }}>
              Rp13.151 <span style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>Rp15.000</span>
            </div>
          </div>
          <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#ee4d2d' }} />
        </div>
      </div>

      {/* 4. Voucher & Koin Card */}
      <div className="co-card">
        <div className="co-subrow" onClick={() => alert('Voucher Gratis Ongkir diterapkan')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} color="#ee4d2d" />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Voucher</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
            <span style={{ border: '1px solid #10b981', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Gratis Ongkir</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* VIP Banner */}
        <div className="co-vip-banner">
          <div>
            <span style={{ background: '#ee4d2d', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 4px', borderRadius: '3px', marginRight: '6px' }}>VIP</span>
            <strong style={{ fontSize: '0.82rem' }}>Tambah Diskon s/d 30RB Sekarang!</strong>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Langganan mulai dari Rp5RB/bulan</div>
          </div>
          <button style={{ background: '#ee4d2d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
            Coba Gratis
          </button>
        </div>

        {/* Switch Koin */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Coins size={18} color="#f59e0b" />
            <span>Tukarkan 1010 Koin Shopee</span>
          </div>
          <input
            type="checkbox"
            className="co-switch"
            checked={useCoins}
            onChange={(e) => setUseCoins(e.target.checked)}
          />
        </div>
      </div>

      {/* 5. Metode Pembayaran Card */}
      <div className="co-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700, fontSize: '0.92rem' }}>
          <span>Metode Pembayaran</span>
          <span style={{ color: 'var(--text-subtle)', cursor: 'pointer', fontSize: '0.82rem' }} onClick={() => alert('Lihat semua metode pembayaran')}>
            Lihat Semua &gt;
          </span>
        </div>

        {/* Option 1: SeaBank */}
        <div
          className={`co-payment-option ${selectedPayment === 'seabank' ? 'active' : ''}`}
          onClick={() => setSelectedPayment('seabank')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building size={20} color="#ee4d2d" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Transfer Bank</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>SeaBank Instant</div>
            </div>
          </div>
          <input type="radio" name="payment" checked={selectedPayment === 'seabank'} onChange={() => { }} style={{ accentColor: '#ee4d2d' }} />
        </div>

        {/* Option 2: SPayLater */}
        <div
          className={`co-payment-option ${selectedPayment === 'spaylater' ? 'active' : ''}`}
          onClick={() => setSelectedPayment('spaylater')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={20} color="#ee4d2d" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>SPayLater (Limit Rp12.000.000)</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Bebas biaya admin. Cicilan 0% tenor 1-3 bulan</div>
            </div>
          </div>
          <input type="radio" name="payment" checked={selectedPayment === 'spaylater'} onChange={() => { }} style={{ accentColor: '#ee4d2d' }} />
        </div>

        {/* Option 3: ShopeePay */}
        <div
          className={`co-payment-option ${selectedPayment === 'shopeepay' ? 'active' : ''}`}
          onClick={() => setSelectedPayment('shopeepay')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={20} color="#ee4d2d" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Saldo ShopeePay</div>
              <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ee4d2d', fontSize: '0.68rem', padding: '1px 4px', borderRadius: '3px' }}>Diskon Extra Rp1000</span>
            </div>
          </div>
          <input type="radio" name="payment" checked={selectedPayment === 'shopeepay'} onChange={() => { }} style={{ accentColor: '#ee4d2d' }} />
        </div>
      </div>

      {/* 6. Rincian Pembayaran Card */}
      <div className="co-card">
        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '10px' }}>Rincian Pembayaran</div>

        <div className="co-summary-row">
          <span>Subtotal Pesanan</span>
          <span>{formatRupiah(subtotalProducts)}</span>
        </div>
        <div className="co-summary-row">
          <span>Subtotal Pengiriman</span>
          <span>{formatRupiah(shippingFee)}</span>
        </div>
        <div className="co-summary-row">
          <span>Biaya Layanan</span>
          <span>{formatRupiah(serviceFee)}</span>
        </div>
        <div className="co-summary-row" style={{ color: '#10b981' }}>
          <span>Total Diskon Pengiriman</span>
          <span>-{formatRupiah(shippingDiscount)}</span>
        </div>
        <div className="co-summary-row" style={{ color: '#10b981' }}>
          <span>Voucher Diskon</span>
          <span>-{formatRupiah(voucherDiscount)}</span>
        </div>

        <div className="co-summary-total">
          <span>Total Pembayaran</span>
          <span style={{ color: '#ee4d2d' }}>{formatRupiah(grandTotal)}</span>
        </div>
      </div>

      {/* 7. Dropshipper Option Card */}
      <div className="co-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Kirim sebagai Dropshipper</span>
        <input
          type="checkbox"
          className="co-switch"
          checked={isDropship}
          onChange={(e) => setIsDropship(e.target.checked)}
        />
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="co-bottom-bar">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Total <strong className="co-total-text">{formatRupiah(grandTotal)}</strong>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ee4d2d' }}>Hemat Rp21.100</div>
        </div>

        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="co-submit-btn"
        >
          {loading ? 'Memproses...' : 'Buat Pesanan'}
        </button>
      </div>
    </div>
  );
}
