import React, { useState, useContext } from 'react';
import {
  ArrowLeft,
  MapPin,
  Search,
  ShoppingBag,
  Utensils,
  Coffee,
  Pizza,
  Flame,
  Star,
  Clock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import '../styles/RcsFood.css';

const RESTAURANTS = [
  {
    id: 'RESTO-1',
    name: 'Nasi Goreng Gila Express - Sudirman',
    rating: 4.8,
    distance: '1.2 km',
    time: '15-25 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300',
    promoTag: 'Diskon 50% s/d 25RB',
    menu: [
      { id: 'FM-1', name: 'Nasi Goreng Spesial Telur + Sosis', price: 22000 },
      { id: 'FM-2', name: 'Mie Goreng Gila Pedas Manis', price: 20000 }
    ]
  },
  {
    id: 'RESTO-2',
    name: 'Ayam Goreng Lengkuas Mba Lis',
    rating: 4.9,
    distance: '0.8 km',
    time: '10-20 min',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300',
    promoTag: 'Gratis Ongkir Rp0',
    menu: [
      { id: 'FM-3', name: 'Paket Ayam Kremes + Nasi + Es Teh', price: 25000 },
      { id: 'FM-4', name: 'Ayam Bakar Madu Sambal Hijau', price: 27000 }
    ]
  },
  {
    id: 'RESTO-3',
    name: 'Kopi Kenangan Mantan - Thamrin',
    rating: 4.8,
    distance: '1.5 km',
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300',
    promoTag: 'Beli 1 Gratis 1',
    menu: [
      { id: 'FM-5', name: 'Kopi Kenangan Mantan Large', price: 22000 },
      { id: 'FM-6', name: 'Avocado Coffee Jelly', price: 28000 }
    ]
  }
];

export default function RcsFood({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useContext(CartContext);

  const categories = [
    { name: 'Nasi Goreng', icon: <Utensils size={22} /> },
    { name: 'Ayam Goreng', icon: <Flame size={22} /> },
    { name: 'Minuman & Boba', icon: <Coffee size={22} /> },
    { name: 'Fast Food', icon: <Pizza size={22} /> },
    { name: 'Martabak', icon: <Utensils size={22} /> },
    { name: 'Kopi & Teh', icon: <Coffee size={22} /> },
    { name: 'Snack Lezat', icon: <Flame size={22} /> },
    { name: 'Diskon 50%', icon: <Star size={22} color="#f59e0b" /> }
  ];

  const handleAddFood = (resto, item) => {
    addToCart({
      id: item.id,
      title: `${item.name} (${resto.name})`,
      price: item.price,
      image: resto.image,
      store: resto.name,
      quantity: 1
    });
    alert(`"${item.name}" dari ${resto.name} telah ditambahkan ke Keranjang Makanan!`);
  };

  return (
    <div className="food-container animate-fade-in">
      {/* Top Header */}
      <div className="food-header">
        <div className="food-top-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('profile')}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <ArrowLeft size={22} />
            </button>
            <div className="food-location-box" onClick={() => alert('Ganti Alamat Pengiriman')}>
              <MapPin size={16} />
              <span>Dikirim ke: Jl. Sudirman No. 45, Jakarta Pusat</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <ShoppingBag size={22} style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('profile')} />
        </div>

        {/* Search Bar */}
        <div className="food-search-bar">
          <Search size={18} color="#f97316" />
          <input
            type="text"
            className="food-search-input"
            placeholder="Cari makanan, minuman, atau resto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Icons */}
      <div className="food-categories-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="food-cat-item" onClick={() => alert(`Kategori ${cat.name}`)}>
            <div className="food-cat-icon-box">{cat.icon}</div>
            <span className="food-cat-label">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Hero Promo Banner */}
      <div className="food-banner-card">
        <div>
          <div className="food-banner-title">Diskon Kuliner 50% + Rp0 Ongkir!</div>
          <div className="food-banner-sub">Pesan makanan favoritmu dari resto terdekat sekarang</div>
        </div>
        <button
          className="btn"
          style={{ background: 'white', color: '#ff416c', fontWeight: 800, fontSize: '0.8rem', borderRadius: '20px' }}
          onClick={() => alert('Klaim Voucher Diskon 50% RcsFood!')}
        >
          Klaim Voucher
        </button>
      </div>

      {/* Restaurant List */}
      <div className="resto-list-section">
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Resto Terdekat Untukmu</h3>

        {RESTAURANTS.map((resto) => (
          <div key={resto.id} className="resto-card">
            <div className="resto-main-row">
              <img src={resto.image} alt={resto.name} className="resto-img" />
              <div className="resto-info">
                <span className="resto-name">{resto.name}</span>
                <div className="resto-meta-row">
                  <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Star size={14} fill="#f59e0b" /> {resto.rating}
                  </span>
                  <span>•</span>
                  <span>{resto.distance}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={14} /> {resto.time}
                  </span>
                </div>
                <span className="resto-badge-promo">{resto.promoTag}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {resto.menu.map((menuItem) => (
                <div key={menuItem.id} className="food-item-row">
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{menuItem.name}</strong>
                    <div style={{ color: '#f97316', fontWeight: 700, fontSize: '0.82rem' }}>
                      Rp{menuItem.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <button className="btn-add-food" onClick={() => handleAddFood(resto, menuItem)}>
                    <Plus size={14} /> Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
