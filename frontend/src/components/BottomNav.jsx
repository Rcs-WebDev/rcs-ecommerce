import React from 'react';
import { Home, Tag, Video, Bell, User } from 'lucide-react';
import '../styles/BottomNav.css';

export default function BottomNav({ currentPage, setCurrentPage, openPromoModal }) {
  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'deals') {
      if (openPromoModal) {
        openPromoModal('all-promo');
      }
    } else if (tabId === 'live-video') {
      setCurrentPage('live-video');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'notifications') {
      setCurrentPage('notifications');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'profile') {
      setCurrentPage('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bottom-nav-container">
      <div
        className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home')}
      >
        <Home size={22} />
        <span>Beranda</span>
      </div>

      <div
        className="bottom-nav-item"
        onClick={() => handleTabClick('deals')}
      >
        <Tag size={22} />
        <span>Deals</span>
      </div>

      <div
        className={`bottom-nav-item ${currentPage === 'live-video' ? 'active' : ''}`}
        onClick={() => handleTabClick('live-video')}
      >
        <Video size={22} />
        <span>Live & Video</span>
      </div>

      <div
        className={`bottom-nav-item ${currentPage === 'notifications' ? 'active' : ''}`}
        onClick={() => handleTabClick('notifications')}
      >
        <div style={{ position: 'relative' }}>
          <Bell size={22} />
          <span className="bottom-nav-notif-badge">5</span>
        </div>
        <span>Notifikasi</span>
      </div>

      <div
        className={`bottom-nav-item ${currentPage === 'profile' ? 'active' : ''}`}
        onClick={() => handleTabClick('profile')}
      >
        <User size={22} />
        <span>Saya</span>
      </div>
    </div>
  );
}
