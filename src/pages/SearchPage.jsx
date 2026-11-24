import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { products } = useAdmin();

  const results = products.filter(p => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      (p.name || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query) ||
      (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(query))) ||
      (p.category || '').toLowerCase().includes(query)
    );
  });

  return (
    <main className="category-page">
      <div className="category-page__header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Search</span>
          </div>
          <h1 className="category-page__title">
            <Search size={28} /> Search Results
          </h1>
          <p className="category-page__count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{q}</strong>"
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        {results.length > 0 ? (
          <div className="product-grid">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <h3>No results found for "{q}"</h3>
            <p>Try different keywords or browse our categories.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/category/electronics" className="btn btn--outline">Electronics</Link>
              <Link to="/category/fashion" className="btn btn--outline">Fashion</Link>
              <Link to="/category/watches" className="btn btn--outline">Watches</Link>
              <Link to="/category/all" className="btn btn--primary">All Products</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
