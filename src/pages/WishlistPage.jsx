import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { products } = useAdmin();
  const { wishlist } = useCart();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <main className="category-page">
      <div className="category-page__header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Wishlist</span>
          </div>
          <h1 className="category-page__title">
            <Heart size={28} /> My Wishlist
          </h1>
          <p className="category-page__count">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        {wishlistProducts.length > 0 ? (
          <div className="product-grid">
            {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">💝</span>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love by clicking the heart icon on any product.</p>
            <Link to="/category/all" className="btn btn--primary">Start Browsing</Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
