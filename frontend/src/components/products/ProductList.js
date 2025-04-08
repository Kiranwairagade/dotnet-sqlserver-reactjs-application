// src/components/products/ProductList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../services/productService';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, search = searchTerm) => {
    try {
      setLoading(true);
      const response = await getAllProducts(page, search, pageSize);
      setProducts(response.products || []);
      setTotalCount(response.totalCount || 0);
      setCurrentPage(response.pageNumber || 1);
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
    fetchProducts(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, searchTerm);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts(currentPage);
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

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

      {products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.productId} 
              product={product} 
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
