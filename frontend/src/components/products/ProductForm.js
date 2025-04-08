import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getProductCategories } from '../../services/productService';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getProductCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price.toString(),
        stockQuantity: productData.stockQuantity.toString(),
        categoryId: productData.categoryId.toString(),
        images: productData.images || []
      });
      
      // Set preview images from existing product images
      if (productData.images && productData.images.length > 0) {
        setPreviewImages(productData.images.map(img => img.imageUrl));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      formErrors.name = 'Product name is required';
      isValid = false;
    }
    
    if (!formData.price) {
      formErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      formErrors.price = 'Price must be a positive number';
      isValid = false;
    }
    
    if (!formData.stockQuantity) {
      formErrors.stockQuantity = 'Stock quantity is required';
      isValid = false;
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      formErrors.stockQuantity = 'Stock must be a non-negative number';
      isValid = false;
    }
    
    if (!formData.categoryId) {
      formErrors.categoryId = 'Category is required';
      isValid = false;
    }
    
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('price', formData.price);
      productFormData.append('stockQuantity', formData.stockQuantity);
      productFormData.append('categoryId', formData.categoryId);
      
      // Append files if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          productFormData.append('images', file);
        });
      }
      
      if (isEditMode) {
        await updateProduct(id, productFormData);
      } else {
        await createProduct(productFormData);
      }
      
      setLoading(false);
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-form-container">
      <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)*</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="stockQuantity">Stock Quantity*</label>
            <input
              type="text"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className={errors.stockQuantity ? 'error' : ''}
            />
            {errors.stockQuantity && <div className="error-message">{errors.stockQuantity}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="categoryId">Category*</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={errors.categoryId ? 'error' : ''}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="images">Product Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          
          {previewImages.length > 0 && (
            <div className="image-preview-container">
              {previewImages.map((src, index) => (
                <div key={index} className="image-preview">
                  <img src={src} alt={`Preview ${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;