import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShoppingBag, Zap, Shield } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';
import { categories } from '../data/products';

const HeroBanner = () => {
  const [searchQ, setSearchQ] = React.useState('');
  const navigate = React.useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQ.trim())}`;
    }
  };

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-shape hero__bg-shape--1" />
        <div className="hero__bg-shape hero__bg-shape--2" />
        <div className="hero__bg-shape hero__bg-shape--3" />
      </div>
      <div className="container hero__content">
        <div className="hero__text">
          <span className="hero__pill">🌍 International Shopping Hub</span>
          <h1 className="hero__title">
            Discover More.<br />
            <span className="hero__title--accent">Shop Smarter.</span>
          </h1>
          <p className="hero__subtitle">
            Thousands of premium products from AliExpress. 
            Curated deals, unbeatable prices, delivered worldwide.
          </p>
          <form className="hero__search" onSubmit={handleSearch}>
            <div className="hero__search-wrap">
              <Search size={20} className="hero__search-icon" />
              <input
                type="text"
                placeholder="Search electronics, fashion, watches..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="hero__search-input"
              />
              <button type="submit" className="hero__search-btn">
                Search
              </button>
            </div>
          </form>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">20+</span>
              <span className="hero__stat-label">Products</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">7</span>
              <span className="hero__stat-label">Categories</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">50%</span>
              <span className="hero__stat-label">Off Deals</span>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card-stack">
            <div className="hero__floating-card hero__floating-card--1">
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80" alt="Featured product" />
            </div>
            <div className="hero__floating-card hero__floating-card--2">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="Featured product" />
            </div>
            <div className="hero__floating-card hero__floating-card--3">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" alt="Featured product" />
            </div>
            <div className="hero__badge-floating hero__badge-floating--1">
              <Zap size={12} /> Up to 50% Off
            </div>
            <div className="hero__badge-floating hero__badge-floating--2">
              <Shield size={12} /> Secure Links
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryGrid = () => (
  <section className="section">
    <div className="container">
      <div className="section__header">
        <h2 className="section__title">Shop by Category</h2>
        <Link to="/category/all" className="section__link">View All <ArrowRight size={16} /></Link>
      </div>
      <div className="category-grid">
        {categories.filter(c => c.id !== 'all').map(cat => (
          <Link key={cat.id} to={`/category/${cat.id}`} className="category-card">
            <span className="category-card__icon">{cat.icon}</span>
            <span className="category-card__name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedDeals = ({ products }) => (
  <section className="section section--alt">
    <div className="container">
      <div className="section__header">
        <div>
          <h2 className="section__title">⚡ Featured Deals</h2>
          <p className="section__subtitle">Hand-picked deals with up to 50% off</p>
        </div>
        <Link to="/deals" className="section__link">All Deals <ArrowRight size={16} /></Link>
      </div>
      <div className="product-grid">
        {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  </section>
);

const TrendingProducts = ({ products }) => (
  <section className="section">
    <div className="container">
      <div className="section__header">
        <div>
          <h2 className="section__title">🔥 Trending Now</h2>
          <p className="section__subtitle">What everyone is buying this week</p>
        </div>
        <Link to="/category/trending" className="section__link">View All <ArrowRight size={16} /></Link>
      </div>
      <div className="product-grid">
        {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  </section>
);

const PromoStrip = () => (
  <div className="promo-strip">
    <div className="promo-strip__track">
      {['🌍 Ships Worldwide', '⚡ Exclusive Deals Daily', '🔒 Secure Affiliate Links', '💰 Up to 50% Off', '⭐ Curated Products', '📦 AliExpress Fulfilment'].map((item, i) => (
        <span key={i} className="promo-strip__item">{item}</span>
      ))}
      {/* Duplicate for seamless loop */}
      {['🌍 Ships Worldwide', '⚡ Exclusive Deals Daily', '🔒 Secure Affiliate Links', '💰 Up to 50% Off', '⭐ Curated Products', '📦 AliExpress Fulfilment'].map((item, i) => (
        <span key={`dup-${i}`} className="promo-strip__item">{item}</span>
      ))}
    </div>
  </div>
);

const TrustBanner = () => (
  <section className="trust-banner">
    <div className="container">
      <div className="trust-banner__grid">
        <div className="trust-item">
          <span className="trust-item__icon">🌍</span>
          <div>
            <strong>Ships Worldwide</strong>
            <p>AliExpress delivers globally</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-item__icon">🔒</span>
          <div>
            <strong>Secure Shopping</strong>
            <p>Payments processed by AliExpress</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-item__icon">💰</span>
          <div>
            <strong>Best Prices</strong>
            <p>Up to 50% off retail prices</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-item__icon">⭐</span>
          <div>
            <strong>Curated Quality</strong>
            <p>Top-rated products only</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HomePage = () => {
  const { products } = useAdmin();
  const featured = products.filter(p => p.featured);
  const trending = products.filter(p => p.trending);

  return (
    <main>
      <HeroBanner />
      <PromoStrip />
      <CategoryGrid />
      <FeaturedDeals products={featured} />
      <TrustBanner />
      <TrendingProducts products={trending} />
    </main>
  );
};

export default HomePage;
