import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  QrCode,
  ShieldCheck,
  ChevronRight,
  FileText,
  History,
  Percent,
  Gift,
  Users,
  Smartphone,
  Gauge,
  Car,
  Coins,
  CheckCircle2,
  X
} from 'lucide-react';
import '../styles/RPayLater.css';

export default function RPayLater({ setCurrentPage }) {
  const [showBillModal, setShowBillModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [claimedMissions, setClaimedMissions] = useState([]);

  const missions = [
    { id: 1, title: 'Gunakan RPayLater 1x Belanja Minimal 50rb', reward: 'Voucher Diskon 15%' },
    { id: 2, title: 'Bayar Tagihan Tepat Waktu Bulan Ini', reward: 'Cashback 20.000 Koin' },
    { id: 3, title: 'Aktifkan Fitur Autodebet RPayLater', reward: 'Limit Xtra Rp1.000.000' }
  ];

  const handleClaimMission = (mId) => {
    setClaimedMissions([...claimedMissions, mId]);
    alert('Misi Berhasil Diklaim! Hadiah telah ditambahkan ke akun Anda.');
  };

  return (
    <div className="later-container animate-fade-in">
      {/* Header */}
      <div className="later-header">
        <div className="later-header-left">
          <button
            onClick={() => setCurrentPage('profile')}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <ArrowLeft size={22} />
          </button>
          <div className="later-title-box">
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>RPayLater</span>
            <span className="badge-classic">Classic &gt;</span>
          </div>
        </div>

        <button
          onClick={() => alert('Pengaturan Limit & Keamanan RPayLater')}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Hero Credit Card Section */}
      <div className="later-hero-section">
        <div className="credit-hero-card">
          <div className="credit-hero-top">
            <div>
              <div className="credit-label">Kredit Tersedia</div>
              <div className="credit-amount">Rp 12.000.000</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, cursor: 'pointer' }}>
                Jumlah Kredit 12.000.000 &gt;
              </div>
            </div>
            <button className="scan-qr-btn" onClick={() => alert('Scan QR Code untuk bayar dengan RPayLater')}>
              <QrCode size={16} />
              <span>Scan</span>
            </button>
          </div>

          <div className="limit-xtra-box" onClick={() => alert('Ajukan Limit Xtra RPayLater hingga 62 Juta!')}>
            <span>RPayLater Limit Xtra</span>
            <span>Hingga 62JT &gt;</span>
          </div>
        </div>
      </div>

      {/* Bill Status Card matching Image 4 */}
      <div className="later-bill-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 700 }}>
            <ShieldCheck size={16} />
            <span>Langganan Proteksi &gt;</span>
          </div>
        </div>

        <div>
          <div className="bill-status-text">Kamu telah membayar semua tagihan.</div>
          <div className="bill-amount-zero">Rp0</div>
          <div className="bill-due-date">
            <span>ⓘ Jatuh tempo tanggal 25 setiap bulannya</span>
          </div>
        </div>

        <div className="bill-actions-grid">
          <button className="btn-bill-action" onClick={() => setShowBillModal(true)}>
            <FileText size={18} color="#ee4d2d" />
            <span>Tagihan Saya &gt;</span>
          </button>
          <button className="btn-bill-action" onClick={() => alert('Riwayat Transaksi RPayLater')}>
            <History size={18} color="#ee4d2d" />
            <span>Transaksi &gt;</span>
          </button>
        </div>
      </div>

      {/* Features Icon Grid matching Image 4 */}
      <div className="later-grid-icons">
        <div className="later-icon-item" onClick={() => alert('Promo Cicilan 0% RPayLater')}>
          <div className="later-icon-box">
            <Percent size={22} />
          </div>
          <span className="later-icon-label">Cicilan Pasti 0%</span>
        </div>

        <div className="later-icon-item" onClick={() => alert('Promo QRIS RPayLater')}>
          <div className="later-icon-box">
            <QrCode size={22} color="#ee4d2d" />
          </div>
          <span className="later-icon-label">Promo QRIS</span>
        </div>

        <div className="later-icon-item" onClick={() => alert('Hubungkan RPayLater ke e-commerce lain')}>
          <div className="later-icon-box">
            <ShieldCheck size={22} color="#3b82f6" />
          </div>
          <span className="later-icon-label">Hubungkan RPayLater</span>
        </div>

        <div className="later-icon-item" onClick={() => setShowMissionModal(true)}>
          <div className="later-icon-box">
            <Gift size={22} color="#f59e0b" />
          </div>
          <span className="later-icon-label">Misi & Hadiah</span>
        </div>

        <div className="later-icon-item" onClick={() => alert('Undang teman dan dapatkan bonus 40rb')}>
          <div className="later-icon-box">
            <Users size={22} color="#ec4899" />
          </div>
          <span className="later-icon-label">Undang teman dapat 40rb</span>
        </div>

        <div className="later-icon-item" onClick={() => setCurrentPage('pulsa-tagihan')}>
          <div className="later-icon-box">
            <Smartphone size={22} color="#10b981" />
          </div>
          <span className="later-icon-label">Pulsa, Tagihan & Tiket</span>
        </div>

        <div className="later-icon-item" onClick={() => alert('Cek Skor Kredit Shopee Meter')}>
          <div className="later-icon-box">
            <Gauge size={22} color="#8b5cf6" />
          </div>
          <span className="later-icon-label">Shopee Meter</span>
        </div>

        <div className="later-icon-item" onClick={() => alert('Pinjaman Gadai BPKB')}>
          <div className="later-icon-box">
            <Car size={22} color="#f97316" />
          </div>
          <span className="later-icon-label">SJaminan BPKB</span>
        </div>
      </div>

      {/* SPinjam Promotion Card matching Image 4 */}
      <div className="later-spinjam-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(238, 77, 45, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Coins size={22} color="#ee4d2d" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>SPinjam</span>
              <span className="spinjam-tag">s/d 24 bulan</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bunga pinjaman pertama 0,06%
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ background: '#ee4d2d', padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
          onClick={() => alert('Form Pengajuan SPinjam Tunai')}
        >
          Aktivasi Sekarang
        </button>
      </div>

      {/* Mission RPayLater Banner */}
      <div className="later-mission-banner" onClick={() => setShowMissionModal(true)}>
        <div>
          <div className="mission-title">Misi RPayLater</div>
          <div className="mission-sub">Dapatkan banyak keuntungan dengan menyelesaikan Misi RPayLater</div>
        </div>
        <ChevronRight size={24} />
      </div>

      {/* Bill Details Modal */}
      {showBillModal && (
        <div className="glass-panel" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', maxWidth: '450px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Rincian Tagihan RPayLater</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowBillModal(false)} />
            </div>

            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tagihan Jatuh Tempo (25 Aug 2026):</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', margin: '4px 0' }}>Rp 0 (Lunas)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Semua tagihan bulan ini sudah dibayar penuh.</div>
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Estimasi Tagihan Bulan Depan:</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Belum ada transaksi cicilan aktif.
            </div>

            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowBillModal(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Missions Modal */}
      {showMissionModal && (
        <div className="glass-panel" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '24px', maxWidth: '450px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Misi & Hadiah RPayLater</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowMissionModal(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {missions.map((m) => {
                const isClaimed = claimedMissions.includes(m.id);
                return (
                  <div key={m.id} style={{
                    background: 'var(--input-bg)', padding: '12px', borderRadius: '12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{m.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#ee4d2d', fontWeight: 600 }}>{m.reward}</div>
                    </div>
                    {isClaimed ? (
                      <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Selesai
                      </span>
                    ) : (
                      <button className="btn btn-primary" style={{ background: '#ee4d2d', padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleClaimMission(m.id)}>
                        Klaim
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowMissionModal(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
