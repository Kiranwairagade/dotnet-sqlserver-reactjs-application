import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../../services/productService';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
      
      // Set the first image as main image if available
      if (productData.images && productData.images.length > 0) {
        setMainImage(productData.images[0].imageUrl);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details');
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  const changeMainImage = (imageUrl) => {
    setMainImage(imageUrl);
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-container">
        <div className="error-message">{error}</div>
        <div className="back-link">
          <Link to="/products">&larr; Back to Products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="not-found">Product not found</div>
        <div className="back-link">
          <Link to="/products">&larr; Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="details-header">
        <h2>{product.name}</h2>
        <div className="action-buttons">
          <Link to={`/products/edit/${id}`} className="edit-btn">
            Edit Product
          </Link>
          <button onClick={handleDeleteProduct} className="delete-btn">
            Delete Product
          </button>
        </div>
      </div>

      <div className="product-content">
        <div className="product-images">
          <div className="main-image">
            {mainImage ? (
              <img src={mainImage} alt={product.name} />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${mainImage === image.imageUrl ? 'active' : ''}`}
                  onClick={() => changeMainImage(image.imageUrl)}
                >
                  <img src={image.imageUrl} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="info-section">
            <h3>Product Information</h3>
            <div className="info-row">
              <span className="label">ID:</span>
              <span>{product.id}</span>
            </div>
            <div className="info-row">
              <span className="label">Price:</span>
              <span className="price">${product.price.toFixed(2)}</span>
            </div>
            {product.discountPrice && (
              <div className="info-row">
                <span className="label">Discount Price:</span>
                <span className="discount-price">${product.discountPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Stock:</span>
              <span className={`stock ${product.stockQuantity < 10 ? 'low-stock' : ''}`}>
                {product.stockQuantity} {product.stockQuantity < 10 && '(Low Stock)'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Category:</span>
              <span>{product.category ? product.category.name : 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="label">Created:</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Last Updated:</span>
              <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Description</h3>
            <p className="description">{product.description || 'No description available.'}</p>
          </div>
        </div>
      </div>
      
      <div className="back-link">
        <Link to="/products">&larr; Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetails;