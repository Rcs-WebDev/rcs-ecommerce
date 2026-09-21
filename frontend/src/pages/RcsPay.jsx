import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Coins,
  PlusCircle,
  ArrowUpRight,
  Send,
  QrCode,
  Smartphone,
  CreditCard,
  MapPin,
  TrendingUp,
  Grid,
  CheckCircle2,
  X
} from 'lucide-react';
import '../styles/RcsPay.css';

export default function RcsPay({ setCurrentPage }) {
  const [balance, setBalance] = useState(1250000);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'topup', 'transfer', 'qris', 'withdraw'

  // Modal Inputs
  const [topupAmount, setTopupAmount] = useState('50000');
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const handleTopupSubmit = () => {
    const val = parseInt(topupAmount, 10);
    if (!val || val <= 0) return alert('Masukkan nominal saldo yang valid');
    setBalance(prev => prev + val);
    alert(`Berhasil mengisi saldo RcsPay sebesar Rp${val.toLocaleString('id-ID')} via Bank Transfer!`);
    setActiveModal(null);
  };

  const handleTransferSubmit = () => {
    const val = parseInt(transferAmount, 10);
    if (!val || val <= 0) return alert('Masukkan nominal transfer yang valid');
    if (val > balance) return alert('Saldo RcsPay Anda tidak mencukupi');
    setBalance(prev => prev - val);
    alert(`Berhasil mengirim Rp${val.toLocaleString('id-ID')} ke ${transferTarget || 'Rekening Tujuan'}!`);
    setActiveModal(null);
    setTransferTarget('');
    setTransferAmount('');
  };

  return (
    <div className="pay-container animate-fade-in">
      {/* Header */}
      <div className="pay-header">
        <div className="pay-header-left">
          <button
            onClick={() => setCurrentPage('profile')}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <ArrowLeft size={22} />
          </button>
          <div className="pay-title">
            RcsPay <span className="pay-plus-badge">PLUS</span>
            <button
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
            >
              {isBalanceHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button className="claim-bonus-btn" onClick={() => alert('Klaim Bonus 50RB RcsPay!')}>
          <Coins size={14} color="#f59e0b" />
          <span>Klaim 50RB &gt;</span>
        </button>
      </div>

      {/* Balance Overview Grid Section */}
      <div className="pay-balance-section">
        <div className="pay-balance-grid">
          {/* Main RcsPay Balance Card */}
          <div className="pay-main-balance-card">
            <div>
              <div className="pay-balance-label">
                <CreditCard size={14} color="#ee4d2d" /> RcsPay Saldo
              </div>
              <div className="pay-balance-amount">
                {isBalanceHidden ? '••••••••' : `Rp ${balance.toLocaleString('id-ID')}`}
              </div>
            </div>
            <div className="pay-upgrade-hint" onClick={() => alert('Upgrade akun ke RcsPay Plus untuk dapat bunga 6%!')}>
              Upgrade sekarang untuk dapat <strong>bunga 6%!</strong> &gt;
            </div>
          </div>

          {/* RPayLater Credit Overview Card */}
          <div className="pay-sub-credit-card" onClick={() => setCurrentPage('spay-later')}>
            <div>
              <div className="pay-balance-label" style={{ color: '#ee4d2d' }}>RPayLater</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>Rp 9.750.000</div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>Perbarui Kredit &gt;</span>
          </div>

          {/* SPinjam Credit Overview Card */}
          <div className="pay-sub-credit-card" onClick={() => alert('Aktivasi SPinjam untuk dapatkan Bonus 25RB Koin!')}>
            <div>
              <div className="pay-balance-label" style={{ color: '#f59e0b' }}>SPinjam</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Aktifkan Sekarang</div>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>Bonus 25RB &gt;</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons matching Image 3 */}
      <div className="pay-quick-actions">
        <div className="quick-action-item" onClick={() => setActiveModal('topup')}>
          <div className="quick-action-icon">
            <PlusCircle size={22} />
          </div>
          <span className="quick-action-label">Isi Saldo</span>
        </div>

        <div className="quick-action-item" onClick={() => setActiveModal('withdraw')}>
          <div className="quick-action-icon">
            <ArrowUpRight size={22} />
          </div>
          <span className="quick-action-label">Tarik Tunai</span>
        </div>

        <div className="quick-action-item" onClick={() => setActiveModal('transfer')}>
          <div className="quick-action-icon">
            <Send size={22} />
          </div>
          <span className="quick-action-label">Kirim Uang</span>
        </div>

        <div className="quick-action-item" onClick={() => setActiveModal('qris')}>
          <div className="quick-action-icon">
            <QrCode size={22} />
          </div>
          <span className="quick-action-label">Minta Uang</span>
        </div>
      </div>

      {/* Services Features Grid matching Image 3 */}
      <div className="pay-features-grid">
        <div className="feature-item" onClick={() => alert('Aplikasi RcsPay')}>
          <div className="feature-icon-box">
            <CreditCard size={20} color="#ee4d2d" />
          </div>
          <span className="feature-label">Aplikasi RcsPay</span>
        </div>

        <div className="feature-item" onClick={() => setCurrentPage('pulsa-tagihan')}>
          <div className="feature-icon-box">
            <Smartphone size={20} color="#10b981" />
          </div>
          <span className="feature-label">Pulsa & Tagihan</span>
        </div>

        <div className="feature-item" onClick={() => alert('RcsPay Sekitarmu')}>
          <div className="feature-icon-box">
            <MapPin size={20} color="#f59e0b" />
          </div>
          <span className="feature-label">RcsPay Sekitarmu</span>
        </div>

        <div className="feature-item" onClick={() => alert('Investasi Emas RcsPay')}>
          <div className="feature-icon-box">
            <Coins size={20} color="#eab308" />
          </div>
          <span className="feature-label">Emas</span>
        </div>

        <div className="feature-item" onClick={() => setActiveModal('transfer')}>
          <div className="feature-icon-box">
            <Send size={20} color="#3b82f6" />
          </div>
          <span className="feature-label">Kirim ke E-Wallet</span>
        </div>

        <div className="feature-item" onClick={() => alert('Investasi Reksa Dana')}>
          <div className="feature-icon-box">
            <TrendingUp size={20} color="#10b981" />
          </div>
          <span className="feature-label">Reksa Dana</span>
        </div>

        <div className="feature-item" onClick={() => alert('Google Play Voucher')}>
          <div className="feature-icon-box">
            <Grid size={20} color="#ef4444" />
          </div>
          <span className="feature-label">Google Play</span>
        </div>

        <div className="feature-item" onClick={() => alert('Lihat Semua Fitur RcsPay')}>
          <div className="feature-icon-box">
            <Grid size={20} color="#8b5cf6" />
          </div>
          <span className="feature-label">Lihat Semua</span>
        </div>
      </div>

      {/* RcsPay Bottom Navigation Bar */}
      <div className="pay-bottom-nav">
        <div className="pay-nav-item active">
          <span>Beranda</span>
        </div>
        <div className="pay-nav-item" onClick={() => alert('Laporan Keuangan RcsPay')}>
          <span>Keuangan</span>
        </div>
        <div className="qris-big-btn" onClick={() => setActiveModal('qris')}>
          <QrCode size={24} />
          <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>QRIS</span>
        </div>
        <div className="pay-nav-item" onClick={() => alert('Riwayat Transaksi RcsPay')}>
          <span>Riwayat</span>
        </div>
        <div className="pay-nav-item" onClick={() => setCurrentPage('profile')}>
          <span>Saya</span>
        </div>
      </div>

      {/* Top Up Modal */}
      {activeModal === 'topup' && (
        <div className="glass-panel" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Isi Saldo RcsPay</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setActiveModal(null)} />
            </div>

            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pilih Nominal Quick Top Up:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '12px 0' }}>
              {['20000', '50000', '100000', '250000'].map((amt) => (
                <button
                  key={amt}
                  className={`btn ${topupAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setTopupAmount(amt)}
                >
                  Rp{parseInt(amt, 10).toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <input
              type="number"
              className="form-input"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="Atau ketik nominal custom..."
              style={{ marginBottom: '20px' }}
            />

            <button className="btn btn-primary" style={{ width: '100%', background: '#ee4d2d' }} onClick={handleTopupSubmit}>
              Konfirmasi Top Up
            </button>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {activeModal === 'transfer' && (
        <div className="glass-panel" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Kirim Uang / Transfer</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setActiveModal(null)} />
            </div>

            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No HP / Rekening Bank Tujuan:</label>
            <input
              type="text"
              className="form-input"
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              placeholder="Contoh: 081234567890 / Bank BCA 8890123"
              style={{ marginBottom: '12px' }}
            />

            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nominal Transfer (Rp):</label>
            <input
              type="number"
              className="form-input"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Masukkan nominal Rp..."
              style={{ marginBottom: '20px' }}
            />

            <button className="btn btn-primary" style={{ width: '100%', background: '#ee4d2d' }} onClick={handleTransferSubmit}>
              Kirim Uang Sekarang
            </button>
          </div>
        </div>
      )}

      {/* QRIS Scanner Modal */}
      {activeModal === 'qris' && (
        <div className="glass-panel" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <X size={28} color="white" style={{ cursor: 'pointer' }} onClick={() => setActiveModal(null)} />
          </div>

          <div style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Pindai Kode QRIS</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Arahkan kamera ke QRIS merchants RcsPay</p>
          </div>

          <div style={{
            width: '260px',
            height: '260px',
            border: '3px dashed #ee4d2d',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 0 30px rgba(238,77,45,0.5)',
            marginBottom: '24px'
          }}>
            <QrCode size={120} color="white" style={{ opacity: 0.8 }} />
          </div>

          <button
            className="btn btn-primary"
            style={{ background: '#ee4d2d', padding: '10px 30px' }}
            onClick={() => {
              alert('Simulasi QRIS Scan Merchant Toko: Pembayaran Rp 45.000 Berhasil!');
              setBalance(prev => prev - 45000);
              setActiveModal(null);
            }}
          >
            Simulasi Scan QRIS Valid
          </button>
        </div>
      )}
    </div>
  );
}
