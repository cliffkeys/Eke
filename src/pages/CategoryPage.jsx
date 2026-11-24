import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams();
  const { products } = useAdmin();
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const category = categories.find(c => c.id === id);
  const pageTitle = category ? category.name : 'All Products';

  const filteredProducts = useMemo(() => {
    let list = id === 'all' || !id
      ? products
      : id === 'trending'
        ? products.filter(p => p.trending)
        : products.filter(p => p.category === id);

    // Price filter
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (selectedRating > 0) {
      list = list.filter(p => p.rating >= selectedRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'reviews': return [...list].sort((a, b) => b.reviews - a.reviews);
      case 'discount': return [...list].sort((a, b) => b.discount - a.discount);
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [id, products, sortBy, priceRange, selectedRating]);

  return (
    <main className="category-page">
      <div className="category-page__header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{pageTitle}</span>
          </div>
          <h1 className="category-page__title">
            {category?.icon} {pageTitle}
          </h1>
          <p className="category-page__count">{filteredProducts.length} products found</p>
        </div>
      </div>

      <div className="container">
        {/* Filter Bar */}
        <div className="filter-bar">
          <button className="filter-bar__toggle" onClick={() => setFilterOpen(!filterOpen)}>
            <SlidersHorizontal size={16} /> Filters {filterOpen ? <X size={14} /> : <ChevronDown size={14} />}
          </button>

          <div className="filter-bar__sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-bar__select">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {filterOpen && (
          <div className="filter-panel">
            <div className="filter-panel__group">
              <label className="filter-panel__label">Price Range: ${priceRange[0]} – ${priceRange[1]}</label>
              <input
                type="range" min={0} max={500} value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="filter-panel__range"
              />
            </div>
            <div className="filter-panel__group">
              <label className="filter-panel__label">Minimum Rating</label>
              <div className="filter-panel__rating-btns">
                {[0,4,4.5,4.7].map(r => (
                  <button
                    key={r}
                    className={`filter-panel__rating-btn ${selectedRating === r ? 'active' : ''}`}
                    onClick={() => setSelectedRating(r)}
                  >
                    {r === 0 ? 'All' : `${r}+⭐`}
                  </button>
                ))}
              </div>
            </div>
            <button className="filter-panel__reset" onClick={() => { setPriceRange([0,500]); setSelectedRating(0); }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Category Chips */}
        <div className="cat-chips">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`cat-chip ${id === cat.id ? 'cat-chip--active' : ''}`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🛍️</span>
            <h3>No products found</h3>
            <p>Try adjusting your filters or browse another category.</p>
            <Link to="/category/all" className="btn btn--primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;
