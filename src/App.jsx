import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import DealsPage from './pages/DealsPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage, { AffiliateDisclosurePage, PrivacyPage, AboutPage } from './pages/StaticPages';
import './styles/main.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/eke-admin');
  return (
    <div className="app">
      {!isAdmin && <Navbar />}
      <div className={`app__main${!isAdmin ? ' app__main--with-nav' : ''}`}>
        {children}
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/eke-admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
