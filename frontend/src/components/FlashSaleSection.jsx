import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { CartContext } from '../context/CartContext';
import { Zap, ShoppingBag } from 'lucide-react';
import '../styles/FlashSaleSection.css';

export default function FlashSaleSection({ products = [], onSelectProduct }) {
  const { t } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);

  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num) => String(num).padStart(2, '0');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const flashProducts = (products.length > 0 ? products : [
    { id: 1, name: "Hoodie Oversized Heavyweight Cotton", price: 450000, flashPrice: 189000, discount: 58, stockSold: 88 },
    { id: 2, name: "Kopi Kenangan Special Blend 500g", price: 120000, flashPrice: 49000, discount: 59, stockSold: 94 },
    { id: 3, name: "Glow Serum Niacinamide 10%", price: 250000, flashPrice: 89000, discount: 64, stockSold: 76 },
    { id: 4, name: "Wireless ANC Gaming Headphones", price: 1200000, flashPrice: 599000, discount: 50, stockSold: 71 }
  ]).slice(0, 4);

  return (
    <div className="flash-sale-wrapper">
      <div className="flash-sale-header">
        <div className="flash-title-box">
          <div className="flash-icon-box">
            <Zap size={22} color="#ffffff" />
          </div>
          <h3 className="flash-title-text">{t('flashSaleTitle')}</h3>
        </div>

        <div className="timer-box">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('endsIn')}</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="timer-digit">{formatTwoDigits(timeLeft.hours)}</span>
            <span className="timer-colon">:</span>
            <span className="timer-digit">{formatTwoDigits(timeLeft.minutes)}</span>
            <span className="timer-colon">:</span>
            <span className="timer-digit">{formatTwoDigits(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      <div className="flash-grid">
        {flashProducts.map((product, idx) => {
          const discountPercent = product.discount || 50;
          const flashPrice = product.flashPrice || Math.round(product.price * (1 - discountPercent / 100));
          const stockSoldPercent = product.stockSold || 80;

          return (
            <div
              key={product.id}
              className="flash-card-item glass-card"
              onClick={() => onSelectProduct && onSelectProduct(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flash-discount-tag">-{discountPercent}%</div>

              <div className="flash-img-thumb">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={28} color="var(--accent-red)" />
                  </div>
                )}
              </div>

              <div style={{ flexGrow: 1, marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.3, height: '2.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {product.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                    {formatPrice(flashPrice)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              <div>
                <div className="stock-progress-track">
                  <div className="stock-progress-fill" style={{ width: `${stockSoldPercent}%` }} />
                  <span className="stock-text-label">TERJUAL {stockSoldPercent}%</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id, 1);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-red) 0%, var(--accent-gold) 100%)' }}
                >
                  <ShoppingBag size={15} /> Beli Sekarang
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
