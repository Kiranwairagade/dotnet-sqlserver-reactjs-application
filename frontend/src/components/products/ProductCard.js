// src/components/products/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.primaryImageUrl || '/placeholder-product.png'} 
          alt={product.productName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-product.png';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.productName}</h3>
        <p className="product-description">{product.description.substring(0, 100)}...</p>
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
          <span>Category: {product.categoryName}</span>
        </div>
        <div className="product-stock">
          <span>{product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}</span>
        </div>
      </div>
      <div className="product-actions">
        <button onClick={() => navigate(`/products/${product.productId}`)} className="view-btn">
          View Details
        </button>
        <button onClick={() => navigate(`/products/edit/${product.productId}`)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(product.productId)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;