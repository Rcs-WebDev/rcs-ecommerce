import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  Settings,
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  Wallet,
  Package,
  Truck,
  Star,
  Smartphone,
  Utensils,
  Coins,
  Ticket,
  CreditCard,
  Building2,
  ShieldAlert,
  Gift,
  Heart,
  Crown,
  History,
  Repeat,
  Store
} from 'lucide-react';
import '../styles/Profile.css';

export default function Profile({ setCurrentPage, onOpenChat }) {
  const { user } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);

  const username = user?.name || 'raynand_gezra';

  return (
    <div className="profile-container">
      {/* 1. Header Banner */}
      <div className="profile-header-banner">
        <div className="profile-top-bar">
          <button className="profile-seller-btn" onClick={() => alert('Mulai Jual di RCSMART Seller Center!')}>
            <Store size={14} />
            <span>Mulai Jual</span>
            <ChevronRight size={14} />
          </button>

          <div className="profile-top-actions">
            <button className="profile-icon-btn" onClick={() => alert('Pengaturan Akun RCSMART')}>
              <Settings size={20} />
            </button>
            <button className="profile-icon-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {getCartCount() > 0 && <span className="profile-icon-badge">{getCartCount()}</span>}
            </button>
            <button className="profile-icon-btn" onClick={onOpenChat}>
              <MessageSquare size={20} />
              <span className="profile-icon-badge">1</span>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="profile-user-card">
          <div className="profile-avatar-box">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="User Avatar"
            />
          </div>
          <div>
            <div className="profile-username">
              <span>{username}</span>
              <span className="profile-tier-badge">Silver &gt;</span>
            </div>
            <div className="profile-stats-row">
              <span>13 Pengikut</span> &nbsp;•&nbsp; <span>35 Mengikuti</span>
            </div>
          </div>
        </div>

        {/* VIP Banner */}
        <div className="profile-vip-banner" onClick={() => alert('Manfaat VIP: Cashback 20% ekstra setiap transaksi!')}>
          <span>👑 RCS VIP • Dapatkan Extra Diskon 20% Setiap Hari</span>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* 2. Security Prompt Box */}
      <div className="profile-sec-banner">
        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
          <strong>Log in secara mudah dan cepat</strong>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Kamu hanya perlu atur biometrik untuk tingkatkan keamanan akunmu.
          </p>
        </div>
        <button
          onClick={() => alert('Mengaktifkan autentikasi biometrik...')}
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
        >
          Atur Sekarang
        </button>
      </div>

      {/* 3. Pesanan Saya Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <span>Pesanan Saya</span>
          <span className="profile-see-all" onClick={() => setCurrentPage('my-orders')}>
            Lihat Riwayat Pesanan &gt;
          </span>
        </div>

        <div className="profile-grid-4">
          <div className="profile-grid-item" onClick={() => setCurrentPage('my-orders')}>
            <div className="profile-grid-icon-box">
              <Wallet size={22} />
            </div>
            <span className="profile-grid-label">Belum Bayar</span>
          </div>

          <div className="profile-grid-item" onClick={() => setCurrentPage('my-orders')}>
            <div className="profile-grid-icon-box">
              <Package size={22} />
            </div>
            <span className="profile-grid-label">Dikemas</span>
          </div>

          <div className="profile-grid-item" onClick={() => setCurrentPage('my-orders')}>
            <div className="profile-grid-icon-box">
              <Truck size={22} />
            </div>
            <span className="profile-grid-label">Dikirim</span>
          </div>

          <div className="profile-grid-item" onClick={() => setCurrentPage('my-orders')}>
            <div className="profile-grid-icon-box" style={{ position: 'relative' }}>
              <Star size={22} color="#f59e0b" />
              <span className="notif-badge-dot" style={{ top: '-2px', right: '-2px' }} />
            </div>
            <span className="profile-grid-label">Beri Penilaian</span>
          </div>
        </div>

        {/* Extra Services Row */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}
            onClick={() => setCurrentPage('pulsa-tagihan')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
              <Smartphone size={18} color="var(--primary)" />
              <span>Pulsa, Tagihan & Tiket</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Diskon Rp4RB &gt;</span>
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer' }}
            onClick={() => setCurrentPage('shopee-food')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
              <Utensils size={18} color="#f97316" />
              <span>RCS Food / Kuliner</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Gratis Ongkir &gt;</span>
          </div>
        </div>
      </div>

      {/* 4. Dompet Saya Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <span>Dompet Saya</span>
        </div>

        <div className="profile-grid-4">
          <div className="profile-grid-item" onClick={() => setCurrentPage('shopee-pay')}>
            <div className="profile-grid-icon-box">
              <CreditCard size={20} color="#ef4444" />
            </div>
            <span className="profile-grid-label">RC Pay / RcsPay</span>
            <span className="profile-subtext" style={{ color: '#ef4444', fontWeight: 700 }}>Rp1.250.000</span>
          </div>

          <div className="profile-grid-item" onClick={() => alert('Koin RCS: 1.010 Koin')}>
            <div className="profile-grid-icon-box">
              <Coins size={20} color="#f59e0b" />
            </div>
            <span className="profile-grid-label">Koin RCS</span>
            <span className="profile-subtext" style={{ color: '#f59e0b' }}>1.010 Koin</span>
          </div>

          <div className="profile-grid-item" onClick={() => alert('50+ Voucher Belanja Tersedia')}>
            <div className="profile-grid-icon-box">
              <Ticket size={20} color="var(--primary)" />
            </div>
            <span className="profile-grid-label">Voucher Saya</span>
            <span className="profile-subtext">50+ Voucher</span>
          </div>

          <div className="profile-grid-item" onClick={() => setCurrentPage('shopee-pay')}>
            <div className="profile-grid-icon-box">
              <Gift size={20} color="#10b981" />
            </div>
            <span className="profile-grid-label">App RC Pay</span>
            <span className="profile-subtext">Gratis Koin</span>
          </div>
        </div>
      </div>

      {/* 5. Keuangan Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <span>Keuangan</span>
          <span className="profile-see-all" onClick={() => setCurrentPage('spay-later')}>Lihat Semua &gt;</span>
        </div>

        <div className="profile-cards-2col">
          <div className="profile-subcard" onClick={() => setCurrentPage('spay-later')}>
            <CreditCard size={24} color="#ef4444" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>RPayLater</h5>
              <p style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Limit Active Rp12.000.000</p>
            </div>
          </div>

          <div className="profile-subcard" onClick={() => setCurrentPage('shopee-pay')}>
            <Coins size={24} color="#f59e0b" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>SPinjam</h5>
              <p style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Gratis Admin & 25RB Koin</p>
            </div>
          </div>

          <div className="profile-subcard" onClick={() => setCurrentPage('shopee-pay')}>
            <Building2 size={24} color="var(--primary)" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Bank Digital</h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gratis Transfer Antarbank</p>
            </div>
          </div>

          <div className="profile-subcard" onClick={() => alert('Fitur Asuransi Belanja')}>
            <ShieldAlert size={24} color="#10b981" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Asuransi Belanja</h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pertanggungan Rp1JT</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Aktivitas Saya Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <span>Aktivitas Saya</span>
          <span className="profile-see-all">Lihat Semua &gt;</span>
        </div>

        <div className="profile-cards-2col">
          <div className="profile-subcard">
            <Gift size={20} color="#ef4444" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Affiliate Program</span>
          </div>

          <div className="profile-subcard">
            <Heart size={20} color="#ef4444" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Favorit Saya</span>
          </div>

          <div className="profile-subcard">
            <Crown size={20} color="#f59e0b" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>RCSMART VIP</span>
          </div>

          <div className="profile-subcard">
            <Ticket size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Bagi-Bagi Voucher</span>
          </div>

          <div className="profile-subcard">
            <History size={20} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Terakhir Dilihat</span>
          </div>

          <div className="profile-subcard">
            <Repeat size={20} color="#10b981" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Beli Lagi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
