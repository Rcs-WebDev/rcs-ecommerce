import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  Tag,
  Gift,
  Video,
  CreditCard,
  Info,
  CheckCheck,
  X
} from 'lucide-react';
import '../styles/Notifications.css';

export default function Notifications({ setCurrentPage, onOpenChat }) {
  const { getCartCount, setIsCartOpen } = useContext(CartContext);
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('top');

  const updateTabs = [
    { id: 'top', label: 'Pilihan Teratas', badge: '5', icon: <Tag size={16} color="#ef4444" /> },
    { id: 'promo', label: 'Promo RCS', icon: <Gift size={16} color="#f59e0b" /> },
    { id: 'live', label: 'Live, Video & Hadiah', icon: <Video size={16} color="var(--primary)" /> },
    { id: 'finance', label: 'Keuangan', icon: <CreditCard size={16} color="#10b981" /> },
    { id: 'info', label: 'Info RCS', icon: <Info size={16} color="#3b82f6" /> }
  ];

  return (
    <div className="notif-page-container">
      {/* 1. Header Bar */}
      <div className="notif-header-bar">
        <h2 className="notif-header-title">Notifikasi</h2>
        <div className="notif-header-actions">
          <button className="profile-icon-btn" onClick={() => setIsCartOpen(true)} style={{ color: 'var(--text-main)' }}>
            <ShoppingBag size={22} />
            {getCartCount() > 0 && <span className="profile-icon-badge">{getCartCount()}</span>}
          </button>
          <button className="profile-icon-btn" onClick={onOpenChat} style={{ color: 'var(--text-main)' }}>
            <MessageSquare size={22} />
            <span className="profile-icon-badge">1</span>
          </button>
        </div>
      </div>

      {/* 2. Permission Banner */}
      {showAlertBanner && (
        <div className="notif-alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#854d0e" />
            <span>
              Izinkan notifikasi untuk dapatkan info status pesanan, promo, dan info menarik lainnya.{' '}
              <span className="notif-allow-btn" onClick={() => alert('Notifikasi diizinkan!')}>Izinkan</span>
            </span>
          </div>
          <button onClick={() => setShowAlertBanner(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#854d0e' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 3. Status Pesanan Section */}
      <div className="notif-section-box">
        <div className="notif-section-title">
          <span>Status Pesanan</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setCurrentPage('order-status')}>
            Lihat Semua &gt;
          </span>
        </div>

        {/* Status Card 1 */}
        <div className="notif-card-item" onClick={() => setCurrentPage('order-status')}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Pesanan Selesai</h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Nilai pesanan paling lambat <strong>30-11-2026</strong> untuk dapatkan hingga <strong>30 koin</strong>.
            </p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '6px', display: 'block' }}>
              02-08-2026 20:57
            </span>
          </div>
          <div className="notif-card-thumb">
            <img src="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=120" alt="Order product" />
          </div>
        </div>

        {/* Status Card 2 */}
        <div className="notif-card-item" onClick={() => setCurrentPage('order-status')}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-red)' }}>Pesanan Dibatalkan</h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Alasan: <strong>Ada aktivitas mencurigakan</strong><br />
              Status: <strong>Pengembalian dana diproses</strong>
            </p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '6px', display: 'block' }}>
              29-07-2026 23:10
            </span>
          </div>
          <div className="notif-card-thumb">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120" alt="Order product" />
          </div>
        </div>
      </div>

      {/* 4. Update Terbaru Section */}
      <div className="notif-section-box">
        <div className="notif-section-title">
          <span>Update Terbaru</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => alert('Semua notifikasi ditandai dibaca')}>
            <CheckCheck size={14} /> Tandai Sudah Dibaca
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="notif-filter-tabs">
          {updateTabs.map((tab) => (
            <div
              key={tab.id}
              className={`notif-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div style={{ position: 'relative' }}>
                {tab.icon}
                {tab.badge && <span className="notif-badge-dot" style={{ top: '-4px', right: '-4px' }} />}
              </div>
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Notifications List */}
        <div>
          <div className="notif-list-row">
            <div className="notif-icon-square">
              <Tag size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Voucher Hangus Besok! 🔥</h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.4 }}>
                1 Voucher-mu akan hangus pada 09/08, 23:59. Pakai buat belanja produk Mall 100% Ori 👉
              </p>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>08-08-2026 14:28</span>
            </div>
          </div>

          <div className="notif-list-row">
            <div className="notif-icon-square" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <Gift size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>⏳ PENTING: Voucher Hangus Besok!</h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.4 }}>
                1 Voucher Cashback 100% akan hangus malam ini. Gunakan sekarang agar belanjaanmu makin hemat!
              </p>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>01-08-2026 15:04</span>
            </div>
          </div>

          <div className="notif-list-row">
            <div className="notif-icon-square" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' }}>
              <Video size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Cuma di Toni Cu: TV 15JT Jadi 6JT! 📺</h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.4 }}>
                Saksikan live streaming malam ini dan klaim diskon instan s.d. Rp 1.500.000!
              </p>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>01-08-2026 10:12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
