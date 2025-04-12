import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.images && product.images.length > 0 
            ? product.images[0].imageUrl 
            : '/placeholder-product.png'} 
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-product.png';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">
          {product.description 
            ? (product.description.length > 100 
                ? `${product.description.substring(0, 100)}...` 
                : product.description)
            : 'No description available'}
        </p>
        <div className="product-price">
          {product.discountPrice ? (
            <>
              <span className="discount-price">${product.discountPrice.toFixed(2)}</span>
              <span className="original-price">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span>
          )}
        </div>
        <div className="product-category">
          <span>Category: {product.category ? product.category.name : 'N/A'}</span>
        </div>
        <div className="product-stock">
          <span className={product.stockQuantity <= 0 ? 'out-of-stock' : ''}>
            {product.stockQuantity > 0 
              ? `In Stock (${product.stockQuantity})` 
              : 'Out of Stock'}
          </span>
        </div>
      </div>
      <div className="product-actions">
        <button onClick={() => navigate(`/products/${product.id}`)} className="view-btn">
          View Details
        </button>
        <button onClick={() => navigate(`/products/edit/${product.id}`)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;