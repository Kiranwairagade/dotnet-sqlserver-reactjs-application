import React, { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';
import './ProductMaster.css';

const ProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newStock, setNewStock] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedStock, setEditedStock] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      console.log('Products data received:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Normalize product data to ensure consistent property names
        const normalizedProducts = data.map(product => ({
          productId: product.productId || product.ProductId || product.id || product.Id,
          name: product.name || product.Name,
          price: product.price || product.Price,
          category: product.category || product.Category,
          stock: product.stock || product.Stock
        }));
        
        console.log('Normalized products:', normalizedProducts);
        setProducts(normalizedProducts);
      } else {
        console.warn('No products found or invalid data format:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products: ' + (error.message || 'Unknown error'));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (
      !newName.trim() ||
      !newPrice.trim() ||
      !newCategory.trim() ||
      !newStock.trim()
    ) {
      alert('All fields are required!');
      return;
    }

    try {
      const added = await createProduct({
        Name: newName,
        Price: parseFloat(newPrice),
        Category: newCategory,
        Stock: parseInt(newStock),
      });

      console.log('Product added:', added);
      
      if (added) {
        setNewName('');
        setNewPrice('');
        setNewCategory('');
        setNewStock('');
        await loadProducts(); // Reload the products list
      } else {
        alert('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        console.log('Product deleted, ID:', id);
        await loadProducts(); // Reload the products list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setEditingId(product.productId);
    setEditedName(product.name);
    setEditedPrice(product.price);
    setEditedCategory(product.category);
    setEditedStock(product.stock);
  };

  const handleUpdate = async (id) => {
    if (
      !editedName.trim() ||
      !editedPrice ||
      !editedCategory.trim() ||
      !editedStock
    ) {
      alert('All fields are required!');
      return;
    }

    try {
      const updatedData = {
        Name: editedName,
        Price: parseFloat(editedPrice),
        Category: editedCategory,
        Stock: parseInt(editedStock),
      };
      
      console.log('Updating product:', id, updatedData);
      const updated = await updateProduct(id, updatedData);

      if (updated) {
        console.log('Product updated:', updated);
        setEditingId(null);
        await loadProducts(); // Reload the products list
      } else {
        alert('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // Check if the products array contains valid data
  const hasValidData = products && products.length > 0 && products[0].productId;

  return (
    <div className="product-management-container">
      <div className="product-management-header">
        <h1>Product Master</h1>
        <div className="add-product-section">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product Name"
          />
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price"
            step="0.01"
          />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category"
          />
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Stock"
          />
          <button onClick={handleAddProduct} className="add-product-btn">
            Add
          </button>
        </div>
      </div>

      <div className="product-table">
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : !hasValidData ? (
          <p>No products found. Add your first product above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>
                    {editingId === product.productId ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editingId === product.productId ? (
                      <input
                        type="number"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        step="0.01"
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td>
                    {editingId === product.productId ? (
                      <input
                        type="text"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td>
                    {editingId === product.productId ? (
                      <input
                        type="number"
                        value={editedStock}
                        onChange={(e) => setEditedStock(e.target.value)}
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td>
                    {editingId === product.productId ? (
                      <>
                        <button
                          onClick={() => handleUpdate(product.productId)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductMaster;