import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../services/categoryService';
import './CategoryMaster.css';

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAllCategories();
    console.log('Fetched categories:', data);

    // Ensure data is an array before setting it
    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data?.categories && Array.isArray(data.categories)) {
      setCategories(data.categories);
    } else {
      setCategories([]); // fallback
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const added = await addCategory({
      categoryName: newCategoryName,
      description: newCategoryDescription,
    });

    if (added) {
      setNewCategoryName('');
      setNewCategoryDescription('');
      loadCategories();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.categoryId);
    setEditedName(cat.name);
    setEditedDescription(cat.description || '');
  };

  const handleUpdate = async (id) => {
    const updated = await updateCategory(id, {
      categoryName: editedName,
      description: editedDescription,
    });

    if (updated) {
      setEditingId(null);
      loadCategories();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="category-management-container">
      <div className="category-management-header">
        <h1>Category Master</h1>
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
      </div>

      <div className="category-table">
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
            {Array.isArray(categories) && categories.map((cat) => (
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
                        <button className="edit-btn" onClick={() => handleUpdate(cat.categoryId)}>Save</button>
                        <button className="delete-btn" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(cat)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(cat.categoryId)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryMaster;
