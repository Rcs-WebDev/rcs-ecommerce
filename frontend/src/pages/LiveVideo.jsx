import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import {
  Heart,
  Share2,
  MoreHorizontal,
  ShoppingBag,
  Plus,
  Flame,
  Check,
  Send,
  UserCheck
} from 'lucide-react';
import '../styles/LiveVideo.css';

export default function LiveVideo({ onSelectProduct }) {
  const { addToCart } = useContext(CartContext);
  const [likesCount, setLikesCount] = useState(32500);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');

  const liveProduct = {
    id: 105,
    name: "Kain Katun Indonesia Premium 80x120cm",
    price: 11850,
    originalPrice: 24000,
    discount: 51,
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
    description: "Kain katun murni Indonesia mutu terbaik tahan lama & warna pekat."
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBuyFeatured = async () => {
    await addToCart(liveProduct.id, 1);
    alert(`Berhasil menambahkan ${liveProduct.name} ke keranjang!`);
  };

  const handleProductCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(liveProduct);
    }
  };

  return (
    <div className="live-page-container">
      {/* Background Stream Image */}
      <img
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
        alt="Live Stream Host"
        className="live-bg-stream"
      />
      <div className="live-overlay-gradient" />

      {/* 1. Top Header Navigation */}
      <div className="live-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserCheck size={22} />
        </div>

        <div className="live-top-tabs">
          <span className="live-tab-item">Video</span>
          <span className="live-tab-item active">
            Live <span className="live-badge-dot">LIVE</span>
          </span>
          <span className="live-tab-item">Drama</span>
          <span className="live-tab-item">Untuk Anda</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={22} cursor="pointer" />
        </div>
      </div>

      {/* 2. Host Channel Info */}
      <div className="live-host-bar">
        <div className="live-host-info-chip">
          <div className="live-host-avatar">N</div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Naufall_Afif</span>
              <Check size={12} color="#38bdf8" />
            </div>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)' }}>90 Penonton</span>
          </div>

          <button
            className="live-follow-btn"
            onClick={() => setIsFollowing(!isFollowing)}
            style={{ background: isFollowing ? 'rgba(255,255,255,0.3)' : '#ef4444' }}
          >
            {isFollowing ? 'Mengikuti' : '+ Ikuti'}
          </button>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.85)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Flame size={12} color="#fff" />
          <span>No. 17 di Lifestyle &gt;</span>
        </div>
      </div>

      {/* 3. Floating Featured Product Card Overlay */}
      <div className="live-product-card">
        <div style={{ position: 'relative' }} onClick={handleProductCardClick} cursor="pointer">
          <span style={{ position: 'absolute', top: 4, left: 4, background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '1px 5px', borderRadius: '4px' }}>
            -51%
          </span>
          <img src={liveProduct.image_url} alt="Live Product" className="live-product-thumb" />
        </div>

        <div style={{ marginTop: '6px' }}>
          <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 800, background: 'rgba(239, 68, 68, 0.1)', padding: '1px 4px', borderRadius: '4px' }}>
            Garansi Harga Terbaik
          </span>
          <h5 style={{ fontSize: '0.75rem', fontWeight: 700, margin: '4px 0 2px 0', height: '2.4em', overflow: 'hidden' }}>
            {liveProduct.name}
          </h5>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444' }}>
            Rp11.850
          </span>

          <button className="live-buy-btn" onClick={handleBuyFeatured}>
            Beli Sekarang
          </button>
        </div>
      </div>

      {/* 4. Right Side Interaction Controls */}
      <div className="live-right-actions">
        <div style={{ textAlign: 'center' }}>
          <div className="live-action-circle" onClick={handleLike}>
            <Heart size={24} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#ffffff'} />
          </div>
          <span className="live-action-label">{(likesCount / 1000).toFixed(1)}RB</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="live-action-circle" onClick={() => alert('Link Live Stream disalin!')}>
            <Share2 size={22} color="#ffffff" />
          </div>
          <span className="live-action-label">19</span>
        </div>

        <div className="live-action-circle" onClick={() => alert('Opsi Live Stream')}>
          <MoreHorizontal size={22} color="#ffffff" />
        </div>
      </div>

      {/* 5. Bottom Action Bar */}
      <div className="live-bottom-bar">
        <button
          className="live-bag-trigger"
          onClick={handleProductCardClick}
          title="Lihat Keranjang Produk Live"
        >
          <ShoppingBag size={22} />
          <span className="live-bag-badge">340</span>
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!commentText.trim()) return;
            alert(`Komentar dikirim: ${commentText}`);
            setCommentText('');
          }}
          style={{ flexGrow: 1, display: 'flex', gap: '8px' }}
        >
          <input
            type="text"
            placeholder="Beri Komentar..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="live-comment-input"
          />
          <button
            type="submit"
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <Send size={20} color="#38bdf8" />
          </button>
        </form>
      </div>
    </div>
  );
}
