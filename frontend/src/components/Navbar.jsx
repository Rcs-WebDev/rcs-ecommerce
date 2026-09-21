import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { ShoppingBag, LogOut, User, ShoppingCart, Search, Bell, Globe, Sun, Moon, CheckCircle, Package, Tag, X, Camera, MessageSquare } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({ currentPage, setCurrentPage, searchQuery = '', setSearchQuery, onOpenChat }) {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);
  const { lang, toggleLanguage, t } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  const [unreadCount, setUnreadCount] = useState(3);

  const mockNotifications = [
    {
      id: 1,
      title: 'Flash Sale Dimulai! ⚡',
      desc: 'Diskon Komponen & Fashion s.d 70% aktif sekarang!',
      time: '5 mnt yang lalu',
      icon: <Tag size={16} color="var(--accent-red)" />
    },
    {
      id: 2,
      title: 'Voucher Gratis Ongkir RP 0 🚚',
      desc: 'Voucher pengiriman instan Anda siap digunakan.',
      time: '1 jam yang lalu',
      icon: <Package size={16} color="var(--accent-green)" />
    },
    {
      id: 3,
      title: 'Selamat Datang di RCSMART 🛒',
      desc: 'Terima kasih telah bergabung. Dapatkan Cashback 100% koin pertama.',
      time: '1 hari yang lalu',
      icon: <CheckCircle size={16} color="var(--primary)" />
    }
  ];

  return (
    <header className="navbar-header">
      {/* Top Header Bar - Desktop Only */}
      <div className="topbar">
        <div className="topbar-left">
          <span>Download App RCSMART</span>
          <span className="topbar-divider">|</span>
          <span>Ikuti kami di Social Media</span>
        </div>

        <div className="topbar-right">
          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Ganti Tema">
            {theme === 'dark' ? (
              <>
                <Sun size={14} color="#f59e0b" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} color="#7c3aed" />
                <span>Dark</span>
              </>
            )}
          </button>

          <span className="topbar-divider">|</span>

          {/* Notifications Trigger */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setUnreadCount(0);
              }}
              className="topbar-btn"
            >
              <div style={{ position: 'relative' }}>
                <Bell size={14} color="var(--secondary)" />
                {unreadCount > 0 && <span className="notif-badge-dot" />}
              </div>
              <span>{t('notifications')}</span>
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotifOpen && (
              <div className="notif-dropdown glass-panel animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Notifikasi Terbaru</h4>
                  <button onClick={() => setIsNotifOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className="notif-item">
                      <div style={{ marginTop: '2px' }}>{notif.icon}</div>
                      <div>
                        <h5 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{notif.title}</h5>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{notif.desc}</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="topbar-divider">|</span>

          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} color="var(--primary)" />
            <select
              value={lang}
              onChange={(e) => toggleLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="id">Bahasa Indonesia (ID)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <nav className="navbar-main glass-panel">
        {/* Brand Logo - Hidden on mobile view */}
        <div onClick={() => setCurrentPage('home')} className="navbar-brand" id="navbar-logo">
          {/* Logo badge — cart icon in blue box */}
          <div className="navbar-logo-badge">
            <ShoppingCart size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          {/* Brand text */}
          <span className="navbar-logo-rc">RC</span>
          <span className="navbar-logo-smart">SMART</span>
        </div>

        {/* Central Search Bar */}
        <div className="navbar-search-container">
          <div className="navbar-search-box">
            <Search size={18} color="var(--text-muted)" className="navbar-search-icon-left" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="form-input navbar-search-input"
            />
            {/* Camera Icon in Search Bar */}
            <button
              type="button"
              onClick={() => alert('Fitur Pencarian Gambar (Image Search) RCSMART AI Siap digunakankan!')}
              className="navbar-search-camera-btn"
              title="Cari Berdasarkan Gambar"
            >
              <Camera size={18} color="var(--text-muted)" />
            </button>
            <button onClick={() => setCurrentPage('home')} className="btn btn-primary navbar-search-btn">
              Cari
            </button>
          </div>

          {/* Trending Search Tags - Hidden on mobile */}
          <div className="search-tags">
            <span className="search-tag-item" onClick={() => setSearchQuery && setSearchQuery('Oversized')}>Oversized Hoodie</span>
            <span className="search-tag-item" onClick={() => setSearchQuery && setSearchQuery('Kopi')}>Kopi Blend</span>
            <span className="search-tag-item" onClick={() => setSearchQuery && setSearchQuery('RTX 4080')}>RTX 4080</span>
            <span className="search-tag-item" onClick={() => setSearchQuery && setSearchQuery('Skincare')}>Skincare Serum</span>
            <span className="search-tag-item" onClick={() => setSearchQuery && setSearchQuery('Helm')}>Helm Modular</span>
          </div>
        </div>

        {/* Action Group: Desktop User Auth + Cart + Chat (Mobile: Cart + Chat) */}
        <div className="navbar-actions-group">
          {/* User Profile Badge - Hidden on mobile */}
          <div className="desktop-user-wrapper">
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div onClick={() => setCurrentPage('profile')} className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                    <User size={16} color="var(--secondary)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      {user.name}
                    </span>
                  </div>
                </div>

              </>

            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setCurrentPage('login')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  {t('login')}
                </button>
                <button onClick={() => setCurrentPage('register')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  {t('register')}
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon Trigger */}
          <button onClick={() => setCurrentPage('cart')} className="cart-trigger-btn" title="Keranjang Belanja">
            <ShoppingBag size={20} color="var(--text-main)" />
            {getCartCount() > 0 && <span className="cart-badge-count">{getCartCount()}</span>}
          </button>

          {/* Chat Icon Trigger */}
          <button onClick={onOpenChat} className="chat-nav-trigger-btn" title="Chat CS Center">
            <MessageSquare size={20} color="var(--text-main)" />
            <span className="chat-nav-badge-dot">1</span>
          </button>

          <button
            onClick={() => {
              logout();
              setCurrentPage('home');
            }}
            className="btn btn-secondary"
            style={{ padding: '8px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            title="Logout"
          >
            <LogOut size={16} color="var(--accent-red)" />
          </button>
        </div>
      </nav>
    </header >
  );
}
