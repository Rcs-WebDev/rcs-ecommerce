import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
  };

  const isOutOfStock = product.stock <= 0;

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div
      className="glass-card"
      onClick={handleCardClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Product Image */}
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        position: 'relative',
        background: '#121218'
      }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Stock Badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: isOutOfStock ? '#ef4444' : 'rgba(149, 221, 16, 0.9)',
          border: `1px solid ${isOutOfStock ? '#ef4444' : '#10b981'}`,
          color: isOutOfStock ? '#ffffff' : '#f6fdfaff',
          backdropFilter: 'blur(30px)'
        }}>
          {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock ?? 50}`}
        </span>
      </div>

      {/* Info Body */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: '12px'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          lineHeight: '1.4'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.6'
        }}>
          {product.description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {formatRupiah(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="btn btn-primary"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={16} />
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

