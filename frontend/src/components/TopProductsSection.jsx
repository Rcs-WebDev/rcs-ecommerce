import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { CartContext } from '../context/CartContext';
import { Award, Star, ShoppingBag, Flame } from 'lucide-react';
import '../styles/TopProductsSection.css';

export default function TopProductsSection({ products = [], onSelectProduct }) {
  const { t } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const rankBadges = [
    { rank: '#1', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', label: 'TOP SELLER' },
    { rank: '#2', bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', label: 'MOST POPULAR' },
    { rank: '#3', bg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)', label: 'HOT ITEM' },
    { rank: '#4', bg: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', label: 'BEST VALUE' }
  ];

  const topList = (products.length > 0 ? products : [
    { id: 101, name: "Jaket Leather Classic Biker Edition", price: 850000, soldCount: "3.1k+", rating: 4.9 },
    { id: 102, name: "NVIDIA RTX 4080 Super Gaming OC", price: 18500000, soldCount: "2.4k+", rating: 4.9 },
    { id: 103, name: "Dark Artisan Gourmet Chocolate Box", price: 175000, soldCount: "1.9k+", rating: 4.8 },
    { id: 104, name: "Smart Air Purifier HEPA H13 Filter", price: 1450000, soldCount: "1.5k+", rating: 4.9 }
  ]).slice(0, 4);

  return (
    <div className="top-products-wrapper">
      <div className="top-products-header">
        <h3 className="top-products-title">
          <Award size={22} color="var(--accent-gold)" />
          {t('topProductsTitle')}
        </h3>

        <div className="realtime-pill">
          <Flame size={16} /> Update Real-Time
        </div>
      </div>

      <div className="top-products-grid">
        {topList.map((item, index) => {
          const rankInfo = rankBadges[index] || rankBadges[3];
          const soldCount = item.soldCount || "1.2k+";
          const rating = item.rating || "4.8";

          return (
            <div
              key={item.id}
              className="top-card-item glass-card"
              onClick={() => onSelectProduct && onSelectProduct(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="rank-badge-flag" style={{ background: rankInfo.bg }}>
                <span>{rankInfo.rank}</span>
              </div>

              <div className="top-rank-label">{rankInfo.label}</div>

              <div className="top-img-thumb">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Award size={42} color="var(--accent-gold)" style={{ opacity: 0.8 }} />
                )}
              </div>

              <div style={{ flexGrow: 1, marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.3, height: '2.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{rating}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{soldCount} {t('sold')}</span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatPrice(item.price)}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item.id, 1);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                <ShoppingBag size={15} /> + Tambah Ke Keranjang
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
