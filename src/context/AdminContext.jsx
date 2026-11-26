import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProducts from '../data/products.json';

const AdminContext = createContext(null);

const ADMIN_PASSWORD = 'oasis-admin-2024'; // Change this in production!
const STORAGE_KEY = 'oasis_products';
const DIRTY_KEY = 'oasis_admin_dirty';
const AUTH_KEY = 'oasis_admin_auth';

const encodeUtf8Base64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const saveDraftToStorage = (items, isDirty = true) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(DIRTY_KEY, isDirty ? 'true' : 'false');
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

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(() => {
    try {
      return localStorage.getItem(DIRTY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [storageError, setStorageError] = useState('');

  // Regular visitors always see the latest published catalog (products.json).
  // Only load localStorage draft when there are unpublished admin edits.
  const [products, setProducts] = useState(() => {
    try {
      const isDirty = localStorage.getItem(DIRTY_KEY) === 'true';
      if (isDirty) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {
      // Fallback to published catalog
    }
    return initialProducts;
  });

  // Sync unpublished draft changes across open tabs on the same browser
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        try {
          const isDirty = localStorage.getItem(DIRTY_KEY) === 'true';
          if (isDirty) {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) setProducts(parsed);
          } else {
            setProducts(initialProducts);
          }
          setHasUnpublishedChanges(isDirty);
        } catch {
          // Ignore malformed storage data
        }
      } else if (e.key === DIRTY_KEY && e.newValue === 'false') {
        setHasUnpublishedChanges(false);
        setProducts(initialProducts);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persistDraft = (nextProducts) => {
    const res = saveDraftToStorage(nextProducts, true);
    setHasUnpublishedChanges(true);
    if (!res.ok) {
      setStorageError('Browser storage is full. Try a smaller image or delete old items.');
    } else {
      setStorageError('');
    }
  };

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
      persistDraft(next);
      return next;
    });
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => {
      const next = prev.map(p => String(p.id) === String(id) ? { ...p, ...updates } : p);
      persistDraft(next);
      return next;
    });
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const next = prev.filter(p => String(p.id) !== String(id));
      persistDraft(next);
      return next;
    });
  };

  const deleteProducts = (ids) => {
    const idSet = new Set(ids.map(String));
    setProducts(prev => {
      const next = prev.filter(p => !idSet.has(String(p.id)));
      persistDraft(next);
      return next;
    });
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(DIRTY_KEY, 'false');
    } catch {
      // Ignore storage errors
    }
    setHasUnpublishedChanges(false);
    setStorageError('');
  };

  const publishToGitHub = async (token, repo = 'cliffkeys/Eke', branch = 'main') => {
    const cleanToken = (token || '').trim();
    const cleanRepo = (repo || '').trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '');
    if (!cleanToken) throw new Error('Please enter your GitHub Personal Access Token.');
    if (!cleanRepo.includes('/')) throw new Error('Repository must be in "owner/repo" format (e.g. cliffkeys/Eke).');

    const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/src/data/products.json`;
    const headers = {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    // Fetch current SHA of src/data/products.json
    let sha;
    const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
      const errBody = await getRes.json().catch(() => ({}));
      throw new Error(errBody.message || `GitHub error (${getRes.status})`);
    }

    const contentJson = JSON.stringify(products, null, 2);
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Update OASIS catalog (${products.length} products)`,
        content: encodeUtf8Base64(contentJson),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      throw new Error(errBody.message || `Failed to publish (${putRes.status})`);
    }

    try {
      localStorage.setItem(DIRTY_KEY, 'false');
    } catch {
      // Ignore storage errors
    }
    setHasUnpublishedChanges(false);
    return true;
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct, deleteProducts, resetProducts,
      hasUnpublishedChanges, publishToGitHub,
      storageError, clearStorageError: () => setStorageError('')
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
