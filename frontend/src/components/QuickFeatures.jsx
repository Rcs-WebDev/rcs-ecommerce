import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Shield, Zap, ShoppingCart, Truck, Ticket } from 'lucide-react';
import '../styles/QuickFeatures.css';

export default function QuickFeatures({ onFeatureClick, openPromoModal }) {
  const { t } = useContext(LanguageContext);

  const features = [
    {
      id: 'rcs-mall',
      title: t('rcsMall'),
      sub: t('rcsMallSub'),
      icon: <Shield size={24} color="#f43f5e" />,
      badge: 'OFFICIAL',
      bgColor: 'rgba(244, 63, 94, 0.12)',
      borderColor: 'rgba(244, 63, 94, 0.3)'
    },
    {
      id: 'flash-sale',
      title: t('flashSale'),
      sub: t('flashSaleSub'),
      icon: <Zap size={24} color="#f59e0b" />,
      badge: 'HOT',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    {
      id: 'rcs-supermarket',
      title: t('rcsSupermarket'),
      sub: t('rcsSupermarketSub'),
      icon: <ShoppingCart size={24} color="#3b82f6" />,
      badge: 'EXPRESS',
      bgColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 'free-shipping',
      title: t('freeShipping'),
      sub: t('freeShippingSub'),
      icon: <Truck size={24} color="#10b981" />,
      badge: 'RP 0',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      isModal: true
    },
    {
      id: 'all-promo',
      title: t('allPromo'),
      sub: t('allPromoSub'),
      icon: <Ticket size={24} color="#a855f7" />,
      badge: 'NEW',
      bgColor: 'rgba(168, 85, 247, 0.12)',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      isModal: true
    }
  ];

  const handleClick = (feat) => {
    if (feat.isModal) {
      openPromoModal(feat.id);
    } else if (onFeatureClick) {
      onFeatureClick(feat.id);
    }
  };

  return (
    <div className="quick-features-container glass-panel">
      {features.map((feat) => (
        <div
          key={feat.id}
          onClick={() => handleClick(feat)}
          className="feature-item-card"
          style={{ background: feat.bgColor, border: `1px solid ${feat.borderColor}` }}
        >
          <div className="feature-icon-wrapper">
            {feat.icon}
          </div>

          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <span className="feature-title">{feat.title}</span>
            <span className="feature-sub">{feat.sub}</span>
          </div>

          {feat.badge && <span className="feature-badge-tag">{feat.badge}</span>}
        </div>
      ))}
    </div>
  );
}
