import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, TrendingUp, Package, Star, BarChart2, DollarSign, Shield, Tag } from 'lucide-react';
import '../styles/AdBanner.css';

const SLIDES = [
  {
    id: 1,
    brand: 'RCSMART',
    line1: 'PREMIUM',
    line2: 'E-COMMERCE',
    line3: 'BUILDER',
    tagline: 'SUKSES JUALAN ONLINE!',
    bgFrom: '#0d1b6e',
    bgTo: '#1a3a8f',
    accentColor: '#f59e0b',
    accentText: '#fbbf24',
    line2Bg: 'linear-gradient(90deg, #e07b00, #f59e0b)',
  },
  {
    id: 2,
    brand: 'RCSMART',
    line1: 'FASHION &',
    line2: 'TECH STORE',
    line3: 'TERLENGKAP',
    tagline: 'RIBUAN BRAND PILIHAN!',
    bgFrom: '#0f1f4d',
    bgTo: '#1e0a4f',
    accentColor: '#c084fc',
    accentText: '#e879f9',
    line2Bg: 'linear-gradient(90deg, #7c3aed, #c084fc)',
  },
  {
    id: 3,
    brand: 'RCSMART',
    line1: 'GRATIS',
    line2: 'ONGKIR &',
    line3: 'CASHBACK',
    tagline: 'HEMAT LEBIH BANYAK!',
    bgFrom: '#0a2e1a',
    bgTo: '#064e3b',
    accentColor: '#10b981',
    accentText: '#34d399',
    line2Bg: 'linear-gradient(90deg, #047857, #10b981)',
  }
];

// 4 icons pinned to the left/right padding margins of the banner.
// x: 1-3% = inside the 28px left padding (never over left column content).
// x: 92-94% = inside the 32px right padding (never over right column text).
// y values avoid the controls strip at the bottom (~bottom 20%).
const FLOAT_ICONS = [
  { Icon: ShoppingCart, x: '1.5%', y: '28%', size: 20, color: '#fbbf24', delay: '0s' }, // ← sejajar TrendingUp
  { Icon: TrendingUp, x: '91%', y: '28%', size: 20, color: '#60a5fa', delay: '0.5s' }, // beside banner-line1
  { Icon: DollarSign, x: '1.5%', y: '52%', size: 20, color: '#34d399', delay: '1s' }, // ← sejajar BarChart2
  { Icon: BarChart2, x: '91%', y: '52%', size: 20, color: '#a78bfa', delay: '0.3s' }, // beside banner-line2
];


