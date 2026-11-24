import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EkeLogo from './Logo';
import { Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { wishlist } = useCart();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <EkeLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__nav">
          <Link to="/" className="navbar__link">Home</Link>
          <div className="navbar__dropdown" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="navbar__link navbar__link--btn">
              Categories <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="navbar__dropdown-menu">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <Link key={cat.id} to={`/category/${cat.id}`} className="navbar__dropdown-item" onClick={() => setCatOpen(false)}>
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/category/trending" className="navbar__link navbar__link--hot">🔥 Trending</Link>
          <Link to="/deals" className="navbar__link navbar__link--deals">⚡ Deals</Link>
        </nav>

        {/* Desktop Search */}
        <form className="navbar__search-form" onSubmit={handleSearch}>
          <div className="navbar__search-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
            <button type="submit" className="navbar__search-btn">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Icons */}
        <div className="navbar__icons">
          <Link to="/wishlist" className="navbar__icon-btn">
            <Heart size={20} fill={wishlist.length > 0 ? '#FF6B2B' : 'none'} color={wishlist.length > 0 ? '#FF6B2B' : 'currentColor'} />
            {wishlist.length > 0 && <span className="navbar__badge">{wishlist.length}</span>}
          </Link>
          <button className="navbar__icon-btn navbar__search-toggle" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} />
          </button>
          <button className="navbar__icon-btn navbar__menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="navbar__mobile-search">
          <form onSubmit={handleSearch} className="container">
            <div className="navbar__search-wrap">
              <input
                ref={searchRef}
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-btn">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <nav className="container">
            <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
            <Link to="/category/all" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>🛍️ All Products</Link>
            {categories.filter(c => c.id !== 'all').map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link to="/deals" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>⚡ Deals</Link>
            <Link to="/wishlist" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>❤️ Wishlist ({wishlist.length})</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
