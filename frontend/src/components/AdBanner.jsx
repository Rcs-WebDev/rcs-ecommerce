import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ShieldCheck, Zap } from 'lucide-react';
import '../styles/AdBanner.css';

const BANNERS = [
  {
    id: 1,
    title: "RCSMART MEGA FASHION & TECH",
    subtitle: "Koleksi Brand Lokalnya Indonesia No. 1",
    tag: "+ RIBUAN BRAND FASHION, FOOD & TECH PILIHAN",
    bgColor: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
    badge: "100% Guaranteed",
    accentIcon: <Sparkles size={20} color="#fbbf24" />
  },
  {
    id: 2,
    title: "CULINARY & FOOD FESTIVAL",
    subtitle: "Diskon Makanan, Kopi & Snack s.d. 80%",
    tag: "Voucher Gratis Ongkir RP 0 Seluruh Indonesia",
    bgColor: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #2563eb 100%)",
    badge: "Food & Beverage",
    accentIcon: <Zap size={20} color="#f59e0b" />
  },
  {
    id: 3,
    title: "RCS MALL OFFICIAL BRAND DAY",
    subtitle: "Jaminan Original 100% dari Brand Stores",
    tag: "Voucher CashBack hingga Rp500.000",
    bgColor: "linear-gradient(135deg, #9333ea 0%, #c026d3 50%, #e11d48 100%)",
    badge: "Official Mall",
    accentIcon: <ShieldCheck size={20} color="#60a5fa" />
  }
];

export default function AdBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % BANNERS.length);

  return (
    <div className="ad-banner-grid">
      {/* Main Carousel Banner */}
      <div className="main-banner-card" style={{ background: BANNERS[currentSlide].bgColor }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="banner-top-badge">
            {BANNERS[currentSlide].accentIcon}
            <span>{BANNERS[currentSlide].badge}</span>
          </div>
          <span className="banner-sponsor-tag">Iklan Sponsor</span>
        </div>

        <div style={{ margin: '16px 0' }}>
          <h2 className="banner-title">{BANNERS[currentSlide].title}</h2>
          <p className="banner-subtitle">{BANNERS[currentSlide].subtitle}</p>
          <div className="banner-tag">{BANNERS[currentSlide].tag}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="banner-dot-btn"
                style={{
                  width: currentSlide === idx ? '24px' : '8px',
                  background: currentSlide === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={prevSlide} className="banner-nav-btn"><ChevronLeft size={20} /></button>
            <button onClick={nextSlide} className="banner-nav-btn"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* Side Stack Banners */}
      <div className="side-stack-container">
        <div className="sub-banner-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={20} color="#fff" />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>RCS Mall</span>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#fecaca', fontWeight: 600 }}>100% ORI & Garansi Resmi</span>
          <div className="sub-banner-btn" style={{ color: '#b91c1c' }}>SHOP NOW →</div>
        </div>

        <div className="sub-banner-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Tag size={20} color="#fff" />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>RCS Berkah</span>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#d1fae5', fontWeight: 600 }}>Voucher Food & Fashion 100RB</span>
          <div className="sub-banner-btn" style={{ color: '#047857' }}>KLAIM VOUCHER →</div>
        </div>
      </div>
    </div>
  );
}
