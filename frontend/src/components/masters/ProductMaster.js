// ProductMaster.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/productService';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Search, PlusCircle, Eye, Edit2, Trash2, Save, X } from 'lucide-react';
import './ProductMaster.css';

const ProductMaster = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    description: '',
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts(currentPage, searchTerm, pageSize, sortField, sortDirection);

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

  const handleAddNewClick = () => {
    setCurrentProduct({
      id: null,
      name: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      description: '',
      imageUrl: '',
    });
    setIsEditing(false);
    setShowProductForm(true);
    setFormErrors({});
  };

  const handleEditProduct = (product) => {
    setCurrentProduct({ ...product });
    setIsEditing(true);
    setShowProductForm(true);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert numeric fields
    if (name === 'price' || name === 'stockQuantity') {
      processedValue = name === 'price' ? parseFloat(value) : parseInt(value, 10);
    }
    
    setCurrentProduct({
      ...currentProduct,
      [name]: processedValue,
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!currentProduct.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!currentProduct.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (isNaN(currentProduct.price) || currentProduct.price < 0) {
      errors.price = 'Price must be a valid number greater than or equal to 0';
    }
    
    if (isNaN(currentProduct.stockQuantity) || currentProduct.stockQuantity < 0) {
      errors.stockQuantity = 'Stock quantity must be a valid number greater than or equal to 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await updateProduct(currentProduct.id, currentProduct);
      } else {
        await createProduct(currentProduct);
      }
      
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setError(`Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setIsSaving(false);
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

  const renderProductForm = () => {
    return (
      <div className="product-form-overlay">
        <div className="product-form-container">
          <div className="product-form-header">
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <button 
              className="close-form-btn" 
              onClick={() => setShowProductForm(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentProduct.name}
                onChange={handleFormChange}
                placeholder="Enter product name"
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={currentProduct.category}
                onChange={handleFormChange}
                placeholder="Enter category"
              />
              {formErrors.category && <span className="error-message">{formErrors.category}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                />
                {formErrors.price && <span className="error-message">{formErrors.price}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={currentProduct.stockQuantity}
                  onChange={handleFormChange}
                  step="1"
                  min="0"
                />
                {formErrors.stockQuantity && <span className="error-message">{formErrors.stockQuantity}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={currentProduct.description}
                onChange={handleFormChange}
                placeholder="Enter product description"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={currentProduct.imageUrl}
                onChange={handleFormChange}
                placeholder="Enter image URL"
              />
            </div>
            
            {currentProduct.imageUrl && (
              <div className="image-preview">
                <p>Image Preview:</p>
                <img src={currentProduct.imageUrl} alt="Product preview" />
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowProductForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : (
                  <>
                    <Save size={16} />
                    <span>{isEditing ? 'Update Product' : 'Create Product'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="product-management-container">
      <div className="product-management-header">
        <h1>Product Management</h1>
        <button onClick={handleAddNewClick} className="add-product-btn">
          <PlusCircle size={20} />
          <span>Add New Product</span>
        </button>
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
                      <button 
                        className="view-btn" 
                        title="View Details"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="edit-btn" 
                        title="Edit Product"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit2 size={16} />
                      </button>
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

      {showProductForm && renderProductForm()}
    </div>
  );
};

export default ProductMaster;