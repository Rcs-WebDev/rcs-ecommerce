import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  ShoppingBag,
  Smartphone,
  Wifi,
  Zap,
  CreditCard,
  Droplet,
  Tv,
  Gamepad2,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import '../styles/PulsaTagihan.css';

export default function PulsaTagihan({ setCurrentPage }) {
  const [activeStatusTab, setActiveStatusTab] = useState('Bayar');
  const [activeCategoryPill, setActiveCategoryPill] = useState('Semua Kategori');

  // Active service form state
  const [activeService, setActiveService] = useState('pulsa'); // 'pulsa', 'paket-data', 'pln', 'emoney'
  const [phoneNumber, setPhoneNumber] = useState('081234567890');
  const [selectedDenom, setSelectedDenom] = useState(null);
  const [plnId, setPlnId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const statusTabs = ['Bayar', 'Sedang Diproses', 'Selesai', 'Dibatalkan'];
  const categoryPills = ['Semua Kategori', 'Isi Ulang', 'Tagihan', 'Layanan'];

  const pulsaOptions = [
    { id: 1, title: 'Pulsa Rp10.000', price: 10500, promo: 'Diskon Rp4RB' },
    { id: 2, title: 'Pulsa Rp25.000', price: 25000, promo: 'Diskon Rp4RB' },
    { id: 3, title: 'Pulsa Rp50.000', price: 49000, promo: 'Cashback 5%' },
    { id: 4, title: 'Pulsa Rp100.000', price: 97000, promo: 'Diskon Rp4RB' }
  ];

  const getProviderName = (num) => {
    if (!num) return '';
    if (num.startsWith('0812') || num.startsWith('0813') || num.startsWith('0821')) return 'Telkomsel';
    if (num.startsWith('0856') || num.startsWith('0857')) return 'Indosat Ooredoo';
    if (num.startsWith('0817') || num.startsWith('0878')) return 'XL Axiata';
    if (num.startsWith('0896') || num.startsWith('0895')) return 'Tri (3)';
    return 'Operator Seluler';
  };

  const handlePayTransaction = () => {
    if (!selectedDenom) {
      alert('Silakan pilih nominal transaksi terlebih dahulu.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  return (
    <div className="pulsa-container animate-fade-in">
      {/* Top Header Bar */}
      <div className="pulsa-header">
        <div className="pulsa-top-bar">
          <div className="pulsa-top-left">
            <button className="myorders-back-btn" onClick={() => setCurrentPage('profile')}>
              <ArrowLeft size={22} />
            </button>
            <span className="pulsa-title">Pulsa, Tagihan & Tiket</span>
          </div>
          <div className="myorders-top-actions">
            <button className="myorders-icon-btn" onClick={() => alert('Cari Layanan Digital')}>
              <Search size={20} />
            </button>
            <button className="myorders-icon-btn" onClick={() => alert('Chat Customer Service Tagihan')}>
              <MessageSquare size={20} />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="pulsa-status-tabs">
          {statusTabs.map((tab) => (
            <div
              key={tab}
              className={`pulsa-status-item ${activeStatusTab === tab ? 'active' : ''}`}
              onClick={() => setActiveStatusTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Category Pills */}
        <div className="pulsa-category-pills">
          {categoryPills.map((pill) => (
            <button
              key={pill}
              className={`pill-item ${activeCategoryPill === pill ? 'active' : ''}`}
              onClick={() => setActiveCategoryPill(pill)}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Service Purchase Card */}
      <div className="pulsa-form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {activeService === 'pulsa' && 'Isi Ulang Pulsa'}
            {activeService === 'paket-data' && 'Beli Paket Data Internet'}
            {activeService === 'pln' && 'Bayar / Token Listrik PLN'}
            {activeService === 'emoney' && 'Top Up Uang Elektronik'}
          </h3>
          <span className="provider-badge">{getProviderName(phoneNumber)}</span>
        </div>

        {activeService !== 'pln' ? (
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Nomor HP Tujuan:
            </label>
            <input
              type="text"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Contoh: 081234567890"
            />
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              ID Pelanggan / Nomor Meter PLN:
            </label>
            <input
              type="text"
              className="form-input"
              value={plnId}
              onChange={(e) => setPlnId(e.target.value)}
              placeholder="Contoh: 541209873412"
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
            Pilih Nominal Produk:
          </label>
          <div className="denomination-grid">
            {pulsaOptions.map((opt) => (
              <div
                key={opt.id}
                className={`denom-card ${selectedDenom?.id === opt.id ? 'selected' : ''}`}
                onClick={() => setSelectedDenom(opt)}
              >
                <span className="denom-title">{opt.title}</span>
                <span className="denom-price">Rp{opt.price.toLocaleString('id-ID')}</span>
                <span className="discount-tag">{opt.promo}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', background: '#ee4d2d', marginTop: '8px' }}
          onClick={handlePayTransaction}
          disabled={isProcessing}
        >
          {isProcessing ? 'Memproses Transaksi...' : selectedDenom ? `Bayar Sekarang - Rp${selectedDenom.price.toLocaleString('id-ID')}` : 'Pilih Nominal'}
        </button>
      </div>

      {/* Empty State when tab is active */}
      {activeStatusTab === 'Bayar' && (
        <div className="pulsa-empty-box">
          <div className="empty-icon-bag">
            <ShoppingBag size={32} />
          </div>
          <p className="empty-text">Belum ada pesanan. Cari Penawaran Menarik!</p>
          <button className="btn-search-other" onClick={() => alert('Mencari penawaran spesial...')}>
            Cari Produk Lain
          </button>
        </div>
      )}

      {/* Recommendation Section matching Image 2 */}
      <div className="pulsa-recom-section">
        <div className="recom-divider">
          <div className="recom-line" />
          <span className="recom-title">Rekomendasi Layanan Untukmu</span>
          <div className="recom-line" />
        </div>

        <div className="pulsa-recom-card">
          {/* Section Beli */}
          <div className="service-group-title">Beli</div>
          <div className="service-grid">
            <div className="service-item" onClick={() => setActiveService('pulsa')}>
              <div className="service-icon-box">
                <Smartphone size={22} color="#10b981" />
              </div>
              <div className="service-info">
                <span className="service-name">Pulsa</span>
                <span className="discount-tag">Diskon Rp4RB</span>
              </div>
            </div>

            <div className="service-item" onClick={() => setActiveService('paket-data')}>
              <div className="service-icon-box">
                <Wifi size={22} color="#f59e0b" />
              </div>
              <div className="service-info">
                <span className="service-name">Paket Data</span>
                <span className="discount-tag">Diskon Rp4RB</span>
              </div>
            </div>
          </div>

          {/* Section Bayar Tagihan & Lainnya */}
          <div className="service-group-title">Bayar Tagihan & Lainnya</div>
          <div className="service-grid">
            <div className="service-item" onClick={() => setActiveService('pln')}>
              <div className="service-icon-box">
                <Zap size={22} color="#ef4444" />
              </div>
              <div className="service-info">
                <span className="service-name">Listrik PLN</span>
                <span className="discount-tag">Diskon Rp4RB</span>
              </div>
            </div>

            <div className="service-item" onClick={() => setActiveService('emoney')}>
              <div className="service-icon-box">
                <CreditCard size={22} color="#06b6d4" />
              </div>
              <div className="service-info">
                <span className="service-name">Uang Elektronik</span>
              </div>
            </div>

            <div className="service-item" onClick={() => alert('Layanan PDAM')}>
              <div className="service-icon-box">
                <Droplet size={22} color="#3b82f6" />
              </div>
              <div className="service-info">
                <span className="service-name">PDAM</span>
              </div>
            </div>

            <div className="service-item" onClick={() => alert('Layanan TV Kabel & Internet')}>
              <div className="service-icon-box">
                <Tv size={22} color="#8b5cf6" />
              </div>
              <div className="service-info">
                <span className="service-name">TV Kabel & Internet</span>
              </div>
            </div>

            <div className="service-item" onClick={() => alert('Layanan Voucher Game')}>
              <div className="service-icon-box">
                <Gamepad2 size={22} color="#ec4899" />
              </div>
              <div className="service-info">
                <span className="service-name">Voucher Game</span>
              </div>
            </div>

            <div className="service-item" onClick={() => alert('Layanan Pasca Bayar')}>
              <div className="service-icon-box">
                <PhoneCall size={22} color="#f97316" />
              </div>
              <div className="service-info">
                <span className="service-name">Pasca Bayar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showSuccessModal && (
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
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            color: 'var(--text-main)'
          }}>
            <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              Pembayaran Berhasil!
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {selectedDenom?.title} untuk nomor <strong>{phoneNumber}</strong> telah diproses secara instan.
            </p>

            <div style={{
              background: 'var(--input-bg)',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>SUKSES</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Bayar:</span>
                <span style={{ fontWeight: 700, color: '#ee4d2d' }}>Rp{selectedDenom?.price.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Metode Pembayaran:</span>
                <span style={{ fontWeight: 600 }}>RcsPay / RC Pay</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', background: '#ee4d2d' }}
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedDenom(null);
                setActiveStatusTab('Selesai');
              }}
            >
              Lihat Status Pesanan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
