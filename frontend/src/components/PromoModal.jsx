import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { X, Truck, Ticket, CheckCircle2 } from 'lucide-react';
import '../styles/PromoModal.css';

export default function PromoModal({ isOpen, onClose, activeTab = 'free-shipping' }) {
  const { t } = useContext(LanguageContext);
  const [claimedMap, setClaimedMap] = useState({});
  const [copiedCode, setCopiedCode] = useState('');

  if (!isOpen) return null;

  const freeShippingVouchers = [
    { id: 'fs-1', code: 'ONGKIR0RP', title: t('freeShippingVoucher'), desc: 'Berlaku untuk semua Toko & Fashion/Food/Tech', validUntil: '2026-12-31' },
    { id: 'fs-2', code: 'SUPERONGKIR', title: 'Voucher Gratis Ongkir XTRA (S.D. Rp50.000)', desc: 'Khusus produk dengan badge RCS Mall & Express', validUntil: '2026-12-31' },
    { id: 'fs-3', code: 'FREESHIPBAROKAH', title: 'Voucher Gratis Ongkir Khusus RCS Berkah', desc: 'Minimal belanja Rp20.000', validUntil: '2026-12-31' }
  ];

  const allPromos = [
    { id: 'pr-1', code: 'RCSMART50', title: t('discountVoucher'), desc: 'Diskon 50% untuk Kategori Fashion & Tech', validUntil: '2026-12-31' },
    { id: 'pr-2', code: 'FOODFEST20', title: 'Voucher Diskon Makanan & Kuliner 20%', desc: 'Berlaku untuk semua merchant RCS Food', validUntil: '2026-12-31' },
    { id: 'pr-3', code: 'RCSMALL20', title: t('mallVoucher'), desc: 'Potongan harga khusus Official Store RCS Mall', validUntil: '2026-12-31' }
  ];

  const currentList = activeTab === 'free-shipping' ? freeShippingVouchers : allPromos;

  const handleClaim = (id, code) => {
    setClaimedMap(prev => ({ ...prev, [id]: true }));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-panel glass-panel">
        <button onClick={onClose} className="modal-close-btn">
          <X size={18} />
        </button>

        <div className="modal-header-info">
          <div className="modal-icon-badge" style={{
            background: activeTab === 'free-shipping'
              ? 'linear-gradient(135deg, var(--accent-green) 0%, #059669 100%)'
              : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
          }}>
            {activeTab === 'free-shipping' ? <Truck size={24} color="#ffffff" /> : <Ticket size={24} color="#ffffff" />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeTab === 'free-shipping' ? t('freeShipping') : t('allPromo')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Klaim voucher dan nikmati penawaran eksklusif hari ini!
            </p>
          </div>
        </div>

        {copiedCode && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--accent-green)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>Voucher <strong>{copiedCode}</strong> berhasil diklaim & disalin!</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
          {currentList.map((v) => {
            const isClaimed = claimedMap[v.id];
            return (
              <div key={v.id} className="voucher-card-item">
                <div style={{ flexGrow: 1 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span className="voucher-code-pill">{v.code}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>{v.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.desc}</p>
                </div>

                <button
                  onClick={() => handleClaim(v.id, v.code)}
                  className={isClaimed ? "btn btn-secondary" : "btn btn-primary"}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px', flexShrink: 0 }}
                >
                  {isClaimed ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-green)' }}>
                      <CheckCircle2 size={14} /> {t('claimed')}
                    </span>
                  ) : (
                    <span>{t('claim')}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
            {t('close')}
          </button>
        </div> */}
      </div>
    </div>
  );
}
