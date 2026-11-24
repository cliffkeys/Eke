import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const AdminContext = createContext(null);

const ADMIN_PASSWORD = 'eke-admin-2024'; // Change this in production!
const STORAGE_KEY = 'eke_products';
const AUTH_KEY = 'eke_admin_auth';

const saveProductsToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return { ok: true };
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
    return { ok: false, error: err?.message || 'Storage quota exceeded' };
  }
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [storageError, setStorageError] = useState('');

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to initialProducts if storage is corrupted
    }
    saveProductsToStorage(initialProducts);
    return initialProducts;
  });

  // Sync changes across open browser tabs (e.g. Admin tab -> Storefront tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {
          // Ignore malformed storage data
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const res = saveProductsToStorage(products);
    if (!res.ok) {
      setStorageError('Browser storage is full. Please delete unused products or use smaller images.');
    } else {
      setStorageError('');
    }
  }, [products]);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => {
      const next = [newProduct, ...prev];
      const res = saveProductsToStorage(next);
      if (!res.ok) {
        setStorageError('Browser storage is full. Try a smaller image or delete old items.');
      }
      return next;
    });
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => {
      const next = prev.map(p => String(p.id) === String(id) ? { ...p, ...updates } : p);
      saveProductsToStorage(next);
      return next;
    });
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const next = prev.filter(p => String(p.id) !== String(id));
      saveProductsToStorage(next);
      return next;
    });
  };

  const deleteProducts = (ids) => {
    const idSet = new Set(ids.map(String));
    setProducts(prev => {
      const next = prev.filter(p => !idSet.has(String(p.id)));
      saveProductsToStorage(next);
      return next;
    });
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    saveProductsToStorage(initialProducts);
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct, deleteProducts, resetProducts,
      storageError, clearStorageError: () => setStorageError('')
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
