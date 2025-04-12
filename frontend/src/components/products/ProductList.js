import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, search = searchTerm, categoryId = categoryFilter) => {
    try {
      setLoading(true);
      const response = await getProducts({
        page,
        search,
        categoryId,
        pageSize
      });
      
      setProducts(response.items || []);
      setTotalCount(response.totalCount || 0);
      setCurrentPage(response.currentPage || 1);
      
      // Extract unique categories if not already loaded
      if (categories.length === 0 && response.items && response.items.length > 0) {
        const uniqueCategories = [];
        const categoryIds = new Set();
        
        response.items.forEach(product => {
          if (product.category && !categoryIds.has(product.category.id)) {
            categoryIds.add(product.category.id);
            uniqueCategories.push(product.category);
          }
        });
        
        setCategories(uniqueCategories);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(newPage, searchTerm, categoryFilter);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, searchTerm, categoryFilter);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setCategoryFilter(categoryId);
    fetchProducts(1, searchTerm, categoryId);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Refresh the current page
        fetchProducts(currentPage, searchTerm, categoryFilter);
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    fetchProducts(1, '', '');
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <button 
          className="add-product-btn"
          onClick={() => navigate('/products/new')}
        >
          Add New Product
        </button>
      </div>

      <div className="filters-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="category-filter">
          <select 
            value={categoryFilter} 
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {(searchTerm || categoryFilter) && (
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="loading-more">Loading more products...</div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            First
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Last
          </button>
        </div>
      )}
      
      <div className="results-info">
        Showing {products.length} of {totalCount} products
      </div>
    </div>
  );
};

export default ProductList;