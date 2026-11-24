import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Plus, Edit2, Trash2, LogOut, Eye, RefreshCw, Lock, Package, TrendingUp, Star, Upload, Image as ImageIcon } from 'lucide-react';

// Admin Login Form
const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = onLogin(password);
      if (!success) {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
      <div className="admin-login">
        <div className="admin-login__icon"><Lock size={32} /></div>
        <h2 className="admin-login__title">EKE Admin Panel</h2>
        <p className="admin-login__subtitle">Restricted access. Authorised personnel only.</p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="admin-login__input"
            autoFocus
            required
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>
        <Link to="/" className="admin-login__back">← Back to EKE Store</Link>
      </div>
    </main>
  );
};

// Compress uploaded image to fit cleanly in localStorage
const compressImageFile = (file, maxSize = 600, quality = 0.72) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

// Product Form Modal
const ProductFormModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product || {
    name: '', category: 'electronics', price: '', originalPrice: '',
    discount: 0, rating: 4.5, reviews: 100, image: '', description: '',
    features: '', affiliateUrl: '', trending: false, featured: false, tags: ''
  });
  const [imageError, setImageError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'image') setImageError(false);
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageError(false);
    try {
      const dataUrl = await compressImageFile(file);
      setForm(prev => ({ ...prev, image: dataUrl }));
    } catch {
      setImageError(true);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image.trim()) {
      setImageError(true);
      return;
    }
    const processed = {
      ...form,
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || null,
      discount: parseInt(form.discount, 10) || 0,
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews, 10) || 0,
      features: typeof form.features === 'string'
        ? form.features.split('\n').filter(Boolean)
        : form.features || [],
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : form.tags || [],
      images: [form.image].filter(Boolean),
    };
    onSave(processed);
  };

  const looksLikeWebpage = form.image && /unsplash\.com\/photos\//i.test(form.image);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button type="button" className="modal__close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Wireless Earbuds" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="shoes">Shoes</option>
                <option value="watches">Watches</option>
                <option value="home">Home & Living</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (USD) *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="29.99" />
            </div>
            <div className="form-group">
              <label>Original Price (USD)</label>
              <input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleChange} placeholder="59.99" />
            </div>
            <div className="form-group">
              <label>Discount %</label>
              <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="50" />
            </div>
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Number of Reviews</label>
              <input name="reviews" type="number" value={form.reviews} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image * (Upload from Phone or Paste Direct Image URL)</label>
            <div className="image-upload-row">
              <label className="btn btn--outline image-upload-btn">
                <Upload size={16} />
                {uploadingImage ? 'Processing...' : 'Upload from Phone / Device'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <input
                name="image"
                value={form.image.startsWith('data:') ? '' : form.image}
                onChange={handleChange}
                placeholder={form.image.startsWith('data:') ? 'Uploaded image ready (or paste URL to replace)' : 'https://images.unsplash.com/photo-...'}
                style={{ flex: 1, minWidth: '200px' }}
              />
            </div>
            {looksLikeWebpage && (
              <p className="form-hint form-hint--error">
                That looks like an Unsplash webpage link (`unsplash.com/photos/...`), not a direct image URL. Long-press the photo and choose "Copy Image Address" (starts with `images.unsplash.com/photo-...`) or upload the photo from your phone above.
              </p>
            )}
            {imageError && !looksLikeWebpage && (
              <p className="form-hint form-hint--error">
                Image could not load. Please upload a photo from your device or paste a direct image URL ending in `.jpg`, `.png`, `.webp`, or from `images.unsplash.com`.
              </p>
            )}
            {form.image && (
              <div className="image-preview-box">
                <img
                  src={form.image}
                  alt="Product preview"
                  onLoad={() => setImageError(false)}
                  onError={() => setImageError(true)}
                />
                <div className="image-preview-meta">
                  <span><ImageIcon size={14} /> {form.image.startsWith('data:') ? 'Uploaded from device' : 'External image URL'}</span>
                  <button
                    type="button"
                    className="image-preview-clear"
                    onClick={() => { setForm(prev => ({ ...prev, image: '' })); setImageError(false); }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>AliExpress Affiliate URL *</label>
            <input name="affiliateUrl" value={form.affiliateUrl} onChange={handleChange} required placeholder="https://www.aliexpress.com/item/...?aff_fcid=YOUR_ID" />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} placeholder="Product description (optional)..." />
          </div>
          <div className="form-group">
            <label>Features (one per line)</label>
            <textarea name="features" value={typeof form.features === 'object' ? form.features.join('\n') : form.features} onChange={handleChange} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input name="tags" value={typeof form.tags === 'object' ? form.tags.join(', ') : form.tags} onChange={handleChange} placeholder="electronics, wireless, premium" />
          </div>
          <div className="form-group form-group--checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} />
              Mark as Trending 🔥
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Mark as Featured ⭐
            </label>
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">{product ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct, deleteProducts, logout, resetProducts, storageError, clearStorageError } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQ.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every(p => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filtered.map(p => p.id));
      setSelectedIds(prev => prev.filter(id => !filteredSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filtered.map(p => p.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const stats = {
    total: products.length,
    featured: products.filter(p => p.featured).length,
    trending: products.filter(p => p.trending).length,
    categories: [...new Set(products.map(p => p.category))].length,
  };

  const handleSave = (productData) => {
    if (editProduct) {
      updateProduct(editProduct.id, productData);
      showToast(`Updated "${productData.name}"`);
      setEditProduct(null);
    } else {
      addProduct(productData);
      setSearchQ('');
      setCategoryFilter('all');
      showToast(`Added "${productData.name}"`);
      setShowAddModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const deletedName = deleteConfirm.name;
    const deletedId = deleteConfirm.id;
    deleteProduct(deletedId);
    setSelectedIds(prev => prev.filter(id => id !== deletedId));
    setDeleteConfirm(null);
    showToast(`Deleted "${deletedName}"`);
  };

  const handleConfirmBulkDelete = () => {
    const count = selectedIds.length;
    deleteProducts(selectedIds);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
    showToast(`Deleted ${count} product${count === 1 ? '' : 's'}`);
  };

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">🛠️ EKE Admin Panel</h1>
            <p className="admin-page__subtitle">Manage your product catalogue</p>
          </div>
          <div className="admin-page__header-actions">
            <Link to="/" target="_blank" className="btn btn--outline" style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              <Eye size={16} /> View Store
            </Link>
            <button type="button" className="btn btn--outline" onClick={() => { if(window.confirm('Reset all products to defaults?')) { resetProducts(); setSelectedIds([]); showToast('Products reset to defaults'); } }} title="Reset to defaults">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="btn btn--outline" onClick={logout} style={{ color: '#e53e3e', borderColor: '#e53e3e' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {storageError && (
          <div style={{
            background: '#FFF5F5', color: '#C53030', padding: '12px 18px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
            fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: '1px solid #FEB2B2'
          }}>
            <span>⚠️ {storageError}</span>
            <button type="button" onClick={clearStorageError} style={{ color: '#C53030', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        )}

        {toast && (
          <div style={{
            background: '#111', color: '#fff', padding: '12px 18px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
            fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: '4px solid #FF6B2B'
          }}>
            <span>{toast}</span>
            <button type="button" onClick={() => setToast('')} style={{ color: '#aaa', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <Package size={24} />
            <div>
              <span className="admin-stat-num">{stats.total}</span>
              <span className="admin-stat-label">Total Products</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <Star size={24} />
            <div>
              <span className="admin-stat-num">{stats.featured}</span>
              <span className="admin-stat-label">Featured</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <TrendingUp size={24} />
            <div>
              <span className="admin-stat-num">{stats.trending}</span>
              <span className="admin-stat-label">Trending</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <Package size={24} />
            <div>
              <span className="admin-stat-num">{stats.categories}</span>
              <span className="admin-stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="admin-controls">
          <div className="admin-controls__search-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="admin-controls__search"
            />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="admin-controls__select">
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="shoes">Shoes</option>
              <option value="watches">Watches</option>
              <option value="home">Home & Living</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {selectedIds.length > 0 && (
              <button
                type="button"
                className="btn"
                style={{ background: '#e53e3e', color: 'white' }}
                onClick={() => setBulkDeleteConfirm(true)}
              >
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </button>
            )}
            <button type="button" className="btn btn--primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all products"
                    style={{ accentColor: '#FF6B2B', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Rating</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelectOne(p.id)}
                      aria-label={`Select ${p.name}`}
                      style={{ accentColor: '#FF6B2B', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="admin-table__thumb"
                      onError={e => { e.target.src = 'https://via.placeholder.com/50x50?text=EKE'; }}
                    />
                  </td>
                  <td className="admin-table__name">{p.name}</td>
                  <td><span className="admin-table__cat">{p.category}</span></td>
                  <td><strong>${p.price}</strong></td>
                  <td><span className="admin-table__discount">-{p.discount}%</span></td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    {p.featured && <span className="admin-badge admin-badge--featured">Featured</span>}
                    {p.trending && <span className="admin-badge admin-badge--trending">Trending</span>}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <a href={`/product/${p.id}`} target="_blank" rel="noreferrer" className="admin-btn" title="View">
                        <Eye size={15} />
                      </a>
                      <button type="button" className="admin-btn admin-btn--edit" onClick={() => setEditProduct(p)} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button type="button" className="admin-btn admin-btn--delete" onClick={() => setDeleteConfirm(p)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductFormModal
          onSave={handleSave}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <ProductFormModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal--small" onClick={e => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"? This cannot be undone.</p>
            <div className="modal__actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button type="button" className="btn" style={{ background: '#e53e3e', color: 'white' }} onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirm */}
      {bulkDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="modal modal--small" onClick={e => e.stopPropagation()}>
            <h3>Delete {selectedIds.length} Products?</h3>
            <p>Are you sure you want to delete the <strong>{selectedIds.length}</strong> selected products? This cannot be undone.</p>
            <div className="modal__actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn--outline" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button type="button" className="btn" style={{ background: '#e53e3e', color: 'white' }} onClick={handleConfirmBulkDelete}>
                Delete All Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Admin Page — requires auth
const AdminPage = () => {
  const { isAuthenticated, login } = useAdmin();
  if (!isAuthenticated) return <LoginForm onLogin={login} />;
  return <AdminDashboard />;
};

export default AdminPage;
