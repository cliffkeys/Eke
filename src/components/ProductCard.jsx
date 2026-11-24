import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ExternalLink, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Track click event (affiliate analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_click', { product_id: product.id, product_name: product.name });
    }
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=EKE+Product'; }}
        />
        {product.discount > 0 && (
          <span className="product-card__badge">-{product.discount}%</span>
        )}
        {product.trending && (
          <span className="product-card__badge product-card__badge--trending">🔥 Hot</span>
        )}
        <button
          className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <Heart size={18} fill={wishlisted ? '#FF6B2B' : 'none'} />
        </button>
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <div className="product-card__stars">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#FF6B2B' : '#ddd'} color={s <= Math.round(product.rating) ? '#FF6B2B' : '#ddd'} />
            ))}
          </div>
          <span className="product-card__reviews">({product.reviews?.toLocaleString()})</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-card__price">${product.price}</span>
          {product.originalPrice && (
            <span className="product-card__original">${product.originalPrice}</span>
          )}
        </div>
        <button className="product-card__buy-btn" onClick={handleBuyNow}>
          <Zap size={15} /> Buy on AliExpress
          <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
