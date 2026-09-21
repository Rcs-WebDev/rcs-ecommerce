import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  Ruler,
  MessageCircle,
  ThumbsUp,
  Search,
  CheckCircle,
  Share2,
  Heart,
  Loader2
} from 'lucide-react';
import '../styles/ProductDetail.css';

// Helper generator to provide realistic dynamic specs, variants, gallery images & reviews per product category
function getProductDynamicConfig(product) {
  if (!product) return {};

  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  let categoryType = 'general';
  if (category.includes('computer') || name.includes('rtx') || name.includes('keyboard') || name.includes('monitor')) {
    categoryType = 'computers';
  } else if (category.includes('electronic') || name.includes('headphone') || name.includes('mouse')) {
    categoryType = 'electronics';
  } else if (category.includes('men-fashion') || category.includes('women-fashion') || name.includes('hoodie') || name.includes('jaket') || name.includes('blazer')) {
    categoryType = 'apparel';
  } else if (category.includes('shoes') || name.includes('sepatu') || name.includes('sneakers')) {
    categoryType = 'shoes';
  } else if (category.includes('food') || name.includes('kopi') || name.includes('matcha') || name.includes('chocolate')) {
    categoryType = 'food';
  } else if (category.includes('beauty') || name.includes('serum') || name.includes('parfum')) {
    categoryType = 'beauty';
  } else if (category.includes('home') || name.includes('purifier') || name.includes('diffuser')) {
    categoryType = 'home_living';
  } else if (category.includes('auto') || name.includes('helm')) {
    categoryType = 'automotive';
  } else if (category.includes('bags') || category.includes('watches') || name.includes('tas') || name.includes('jam')) {
    categoryType = 'accessories';
  }

  // Dynamic Gallery Images (Main image + 3 category specific images)
  let extraImages = [];
  switch (categoryType) {
    case 'computers':
      extraImages = [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
      ];
      break;
    case 'electronics':
      extraImages = [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
      ];
      break;
    case 'apparel':
      extraImages = [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
        "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600",
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600"
      ];
      break;
    case 'shoes':
      extraImages = [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"
      ];
      break;
    case 'food':
      extraImages = [
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600",
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600"
      ];
      break;
    case 'beauty':
      extraImages = [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"
      ];
      break;
    case 'home_living':
      extraImages = [
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600",
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600"
      ];
      break;
    case 'automotive':
      extraImages = [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600"
      ];
      break;
    default:
      extraImages = [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
      ];
  }
  const galleryImages = [product.image_url, ...extraImages.slice(0, 3)];

  // Dynamic Options / Variants
  let var1Title = "Warna / Varian";
  let var1Options = [];
  let var2Title = "Pilihan Ukuran / Spesifikasi";
  let var2Options = [];
  let showSizeGuide = false;
  let sizeGuideType = null;
  let specsList = [];
  let reviews = [];

  if (categoryType === 'computers' || categoryType === 'electronics') {
    var1Title = "Warna / Edition";
    var1Options = [
      { name: 'Matte Stealth Black', hex: '#111827' },
      { name: 'Cyber RGB White', hex: '#f9fafb' },
      { name: 'Titanium Gunmetal', hex: '#4b5563' }
    ];
    var2Title = "Garansi / Varian Paket";
    var2Options = ['Garansi Resmi 1 Tahun', 'Garansi Resmi 2 Tahun', 'Bundle Protection Kit'];
    specsList = [
      "Performa Tinggi: Komponen standar kompetitif gaming & produktivitas profesional.",
      "Konektivitas Ultra Cepat: Mendukung USB-C / Wireless Low Latency.",
      "Material Premium: Memakai rangka alloy & pendingin suhu efisien.",
      "Garansi Resmi Distributor RCSMART: 100% Produk Original & tersegel aman."
    ];
    reviews = [
      {
        id: 1, name: 'budi_gamer_pro', avatar: 'B', rating: 5, variant: 'Matte Stealth Black, Garansi 2 Thn', date: '08-08-2026',
        comment: 'Produk ori 100%! Performa gokil banget, pengiriman super aman dibungkus bubble wrap tebal. Sangat puas!', helpful: 14, isHelpfulClicked: false,
        images: [product.image_url]
      },
      {
        id: 2, name: 'hendra_tech', avatar: 'H', rating: 5, variant: 'Cyber RGB White, Garansi 1 Thn', date: '01-08-2026',
        comment: 'Build quality solid dan estetika RGB-nya cantik banget di desk setup saya. Seller fast respon!', helpful: 9, isHelpfulClicked: false,
        images: []
      }
    ];
  } else if (categoryType === 'apparel') {
    var1Title = "Warna";
    var1Options = [
      { name: 'Black Edition', hex: '#111827' },
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Hijau Army', hex: '#2d3a28' },
      { name: 'Beige Cream', hex: '#d1d5db' }
    ];
    var2Title = "Ukuran Pakaian";
    var2Options = ['M', 'L', 'XL', 'XXL', '3XL'];
    showSizeGuide = true;
    sizeGuideType = 'clothing';
    specsList = [
      "Bahan Premium: Terbuat dari katun/fleece tebal berkualitas tinggi yang adem & lembut.",
      "Jahitan Presisi: Jahitan rantai ganda standar distro ekspor.",
      "Model Stylish: Potongan modern unisex cocok untuk daily wear maupun hangout.",
      "Perawatan Mudah: Tidak mudah luntur atau menyusut saat dicuci."
    ];
    reviews = [
      {
        id: 1, name: 'diah_purwa12', avatar: 'D', rating: 5, variant: 'Black Edition, XL', date: '05-08-2026',
        comment: 'Bahannya sangat bagus dan tebal! Dipakai pas banget, pengiriman super cepat & packing aman banget. Rekomended!', helpful: 12, isHelpfulClicked: false,
        images: [product.image_url]
      },
      {
        id: 2, name: 'ferdanalifsetiawan07', avatar: 'F', rating: 5, variant: 'Navy Blue, XXL', date: '30-07-2026',
        comment: 'Kualitas sesuai ekspektasi Mall ORI! Jahitan rapi, warna pekat tidak luntur saat dicuci.', helpful: 8, isHelpfulClicked: false,
        images: []
      }
    ];
  } else if (categoryType === 'shoes') {
    var1Title = "Warna";
    var1Options = [
      { name: 'Triple Black', hex: '#111827' },
      { name: 'White Red Accent', hex: '#ef4444' },
      { name: 'Grey Gum Sole', hex: '#6b7280' }
    ];
    var2Title = "Ukuran Sepatu (EU)";
    var2Options = ['39 EU', '40 EU', '41 EU', '42 EU', '43 EU', '44 EU'];
    showSizeGuide = true;
    sizeGuideType = 'shoes';
    specsList = [
      "Upper Material: Kulit sintetis & mesh bernapas tahan lama.",
      "Insole Memory Foam: Empuk dan meredam benturan saat dipakai berjalan jauh.",
      "Outsole Anti-Slip: Sol karet mencengkeram kuat di permukaan licin.",
      "100% Original Box Included."
    ];
    reviews = [
      {
        id: 1, name: 'andi_sneakerhead', avatar: 'A', rating: 5, variant: 'Triple Black, 42 EU', date: '04-08-2026',
        comment: 'Sepatunya empuk banget buat dipakai seharian! Ukuran 42 pas di kaki. Pengiriman 1 hari sampai!', helpful: 15, isHelpfulClicked: false,
        images: [product.image_url]
      }
    ];
  } else if (categoryType === 'food') {
    var1Title = "Varian / Rasa";
    var1Options = [
      { name: 'Original Premium Blend', hex: '#78350f' },
      { name: 'Bold Caramel Roast', hex: '#b45309' },
      { name: 'Special Reserve Organic', hex: '#15803d' }
    ];
    var2Title = "Berat / Kemasan";
    var2Options = ['250 Gram', '500 Gram', '1 Kilogram Pack'];
    specsList = [
      "100% Bahan Alami: Tanpa pengawet buatan atau pemanis sintetis.",
      "Sertifikasi Resmi: BPOM RI & Halal MUI Terdaftar.",
      "Masa Kadaluarsa: Segar disangrai dengan ketahanan 12 bulan simpan rapat.",
      "Kemasan Pouch Foil: Menjaga aroma & cita rasa tetap terjaga utuh."
    ];
    reviews = [
      {
        id: 1, name: 'siti_kuliner', avatar: 'S', rating: 5, variant: 'Original Premium Blend, 500 Gram', date: '06-08-2026',
        comment: 'Aromanya harum banget pas dibuka dari bungkusnya! Rasanya sangat nikmat & tidak terlalu asam di perut.', helpful: 11, isHelpfulClicked: false,
        images: [product.image_url]
      }
    ];
  } else if (categoryType === 'beauty') {
    var1Title = "Varian Formula";
    var1Options = [
      { name: 'Hydrating Glow Formula', hex: '#ec4899' },
      { name: 'Sensitive Care Gentle', hex: '#a855f7' }
    ];
    var2Title = "Ukuran Botol / Volume";
    var2Options = ['30 ml Travel Size', '50 ml Full Size', '100 ml Value Size'];
    specsList = [
      "BPOM Certified: Aman untuk semua jenis kulit termasuk kulit sensitif.",
      "Dermatologically Tested: Diuji secara klinis oleh dokter spesialis kulit.",
      "Bahan Aktif Berkualitas: Kaya akan Niacinamide, Hyaluronic Acid & antioksidan.",
      "Tekstur Ringan: Cepat meresap tanpa meninggalkan rasa lengket."
    ];
    reviews = [
      {
        id: 1, name: 'clarissa_beauty', avatar: 'C', rating: 5, variant: 'Hydrating Glow, 50 ml', date: '07-08-2026',
        comment: 'Pemakaian 2 minggu wajah keliatan jauh lebih mencerahkan & lembab! Teksturnya ringan banget.', helpful: 18, isHelpfulClicked: false,
        images: [product.image_url]
      }
    ];
  } else if (categoryType === 'automotive') {
    var1Title = "Warna Helm / Visor";
    var1Options = [
      { name: 'Carbon Black (Smoke Visor)', hex: '#111827' },
      { name: 'Titanium Grey (Clear Visor)', hex: '#4b5563' }
    ];
    var2Title = "Ukuran Helm";
    var2Options = ['M', 'L', 'XL', 'XXL'];
    specsList = [
      "Standar Keamanan Internasional: Sertifikasi SNI 1811-2007 & DOT Approved.",
      "Material Shell: 100% Real Carbon Fiber Ultra-Lightweight (Bobot 1350g ± 50g).",
      "Sistem Busa Inner EPS: Busa pipi empuk knock-down bisa dilepas cuci.",
      "Sistem Pengunci: Double D-Ring profesional standar balap."
    ];
    reviews = [
      {
        id: 1, name: 'bayu_rider', avatar: 'B', rating: 5, variant: 'Carbon Black, L', date: '02-08-2026',
        comment: 'Helmnya enteng banget di leher pas turing jauh! Finishing karbon asli mewah banget. Sangat rekomendasi!', helpful: 16, isHelpfulClicked: false,
        images: [product.image_url]
      }
    ];
  } else {
    var1Title = "Warna / Varian";
    var1Options = [
      { name: 'Standard Edition', hex: '#111827' },
      { name: 'Special Premium', hex: '#7c3aed' }
    ];
    var2Title = "Ukuran / Ukuran Kemasan";
    var2Options = ['Standard', 'Large / Deluxe'];
    specsList = [
      "Kualitas Terbaik: Diproduksi dengan standar kontrol mutu ketat.",
      "Garansi Toko 7 Hari: Jaminan ganti baru jika terdapat cacat produksi.",
      "100% Produk Original RCSMART."
    ];
    reviews = [
      {
        id: 1, name: 'pelanggan_setia', avatar: 'P', rating: 5, variant: 'Standard Edition', date: '03-08-2026',
        comment: 'Produk datang tepat waktu dan sesuai deskripsi. Kualitas oke banget!', helpful: 7, isHelpfulClicked: false,
        images: []
      }
    ];
  }

  return {
    categoryType,
    galleryImages,
    var1Title,
    var1Options,
    var2Title,
    var2Options,
    showSizeGuide,
    sizeGuideType,
    specsList,
    initialReviews: reviews
  };
}

