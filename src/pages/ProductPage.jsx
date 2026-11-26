import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ExternalLink, Zap, ChevronLeft, Shield, Truck, RefreshCw, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const { id } = useParams();
  const { products } = useAdmin();
  const { toggleWishlist, isWishlisted } = useCart();

  const product = products.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state__icon">🔍</span>
          <h2>Product not found</h2>
          <p>This product may have been removed.</p>
          <Link to="/category/all" className="btn btn--primary">Browse All Products</Link>
        </div>
      </main>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_click', { product_id: product.id, product_name: product.name });
    }
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const images = product.images || [product.image];

  return (
    <main className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ margin: '20px 0' }}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <Link to={`/category/${product.category}`} className="product-page__back">
          <ChevronLeft size={16} /> Back to {product.category}
        </Link>

        <div className="product-page__layout">
          {/* Images */}
          <div className="product-page__images">
            <div className="product-page__main-image-wrap">
              <img
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="product-page__main-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=OASIS+Product'; }}
              />
              {product.discount > 0 && (
                <span className="product-card__badge" style={{ top: 16, left: 16, fontSize: 14, padding: '6px 12px' }}>
                  -{product.discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-page__thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-page__thumb ${i === selectedImage ? 'product-page__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=OASIS'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="product-page__details">
            <p className="product-page__category">{product.category}</p>
            <h1 className="product-page__name">{product.name}</h1>

            <div className="product-page__rating">
              <div className="product-card__stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? '#FF6B2B' : '#ddd'} color={s <= Math.round(product.rating) ? '#FF6B2B' : '#ddd'} />
                ))}
              </div>
              <span className="product-page__rating-num">{product.rating}</span>
              <span className="product-page__reviews">({product.reviews?.toLocaleString()} reviews)</span>
            </div>

            <div className="product-page__price-block">
              <span className="product-page__price">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="product-page__original">${product.originalPrice}</span>
                  <span className="product-page__savings">
                    You save ${(product.originalPrice - product.price).toFixed(2)} ({product.discount}%)
                  </span>
                </>
              )}
            </div>

            <div className="product-page__actions">
              <button className="product-page__buy-btn" onClick={handleBuyNow}>
                <Zap size={18} />
                Buy Now on AliExpress
                <ExternalLink size={16} />
              </button>
              <button
                className={`product-page__wishlist-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={18} fill={wishlisted ? '#FF6B2B' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Affiliate Notice */}
            <div className="product-page__affiliate-notice">
              <Shield size={14} />
              <span>You'll be redirected to AliExpress to complete your purchase securely.</span>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-page__features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((f, i) => (
                    <li key={i}><Check size={15} className="feature-check" /> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="product-page__desc">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="product-page__trust">
              <div className="trust-badge">
                <Shield size={16} /> <span>Secure Payment</span>
              </div>
              <div className="trust-badge">
                <Truck size={16} /> <span>Global Shipping</span>
              </div>
              <div className="trust-badge">
                <RefreshCw size={16} /> <span>Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="product-page__related">
            <h2>Related Products</h2>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductPage;
