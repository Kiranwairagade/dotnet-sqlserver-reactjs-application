import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { Link } from 'react-router-dom';
import { AlertCircle, Search, PlusCircle, Eye, Edit2, Trash2 } from 'lucide-react';
import './ProductMaster.css';

const ProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Changed from getAllProducts to getProducts to match your service export
      const response = await getProducts(currentPage, searchTerm, pageSize, sortField, sortDirection);

      // Make sure the response structure matches what your API returns
      const { products = [], totalCount = 0 } = response;
      setProducts(products);
      setTotalPages(Math.ceil(totalCount / pageSize));
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on search
    fetchProducts();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for a new sort field
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsDeleting(true);
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="pagination-btn first-page"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn prev-page"
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {startPage > 1 && <span className="ellipsis">...</span>}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`page-number ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && <span className="ellipsis">...</span>}
        </div>
        
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn next-page"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn last-page"
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="product-management-container">
      <div className="product-management-header">
        <h1>Product Management</h1>
        <Link to="/products/new" className="add-product-btn">
          <PlusCircle size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="search-and-filter">
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search products by name, category, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </form>
        
        <div className="filter-controls">
          <select 
            value={pageSize} 
            onChange={(e) => {
              setCurrentPage(1);
              // Implement pageSize change handler if needed
            }}
            className="page-size-selector"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-results">
          <p>No products found. Try adjusting your search criteria.</p>
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
                fetchProducts();
              }}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="product-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable-header">
                    ID {renderSortIndicator('id')}
                  </th>
                  <th>Image</th>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Name {renderSortIndicator('name')}
                  </th>
                  <th onClick={() => handleSort('category')} className="sortable-header">
                    Category {renderSortIndicator('category')}
                  </th>
                  <th onClick={() => handleSort('price')} className="sortable-header">
                    Price {renderSortIndicator('price')}
                  </th>
                  <th onClick={() => handleSort('stockQuantity')} className="sortable-header">
                    Stock {renderSortIndicator('stockQuantity')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-image-cell">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-thumbnail"
                          loading="lazy"
                        />
                      ) : (
                        <div className="no-image-placeholder">No Image</div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td className="price-cell">${product.price.toFixed(2)}</td>
                    <td className="stock-cell">
                      <span className={`stock-indicator ${product.stockQuantity <= 5 ? 'low-stock' : ''}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <Link to={`/products/${product.id}`} className="view-btn" title="View Details">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/products/edit/${product.id}`} className="edit-btn" title="Edit Product">
                        <Edit2 size={16} />
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isDeleting}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <div className="pagination-info">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + products.length)} of {totalPages * pageSize} products
            </div>
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductMaster;