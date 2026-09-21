import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import {
  ShoppingBag, Laptop, Smartphone, Shirt, Watch, Sparkles, Utensils,
  Home, Car, HeartPulse, Glasses, Baby, Footprints, Package
} from 'lucide-react';
import '../styles/CategorySection.css';

export default function CategorySection({ activeCategory, onSelectCategory }) {
  const { t } = useContext(LanguageContext);

  const categories = [
    { id: 'all', name: 'Semua Kategori', icon: <ShoppingBag size={22} color="var(--primary)" /> },
    { id: 'electronics', name: 'Elektronik', icon: <Smartphone size={22} color="#38bdf8" /> },
    { id: 'computers', name: 'Laptop & PC', icon: <Laptop size={22} color="#818cf8" /> },
    { id: 'men-fashion', name: 'Pakaian Pria', icon: <Shirt size={22} color="#f472b6" /> },
    { id: 'women-fashion', name: 'Pakaian Wanita', icon: <Sparkles size={22} color="#fb7185" /> },
    { id: 'shoes', name: 'Sepatu', icon: <Footprints size={22} color="#fbbf24" /> },
    { id: 'bags', name: 'Tas & Aksesoris', icon: <Package size={22} color="#34d399" /> },
    { id: 'watches', name: 'Jam Tangan', icon: <Watch size={22} color="#c084fc" /> },
    { id: 'food', name: 'Makanan & Minuman', icon: <Utensils size={22} color="#f97316" /> },
    { id: 'beauty', name: 'Kecantikan & Care', icon: <Glasses size={22} color="#ec4899" /> },
    { id: 'home-living', name: 'Home & Living', icon: <Home size={22} color="#a3e635" /> },
    { id: 'health', name: 'Kesehatan', icon: <HeartPulse size={22} color="#ef4444" /> },
    { id: 'mom-baby', name: 'Ibu & Bayi', icon: <Baby size={22} color="#38bdf8" /> },
    { id: 'automotive', name: 'Otomotif', icon: <Car size={22} color="#64748b" /> }
  ];

  return (
    <div className="category-section-wrapper">
      <div className="category-header">
        <h3 className="category-title-text">
          <span className="category-title-bar" />
          {t('categoriesTitle')}
        </h3>
      </div>

      {/* Categories Grid (Category Cart) */}
      <div className="category-grid-container">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-card-item ${isSelected ? 'active' : ''}`}
            >
              <div className="category-icon-circle">
                {cat.icon}
              </div>
              <span className="category-card-label">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
