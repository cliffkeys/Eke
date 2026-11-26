// OASIS Product Catalog & Categories
import productsData from './products.json';

export const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'watches', name: 'Watches', icon: '⌚' },
  { id: 'home', name: 'Home & Living', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
];

export const products = productsData;

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getTrendingProducts = () => products.filter(p => p.trending);
export const getProductsByCategory = (category) => {
  if (category === 'all') return products;
  if (category === 'trending') return getTrendingProducts();
  return products.filter(p => p.category === category);
};
export const getProductById = (id) => products.find(p => p.id === parseInt(id));
export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q) ||
    (Array.isArray(p.tags) && p.tags.some(t => t.includes(q))) ||
    (p.category || '').toLowerCase().includes(q)
  );
};