export default function AdBanner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
      setAnimKey(k => k + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => { setCurrent(idx); setAnimKey(k => k + 1); };
  const goPrev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => goTo((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className="adbanner-wrapper">
      {/* ── Main Hero Banner ── */}
      <div
        key={animKey}
        className="main-banner-card rcsmart-banner"
        style={{ background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)` }}
      >
        {/* Background glow orbs */}
        <div className="banner-orb banner-orb-1" style={{ background: slide.accentColor }} />
        <div className="banner-orb banner-orb-2" />
        <div className="banner-orb banner-orb-3" style={{ background: slide.accentColor }} />

        {/* Floating icons */}
        {FLOAT_ICONS.map(({ Icon, x, y, size, color, delay }, i) => (
          <div key={i} className="banner-float" style={{ left: x, top: y, animationDelay: delay }}>
            <div className="banner-float-box" style={{ borderColor: `${color}40`, background: `${color}18` }}>
              <Icon size={size} color={color} />
            </div>
          </div>
        ))}

        {/* ── LEFT COLUMN ── */}
        <div className="banner-left">
          {/* Phone mockup */}
          <div className="banner-phone">
            <div className="banner-phone-frame">
              <div className="banner-phone-screen">
                <div className="banner-phone-header">
                  <span className="banner-phone-rc">RC</span>
                  <span className="banner-phone-sm">SMART</span>
                  <ShoppingCart size={12} color="#1d4ed8" style={{ marginLeft: 'auto' }} />
                </div>
                <div className="banner-phone-prod-label">Products</div>
                <div className="banner-phone-grid">
                  {[['👗', 'Fashion', 'Rp28rb'], ['🎧', 'Tech', 'Rp56rb'], ['👟', 'Shoes', 'Rp99rb'], ['💻', 'Laptop', 'Rp2,5jt']].map(([em, name, price], i) => (
                    <div key={i} className="banner-phone-item">
                      <span className="banner-phone-em">{em}</span>
                      <span className="banner-phone-name">{name}</span>
                      <span className="banner-phone-price">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="banner-phone-glow" style={{ background: slide.accentColor }} />
          </div>

          {/* Laptop mockup */}
          <div className="banner-laptop">
            <div className="banner-laptop-screen">
              <div className="banner-laptop-bars">
                {[65, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="banner-laptop-bar"
                    style={{ height: `${h}%`, background: slide.accentColor, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
            <div className="banner-laptop-base" />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="banner-right">
          {/* Brand row */}
          <div className="banner-brand">
            <span className="banner-rc">RC</span>
            <span className="banner-smart">SMART</span>
            <span className="banner-pipe">|</span>
          </div>

          <h2 className="banner-line1">{slide.line1}</h2>

          <div className="banner-line2-wrap" style={{ background: slide.line2Bg }}>
            <span className="banner-line2">{slide.line2}</span>
          </div>

          <h2 className="banner-line3">{slide.line3}</h2>

          <div className="banner-cart-deco">
            <ShoppingCart size={24} color={slide.accentText} strokeWidth={2.5} />
          </div>

          <div className="banner-tagline">
            <Star size={13} color={slide.accentText} fill={slide.accentText} />
            <span style={{ color: slide.accentText }}>{slide.tagline}</span>
            <Star size={13} color={slide.accentText} fill={slide.accentText} />
          </div>

          <button className="banner-cta" style={{ background: slide.line2Bg }}>
            Mulai Belanja →
          </button>
        </div>

        {/* Controls */}
        <div className="banner-controls">
          <button className="banner-arrow" onClick={goPrev}><ChevronLeft size={17} /></button>
          <div className="banner-dots">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`banner-dot${i === current ? ' active' : ''}`} />
            ))}
          </div>
          <button className="banner-arrow" onClick={goNext}><ChevronRight size={17} /></button>
        </div>

        <span className="banner-sponsor">Iklan Sponsor</span>
      </div>

      {/* ── Side Sub-Banners ── */}
      <div className="side-stack-container">
        <div className="sub-banner-card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', boxShadow: '0 6px 24px rgba(29,78,216,0.35)' }}>
          <div className="sub-banner-inner">
            <div className="sub-banner-icon" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
              <Shield size={20} color="#fbbf24" />
            </div>
            <div>
              <div className="sub-banner-title">RCS Mall</div>
              <div className="sub-banner-desc" style={{ color: '#93c5fd' }}>100% ORI &amp; Garansi Resmi</div>
            </div>
          </div>
          <div className="sub-banner-btn" style={{ background: '#fbbf24', color: '#1e3a8a' }}>SHOP NOW →</div>
          <div className="sub-banner-orb" style={{ background: '#fbbf24' }} />
        </div>

        <div className="sub-banner-card" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', boxShadow: '0 6px 24px rgba(5,150,105,0.35)' }}>
          <div className="sub-banner-inner">
            <div className="sub-banner-icon" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <Tag size={20} color="#34d399" />
            </div>
            <div>
              <div className="sub-banner-title">RCS Berkah</div>
              <div className="sub-banner-desc" style={{ color: '#6ee7b7' }}>Voucher Food &amp; Fashion 100RB</div>
            </div>
          </div>
          <div className="sub-banner-btn" style={{ background: '#34d399', color: '#064e3b' }}>KLAIM →</div>
          <div className="sub-banner-orb" style={{ background: '#34d399' }} />
        </div>
      </div>
    </div>
  );
}
