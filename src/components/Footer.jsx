import React from 'react';
import OasisLogo from './Logo';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';
import { Shield, Info, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Affiliate Disclosure Banner */}
      <div className="footer__disclosure">
        <div className="container">
          <div className="footer__disclosure-inner">
            <Info size={16} />
            <p>
              <strong>Affiliate Disclosure:</strong> OASIS participates in the AliExpress affiliate programme. 
              When you click "Buy Now" and make a purchase, we may earn a commission at no additional cost to you. 
              This helps us keep the site free and running. All prices shown are as listed on AliExpress at time of display.
            </p>
          </div>
        </div>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <OasisLogo size="md" />
              <p className="footer__brand-desc">
                OASIS is your premium international shopping destination. 
                We curate the best products from AliExpress so you can discover more and shop smarter.
              </p>
              <div className="footer__trust">
                <Shield size={14} /> <span>Secure Affiliate Links</span>
              </div>
            </div>

            {/* Categories */}
            <div className="footer__col">
              <h4 className="footer__heading">Categories</h4>
              <ul className="footer__list">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.id}`} className="footer__link">
                      {cat.icon} {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer__col">
              <h4 className="footer__heading">Quick Links</h4>
              <ul className="footer__list">
                <li><Link to="/" className="footer__link">Home</Link></li>
                <li><Link to="/category/trending" className="footer__link">Trending Products</Link></li>
                <li><Link to="/deals" className="footer__link">Today's Deals</Link></li>
                <li><Link to="/wishlist" className="footer__link">My Wishlist</Link></li>
                <li><Link to="/affiliate-disclosure" className="footer__link">Affiliate Disclosure</Link></li>
                <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* About */}
            <div className="footer__col">
              <h4 className="footer__heading">About OASIS</h4>
              <ul className="footer__list">
                <li><Link to="/about" className="footer__link">About Us</Link></li>
                <li>
                  <a href="https://www.aliexpress.com" target="_blank" rel="noopener noreferrer" className="footer__link">
                    Shop on AliExpress <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} OASIS — Discover More. Shop Smarter. All rights reserved.</p>
          <p className="footer__bottom-note">An independent affiliate marketplace. Not affiliated with AliExpress or Alibaba Group.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
