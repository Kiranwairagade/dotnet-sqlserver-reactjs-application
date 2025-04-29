import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../services/categoryService';
import PermissionCheck from '../common/PermissionCheck';
import './CategoryMaster.css';

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllCategories();
      console.log('Fetched categories:', data);

      if (Array.isArray(data?.$values)) {
        setCategories(data.$values);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError('Failed to load categories');
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('You do not have permission to view categories');
      } else {
        console.error('Error loading categories:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const added = await addCategory({
        categoryName: newCategoryName,
        description: newCategoryDescription,
      });

      if (added) {
        setNewCategoryName('');
        setNewCategoryDescription('');
        loadCategories();
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You do not have permission to add categories.');
      } else {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('You do not have permission to delete categories.');
        } else {
          console.error('Error deleting category:', error);
        }
      }
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.categoryId);
    setEditedName(cat.name);
    setEditedDescription(cat.description || '');
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateCategory(id, {
        categoryName: editedName,
        description: editedDescription,
      });

      if (updated) {
        setEditingId(null);
        loadCategories();
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You do not have permission to update categories.');
      } else {
        console.error('Error updating category:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const permissionDeniedMessage = (action) => (
    <div className="permission-denied">
      <p>You don't have permission to {action} categories.</p>
    </div>
  );

  return (
    <div className="category-management-container">
      <div className="category-management-header">
        <h1>Category Master</h1>
        <PermissionCheck 
          moduleName="categories" 
          action="create"
          fallback={permissionDeniedMessage('add')}
        >
          <div className="add-category-section">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
            />
            <input
              type="text"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Category description"
            />
            <button onClick={handleAddCategory} className="add-category-btn">
              Add
            </button>
          </div>
        </PermissionCheck>
      </div>

      <div className="category-table">
        {isLoading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td>{cat.categoryId}</td>
                    <td>
                      {editingId === cat.categoryId ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td>
                      {editingId === cat.categoryId ? (
                        <input
                          type="text"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                        />
                      ) : (
                        cat.description || '-'
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingId === cat.categoryId ? (
                          <>
                            <PermissionCheck moduleName="categories" action="edit">
                              <button className="edit-btn" onClick={() => handleUpdate(cat.categoryId)}>Save</button>
                            </PermissionCheck>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <PermissionCheck moduleName="categories" action="edit">
                              <button className="edit-btn" onClick={() => handleEdit(cat)}>Edit</button>
                            </PermissionCheck>
                            <PermissionCheck moduleName="categories" action="delete">
                              <button className="delete-btn" onClick={() => handleDelete(cat.categoryId)}>Delete</button>
                            </PermissionCheck>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryMaster;