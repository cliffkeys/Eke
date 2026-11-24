import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';

const DealsPage = () => {
  const { products } = useAdmin();
  const deals = [...products].sort((a, b) => b.discount - a.discount);

  return (
    <main className="category-page">
      <div className="category-page__header" style={{ background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)' }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.8)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>
            <span>/</span>
            <span>Today's Deals</span>
          </div>
          <h1 className="category-page__title" style={{ color: '#fff' }}>
            ⚡ Today's Best Deals
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            {deals.length} deals — Up to {Math.max(...deals.map(d => d.discount))}% off!
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        <div className="product-grid">
          {deals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </main>
  );
};

export default DealsPage;
