import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import AdBanner from '../components/AdBanner';
import QuickFeatures from '../components/QuickFeatures';
import CategorySection from '../components/CategorySection';
import FlashSaleSection from '../components/FlashSaleSection';
import TopProductsSection from '../components/TopProductsSection';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Loader2, ShoppingBag } from 'lucide-react';
import '../styles/Home.css';

// Extended Catalog Items (Tech, Fashion, Food, Beauty, Home, Health, Mom-Baby, Automotive)
const EXTENDED_PRODUCTS = [
  // --- TECH & ELECTRONICS ---
  { id: 1, name: "NVIDIA RTX 4080 Super Gaming OC 16GB", price: 18500000, description: "VGA Komponen PC Ultra High Performance untuk gaming & rendering 4K ray tracing.", category: "computers", image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500" },
  { id: 2, name: "Mechanical Custom Keyboard RGB Hot-Swap", price: 1250000, description: "Keyboard mechanical tactile switch dengan backlight RGB dinamis.", category: "computers", image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500" },
  { id: 3, name: "Curved Ultrawide Gaming Monitor 34\" 144Hz", price: 7800000, description: "Monitor lengkung QD-OLED resolusi WQHD 1ms response time.", category: "computers", image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" },
  { id: 4, name: "SEENDA MOE300 Mouse Ergonomic Vertical Wireless Dual Mode", price: 277920, description: "Mouse ergonomis vertikal nirkabel anti pegal tangan dengan dual mode bluetooth & 2.4G.", category: "electronics", image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500" },
  { id: 5, name: "Wireless ANC Gaming Headphones 7.1", price: 1950000, description: "Headset nirkabel dengan Active Noise Cancelling & mikrofon jernih.", category: "electronics", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 6, name: "Smart TV 43 Inch 4K UHD HDR Android TV", price: 3850000, description: "TV pintar layar 4K UHD dengan sistem Android, Dolby Audio & Wi-Fi.", category: "electronics", image_url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500" },
  { id: 7, name: "Powerbank Fast Charging 20000mAh Dual Output", price: 299000, description: "Pengisi daya portabel kapasitas jumbo 20.000mAh dengan pengisian cepat Type-C.", category: "electronics", image_url: "https://images.unsplash.com/photo-1609592424074-124b823e593e?w=500" },
  { id: 8, name: "Laptop Gaming ROG Strix Intel Core i7 Gen 13", price: 18990000, description: "Laptop performa monster dengan prosesor Intel i7, RTX 4060 & layar 165Hz.", category: "computers", image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500" },

  // --- FASHION PRIA & WANITA ---
  { id: 9, name: "Heavyweight Cotton Oversized Hoodie - Black Edition", price: 450000, description: "Hoodie pria & wanita bahan fleece premium 330gsm ultra nyaman.", category: "men-fashion", image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" },
  { id: 10, name: "Vintage Biker Leather Jacket Original", price: 850000, description: "Jaket kulit sintetis premium gaya retro street fashion.", category: "men-fashion", image_url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500" },
  { id: 11, name: "Kemeja Flanel Casual Cotton Premium", price: 285000, description: "Kemeja motif flanel kasual bahan 100% katun lembut & tidak panas.", category: "men-fashion", image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500" },
  { id: 12, name: "Korean Elegance Blazer Jacket Suede - Cream", price: 520000, description: "Blazer wanita gaya Korea modern cocok untuk casual & formal.", category: "women-fashion", image_url: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500" },
  { id: 13, name: "Dress Casual Floral Satin Premium", price: 395000, description: "Gaun wanita motif bunga elegan bahan satin halus untuk pesta & hangout.", category: "women-fashion", image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500" },
  { id: 14, name: "Cardigan Rajut Oversize Style Korea", price: 245000, description: "Sweater cardigan rajut tebal wanita gaya ala drama Korea.", category: "women-fashion", image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500" },

  // --- SEPATU & TAS ---
  { id: 15, name: "Retro Low Streetwear Sneakers Unisex", price: 680000, description: "Sepatu kets kasual bahan kulit asli dengan insole empuk ergonomis.", category: "shoes", image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500" },
  { id: 16, name: "Sepatu Lari UltraBoost Cushioning Running", price: 1150000, description: "Sepatu olahraga lari ultra ringan dengan sol busa peredam benturan.", category: "shoes", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 17, name: "Sepatu Formal Leather Oxford Shoes", price: 790000, description: "Sepatu kerja pria bahan kulit asli berkualitas untuk acara formal.", category: "shoes", image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500" },
  { id: 18, name: "Luxury Designer Leather Crossbody Handbag", price: 1150000, description: "Tas selempang wanita bahan kulit berkualitas dengan kompartemen luas.", category: "bags", image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
  { id: 19, name: "Ransel Anti Air Laptop 15.6 Inch USB Port", price: 349000, description: "Tas punggung ransel kerja & kuliah bahan waterproof dilengkapi slot charger USB.", category: "bags", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { id: 20, name: "Dompet Kulit Asli Pria Slim RFID Blocking", price: 199000, description: "Dompet saku pria lipat bahan kulit sapi asli dengan pengaman kartu RFID.", category: "bags", image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500" },

  // --- JAM TANGAN ---
  { id: 21, name: "Automatic Chronograph Stainless Steel Watch", price: 1450000, description: "Jam tangan pria waterproof 50m dengan kristal sapphire tahan gores.", category: "watches", image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500" },
  { id: 22, name: "Smartwatch AMOLED Heart Rate & SpO2 Tracker", price: 899000, description: "Jam tangan pintar layar AMOLED dengan pemantau detak jantung & 100+ mode olahraga.", category: "watches", image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500" },
  { id: 23, name: "Jam Tangan Minimalis Leather Strap Unisex", price: 420000, description: "Jam tangan kasual tali kulit asli gaya simpel & elegan.", category: "watches", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500" },

  // --- FOOD & BEVERAGES ---
  { id: 24, name: "Kopi Kenangan Special Arabica Blend 500g", price: 120000, description: "Biji kopi sangrai khas Nusantara aromatis dengan rasa bold caramel.", category: "food", image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500" },
  { id: 25, name: "Ceremonial Uji Matcha Powder Organic 100g", price: 185000, description: "Bubuk hijau matcha murni impor Jepang mutu terbaik tanpa gula.", category: "food", image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500" },
  { id: 26, name: "Dark Artisan Gourmet Chocolate Gift Box", price: 175000, description: "Kotak cokelat hitam olahan kakao lokal dengan isian kacang almond.", category: "food", image_url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500" },
  { id: 27, name: "Keripik Pedas Level 10 Nusantara Pack", price: 45000, description: "Camilan gurih renyah kripik singkong dengan bumbu cabai asli resep tradisional.", category: "food", image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500" },

  // --- BEAUTY & CARE ---
  { id: 28, name: "Hydrating Glow Serum Niacinamide 10%", price: 195000, description: "Serum perawatan wajah melembabkan & mencerahkan kulit kusam.", category: "beauty", image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500" },
  { id: 29, name: "Signature Eau De Parfum Intense 50ml", price: 380000, description: "Parfum beraroma woody & amber segar dengan daya tahan hingga 12 jam.", category: "beauty", image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500" },
  { id: 30, name: "Sunscreen Watery Gel SPF 50 PA++++", price: 125000, description: "Tabir surya tekstur gel ringan bebas minyak pelindung UVA/UVB.", category: "beauty", image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500" },

  // --- HOME & LIVING ---
  { id: 31, name: "Smart Air Purifier HEPA H13 Filter", price: 1450000, description: "Pembersih udara pintar dengan sensor PM2.5 & kendali aplikasi HP.", category: "home-living", image_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500" },
  { id: 32, name: "Ultrasonic Essential Oil Aroma Diffuser 500ml", price: 299000, description: "Pelembab udara aroma terapi dengan lampu LED 7 warna pilihan.", category: "home-living", image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500" },
  { id: 33, name: "Lampu Meja Smart LED Dimming RGB", price: 215000, description: "Lampu baca meja belajar dengan pengaturan kecerahan & warna cahaya fleksibel.", category: "home-living", image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500" },

  // --- KESEHATAN ---
  { id: 34, name: "Vitamin C 1000mg + Zinc Multi-Guard 60 Tablet", price: 165000, description: "Suplemen daya tahan tubuh menjaga daya imunitas harian keluarga.", category: "health", image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" },
  { id: 35, name: "Termometer Digital Infrared Non-Contact", price: 245000, description: "Alat pengukur suhu tubuh instan tanpa sentuh akurasi tinggi.", category: "health", image_url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500" },
  { id: 36, name: "Masker Medis 3-Ply Earloop Surgical Grade (50 pcs)", price: 45000, description: "Masker pelindung mulut & hidung 3 lapis standar rumah sakit.", category: "health", image_url: "https://images.unsplash.com/photo-1586942593568-29364ef88e16?w=500" },
  { id: 37, name: "Tensimeter Digital Omron Blood Pressure Monitor", price: 580000, description: "Alat pemantau tekanan darah otomatis dengan layar LCD digital ramah lansia.", category: "health", image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500" },

  // --- IBU & BAYI ---
  { id: 38, name: "Stroller Bayi Lipat Cabin Size Premium", price: 1850000, description: "Kereta dorong bayi praktis dapat dilipat kecil muat di kabin pesawat.", category: "mom-baby", image_url: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=500" },
  { id: 39, name: "Botol Susu Anti-Kolik BPA Free 250ml", price: 135000, description: "Botol susu bayi berbahan aman bebas BPA dengan sistem ventilasi udara.", category: "mom-baby", image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500" },
  { id: 40, name: "Popok Bayi Soft Pants Extra Dry L44", price: 115000, description: "Popok celana bayi elastis & daya serap tinggi pencegah ruam.", category: "mom-baby", image_url: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500" },
  { id: 41, name: "Sterilizer Botol Susu & Penghangat Makanan", price: 420000, description: "Mesin pembersih kuman uap panas cepat untuk perlengkapan bayi.", category: "mom-baby", image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" },

  // --- OTOMOTIF ---
  { id: 42, name: "Full Face Helmet Carbon Fiber Modular", price: 2100000, description: "Helm motor full face pelindung kepala serat karbon standar SNI & DOT.", category: "automotive", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500" },
  { id: 43, name: "Dashcam Mobil Dual Lens Front & Rear 4K", price: 1250000, description: "Kamera perekam perjalanan mobil depan & belakang dengan night vision.", category: "automotive", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500" },
  { id: 44, name: "Kain Lap Microfiber Super Absorbent Set 5pcs", price: 75000, description: "Kain pembersih bodi & kaca mobil halus tanpa menggores.", category: "automotive", image_url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500" },
  { id: 45, name: "Pompa Ban Portable Digital Cordless Air Compressor", price: 385000, description: "Pompa elektrik mini bertenaga baterai presisi otomatis.", category: "automotive", image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500" }
];

const CATEGORY_NAMES = {
  'all': 'Semua Kategori',
  'electronics': 'Elektronik',
  'computers': 'Laptop & PC',
  'men-fashion': 'Pakaian Pria',
  'women-fashion': 'Pakaian Wanita',
  'shoes': 'Sepatu',
  'bags': 'Tas & Aksesoris',
  'watches': 'Jam Tangan',
  'food': 'Makanan & Minuman',
  'beauty': 'Kecantikan & Care',
  'home-living': 'Home & Living',
  'health': 'Kesehatan',
  'mom-baby': 'Ibu & Bayi',
  'automotive': 'Otomotif'
};

export default function Home({ searchQuery = '', openPromoModal, onSelectProduct }) {
  const { API_URL } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(p => {
        const cat = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const name = (p.name || '').toLowerCase();

        if (activeCategory === 'electronics') {
          return cat === 'electronics' || cat.includes('electronic') || name.includes('mouse') || name.includes('headphone') || name.includes('tv') || name.includes('powerbank') || name.includes('audio') || name.includes('seenda');
        }
        if (activeCategory === 'computers') {
          return cat === 'computers' || cat.includes('computer') || name.includes('laptop') || name.includes('pc') || name.includes('rtx') || name.includes('keyboard') || name.includes('monitor');
        }
        if (activeCategory === 'men-fashion') {
          return cat === 'men-fashion' || cat.includes('men') || name.includes('hoodie') || name.includes('jaket') || name.includes('pria') || name.includes('flanel');
        }
        if (activeCategory === 'women-fashion') {
          return cat === 'women-fashion' || cat.includes('women') || name.includes('blazer') || name.includes('wanita') || name.includes('dress') || name.includes('cardigan');
        }
        if (activeCategory === 'shoes') {
          return cat === 'shoes' || name.includes('sepatu') || name.includes('sneakers') || name.includes('oxford') || name.includes('ultraboost');
        }
        if (activeCategory === 'bags') {
          return cat === 'bags' || name.includes('tas') || name.includes('handbag') || name.includes('ransel') || name.includes('dompet');
        }
        if (activeCategory === 'watches') {
          return cat === 'watches' || name.includes('jam') || name.includes('watch') || name.includes('smartwatch');
        }
        if (activeCategory === 'food') {
          return cat === 'food' || name.includes('kopi') || name.includes('chocolate') || name.includes('matcha') || name.includes('keripik');
        }
        if (activeCategory === 'beauty') {
          return cat === 'beauty' || name.includes('serum') || name.includes('parfum') || name.includes('sunscreen');
        }
        if (activeCategory === 'home-living') {
          return cat === 'home-living' || cat.includes('home') || name.includes('purifier') || name.includes('diffuser') || name.includes('lampu');
        }
        if (activeCategory === 'health') {
          return cat === 'health' || name.includes('vitamin') || name.includes('termometer') || name.includes('masker') || name.includes('tensimeter');
        }
        if (activeCategory === 'mom-baby') {
          return cat === 'mom-baby' || cat.includes('baby') || name.includes('stroller') || name.includes('botol') || name.includes('popok') || name.includes('sterilizer');
        }
        if (activeCategory === 'automotive') {
          return cat === 'automotive' || cat.includes('auto') || name.includes('helm') || name.includes('dashcam') || name.includes('microfiber') || name.includes('pompa');
        }
        return cat === activeCategory;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, activeCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (response.ok && Array.isArray(data) && data.length > 0) {
        // Merge backend items with extended catalog items
        const combined = [...data];
        EXTENDED_PRODUCTS.forEach(extItem => {
          if (!combined.some(p => p.name.toLowerCase() === extItem.name.toLowerCase())) {
            combined.push(extItem);
          }
        });
        setProducts(combined);
        setFilteredProducts(combined);
      } else {
        setProducts(EXTENDED_PRODUCTS);
        setFilteredProducts(EXTENDED_PRODUCTS);
      }
    } catch (error) {
      console.log('Backend unreachable, using extended catalog data fallback...');
      setProducts(EXTENDED_PRODUCTS);
      setFilteredProducts(EXTENDED_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleQuickFeatureClick = (featId) => {
    if (featId === 'rcs-mall') {
      handleSelectCategory('all');
      alert('Selamat datang di RCS Mall! 100% Produk Original & Garansi Resmi.');
    } else if (featId === 'flash-sale') {
      const el = document.getElementById('flash-sale-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (featId === 'rcs-supermarket') {
      handleSelectCategory('food');
    }
  };

  return (
    <div className="home-container">
      {/* 1. Ad Banner Carousel */}
      <AdBanner />

      {/* 2. Quick Feature Icons */}
      <QuickFeatures
        onFeatureClick={handleQuickFeatureClick}
        openPromoModal={openPromoModal}
      />

      {/* 3. Category Cart Grid */}
      <CategorySection
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Flash Sale Cart Section */}
      <div id="flash-sale-section">
        <FlashSaleSection products={products} onSelectProduct={onSelectProduct} />
      </div>

      {/* 5. Top Products Cart Section */}
      <TopProductsSection products={products} onSelectProduct={onSelectProduct} />

      {/* 6. Main Product Catalog Section */}
      <div id="catalog-section" className="catalog-header-bar">
        <h3 className="catalog-title">
          <ShoppingBag size={20} color="var(--primary)" />
          {t('allProductsTitle')}
        </h3>

        {activeCategory !== 'all' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="category-active-pill">
              Kategori: <strong>{CATEGORY_NAMES[activeCategory] || activeCategory}</strong>
            </span>
            <button
              onClick={() => handleSelectCategory('all')}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', gap: '12px', color: 'var(--primary)' }}>
          <Loader2 className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
          <span>Memuat katalog produk...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="catalog-empty-state">
          <p style={{ fontSize: '1.1rem' }}>Tidak ada produk yang sesuai dengan pencarian Anda.</p>
          <button onClick={() => handleSelectCategory('all')} className="btn btn-secondary" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