export default function ProductDetail({ product: initialProduct, onBack, setCurrentPage, onPaymentComplete }) {
  const { addToCart } = useContext(CartContext);
  const { token, API_URL } = useContext(AuthContext);

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVar1, setSelectedVar1] = useState('');
  const [selectedVar2, setSelectedVar2] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [activeReviewFilter, setActiveReviewFilter] = useState('all');

  // Fetch full details from backend if ID exists
  useEffect(() => {
    if (initialProduct && initialProduct.id) {
      fetchBackendProduct(initialProduct.id);
    }
  }, [initialProduct]);

  const fetchBackendProduct = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();
      if (res.ok && data && data.id) {
        setProduct(data);
      }
    } catch (e) {
      console.log('Using passed product state...');
    } finally {
      setLoading(false);
    }
  };

  const dynamicConfig = getProductDynamicConfig(product);
  const galleryImages = dynamicConfig.galleryImages || [product?.image_url || ''];
  const var1Options = dynamicConfig.var1Options || [];
  const var2Options = dynamicConfig.var2Options || [];
  const specsList = dynamicConfig.specsList || [];

  const [reviews, setReviews] = useState(dynamicConfig.initialReviews || []);

  useEffect(() => {
    if (var1Options.length > 0) setSelectedVar1(var1Options[0].name || var1Options[0]);
    if (var2Options.length > 0) setSelectedVar2(var2Options[0]);
    if (dynamicConfig.initialReviews) setReviews(dynamicConfig.initialReviews);
  }, [product]);

  if (!product) {
    return (
      <div className="product-detail-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Produk Tidak Ditemukan</h2>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    alert(`Berhasil menambahkan ${quantity} item (${selectedVar1 || ''} ${selectedVar2 ? '- ' + selectedVar2 : ''}) ke keranjang!`);
  };

  // Navigate to Shopping Cart page on Buy Now click
  const handleBuyNow = async () => {
    if (!token) {
      alert('Silakan login terlebih dahulu untuk melakukan pembelian.');
      return;
    }
    await addToCart(product.id, quantity);
    if (setCurrentPage) {
      setCurrentPage('cart');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleHelpful = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpful: r.isHelpfulClicked ? r.helpful - 1 : r.helpful + 1,
          isHelpfulClicked: !r.isHelpfulClicked
        };
      }
      return r;
    }));
  };

  const filteredReviews = reviews.filter(r => {
    if (activeReviewFilter === '5stars' && r.rating !== 5) return false;
    if (activeReviewFilter === 'withPhotos' && (!r.images || r.images.length === 0)) return false;
    if (reviewSearch.trim() !== '') {
      const q = reviewSearch.toLowerCase();
      return r.comment.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || (r.variant && r.variant.toLowerCase().includes(q));
    }
    return true;
  });

  const originalPrice = product.price * 1.25;

  return (
    <div className="product-detail-container">
      {/* Back Button */}
      <button onClick={onBack} className="pd-back-btn">
        <ArrowLeft size={18} />
        <span>Kembali ke Katalog Produk</span>
      </button>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', color: 'var(--primary)', fontWeight: 600 }}>
          <Loader2 className="animate-spin" size={18} /> Memuat data terbaru dari backend...
        </div>
      )}

      {/* Grid Layout: Left Gallery - Right Specs */}
      <div className="pd-layout-grid">
        {/* Gallery Section */}
        <div className="pd-gallery-section">
          <div className="pd-main-image-container">
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              className="pd-main-image"
            />
            {/* Gallery Navigation Controls */}
            <button onClick={handlePrevImage} className="pd-gallery-nav-btn pd-gallery-prev">
              <ChevronLeft size={22} />
            </button>
            <button onClick={handleNextImage} className="pd-gallery-nav-btn pd-gallery-next">
              <ChevronRight size={22} />
            </button>

            {/* Position Indicator Badge */}
            <div className="pd-gallery-badge">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="pd-thumbnails-row">
            {galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`pd-thumbnail-item ${activeImageIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info & Variants Section */}
        <div className="pd-info-section">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="pd-mall-badge">Mall | ORI 100%</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isFavorite ? '#ef4444' : 'var(--text-muted)'
                  }}
                >
                  <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
                </button>
                <button
                  onClick={() => alert('Link produk disalin ke clipboard!')}
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <h1 className="pd-product-title">{product.name}</h1>

            <div className="pd-rating-meta" style={{ marginTop: '10px' }}>
              <div className="pd-stars-pill">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>4.9</span>
              </div>
              <span>|</span>
              <span>Penilaian Produk ({reviews.length})</span>
              <span>|</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Stok: {product.stock || 50} item</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="pd-price-box">
            <span className="pd-current-price">{formatRupiah(product.price)}</span>
            <span className="pd-original-price">{formatRupiah(originalPrice)}</span>
            <span className="pd-discount-badge">Diskon 20%</span>
          </div>

          {/* Dynamic Variant 1 Group */}
          {var1Options.length > 0 && (
            <div className="pd-variant-group">
              <div className="pd-variant-label">
                <span>{dynamicConfig.var1Title}: <strong style={{ color: 'var(--primary)' }}>{selectedVar1}</strong></span>
              </div>
              <div className="pd-options-wrap">
                {var1Options.map((opt, idx) => {
                  const optName = typeof opt === 'object' ? opt.name : opt;
                  const optHex = typeof opt === 'object' ? opt.hex : null;
                  return (
                    <button
                      key={idx}
                      className={`pd-chip-option ${selectedVar1 === optName ? 'active' : ''}`}
                      onClick={() => setSelectedVar1(optName)}
                    >
                      {optHex && <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: optHex, display: 'inline-block', border: '1px solid #fff' }} />}
                      <span>{optName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Variant 2 Group */}
          {var2Options.length > 0 && (
            <div className="pd-variant-group">
              <div className="pd-variant-label">
                <span>{dynamicConfig.var2Title}: <strong style={{ color: 'var(--primary)' }}>{selectedVar2}</strong></span>
              </div>
              <div className="pd-options-wrap">
                {var2Options.map((s, idx) => (
                  <button
                    key={idx}
                    className={`pd-chip-option ${selectedVar2 === s ? 'active' : ''}`}
                    onClick={() => setSelectedVar2(s)}
                  >
                    {s}
                  </button>
                ))}

                {dynamicConfig.showSizeGuide && (
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    <Ruler size={16} />
                    <span>Panduan Ukuran</span>
                  </button>
                )}
              </div>

              {/* Collapsible Size Guide Table (Only for Apparel / Shoes) */}
              {showSizeGuide && dynamicConfig.showSizeGuide && (
                <div className="pd-sizeguide-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {dynamicConfig.sizeGuideType === 'shoes' ? 'Tabel Ukuran Sepatu (Insole in CM)' : 'Tabel Ukuran Pakaian (Size Guide in CM)'}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toleransi ±1 cm</span>
                  </div>
                  {dynamicConfig.sizeGuideType === 'shoes' ? (
                    <table className="pd-sizeguide-table">
                      <thead>
                        <tr><th>Ukuran EU</th><th>Panjang Insole</th><th>Panjang Kaki</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>39 EU</td><td>25.0 cm</td><td>24.0 - 24.5 cm</td></tr>
                        <tr><td>40 EU</td><td>25.5 cm</td><td>24.6 - 25.0 cm</td></tr>
                        <tr><td>41 EU</td><td>26.5 cm</td><td>25.5 - 26.0 cm</td></tr>
                        <tr style={{ background: 'rgba(124, 58, 237, 0.15)', fontWeight: 'bold' }}><td>42 EU</td><td>27.0 cm</td><td>26.1 - 26.5 cm</td></tr>
                        <tr><td>43 EU</td><td>28.0 cm</td><td>27.0 - 27.5 cm</td></tr>
                        <tr><td>44 EU</td><td>28.5 cm</td><td>27.6 - 28.0 cm</td></tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="pd-sizeguide-table">
                      <thead>
                        <tr><th>Ukuran</th><th>Lebar Dada</th><th>Panjang Badan</th><th>Panjang Lengan</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>M</td><td>52 cm</td><td>68 cm</td><td>60 cm</td></tr>
                        <tr><td>L</td><td>55 cm</td><td>70 cm</td><td>61 cm</td></tr>
                        <tr><td>XL</td><td>58 cm</td><td>72 cm</td><td>62 cm</td></tr>
                        <tr style={{ background: 'rgba(124, 58, 237, 0.15)', fontWeight: 'bold' }}><td>XXL</td><td>61 cm</td><td>74 cm</td><td>63 cm</td></tr>
                        <tr><td>3XL</td><td>64 cm</td><td>76 cm</td><td>64 cm</td></tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quantity Counter & Action Buttons */}
          <div className="pd-action-box">
            <div className="pd-qty-control">
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="pd-qty-val">{quantity}</span>
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '12px 18px', gap: '8px' }}
            >
              <ShoppingCart size={18} />
              <span>+ Keranjang</span>
            </button>

            {/* Direct Checkout on Buy Now click */}
            <button
              onClick={handleBuyNow}
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px 18px', gap: '8px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
            >
              <Zap size={18} />
              <span>Beli Sekarang</span>
            </button>
          </div>

          {/* Guarantee Highlights */}
          <div className="pd-guarantees-grid">
            <div className="pd-guarantee-item">
              <ShieldCheck size={18} color="var(--accent-green)" />
              <span>100% Produk Original Mall</span>
            </div>
            <div className="pd-guarantee-item">
              <Truck size={18} color="var(--primary)" />
              <span>Bebas Ongkir Seluruh Indonesia</span>
            </div>
            <div className="pd-guarantee-item">
              <RotateCcw size={18} color="#f59e0b" />
              <span>7 Hari Bebas Pengembalian</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="pd-section-card">
        <h3 className="pd-section-title">
          <CheckCircle size={20} color="var(--primary)" />
          Deskripsi & Spesifikasi Produk
        </h3>
        <div className="pd-description-text">
          <p style={{ fontSize: '0.98rem', lineHeight: '1.7' }}>{product.description}</p>
          <br />
          <strong>Fitur & Keunggulan Utama:</strong>
          <ul>
            {specsList.map((spec, idx) => (
              <li key={idx}>• {spec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="pd-section-card">
        <h3 className="pd-section-title">
          <Star size={20} fill="#f59e0b" color="#f59e0b" />
          Penilaian Pembeli ({reviews.length})
        </h3>

        {/* Rating Summary Card */}
        <div className="pd-rating-summary-card">
          <div className="pd-big-score">
            <span className="pd-big-score-num">4.9</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>dari 5.0</span>
            <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="pd-reviews-filters">
              <button
                className={`pd-filter-pill ${activeReviewFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveReviewFilter('all')}
              >
                Semua ({reviews.length})
              </button>
              <button
                className={`pd-filter-pill ${activeReviewFilter === '5stars' ? 'active' : ''}`}
                onClick={() => setActiveReviewFilter('5stars')}
              >
                5 Bintang ({reviews.length})
              </button>
              <button
                className={`pd-filter-pill ${activeReviewFilter === 'withPhotos' ? 'active' : ''}`}
                onClick={() => setActiveReviewFilter('withPhotos')}
              >
                Dengan Foto / Video
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari ulasan pembeli..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.82rem', borderRadius: '10px' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div>
          {filteredReviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '16px 0' }}>
              Tidak ada ulasan yang sesuai dengan filter pencarian.
            </p>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="pd-review-item">
                <div className="pd-reviewer-header">
                  <div className="pd-reviewer-user">
                    <div className="pd-avatar-img">{rev.avatar}</div>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{rev.name}</h5>
                      <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{rev.date}</span>
                </div>

                {rev.variant && <span className="pd-variant-bought-badge">Variasi: {rev.variant}</span>}

                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '8px', lineHeight: '1.6' }}>
                  {rev.comment}
                </p>

                {rev.images && rev.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Review photo"
                        style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    onClick={() => handleToggleHelpful(rev.id)}
                    style={{
                      background: rev.isHelpfulClicked ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                      border: '1px solid var(--glass-border)',
                      color: rev.isHelpfulClicked ? 'var(--primary)' : 'var(--text-muted)',
                      borderRadius: '16px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <ThumbsUp size={12} />
                    <span>Membantu ({rev.helpful})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="pd-mobile-sticky-bar">
        <button
          onClick={() => alert('Menghubungkan ke Chat Penjual RCSMART...')}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: 'var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.7rem'
          }}
        >
          <MessageCircle size={18} />
          <span>Chat</span>
        </button>

        <button
          onClick={handleAddToCart}
          className="btn btn-secondary"
          style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
        >
          <ShoppingCart size={16} />
          <span>+ Keranjang</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="btn btn-primary"
          style={{ flex: 1, padding: '10px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
        >
          <Zap size={16} />
          <span>Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
}
