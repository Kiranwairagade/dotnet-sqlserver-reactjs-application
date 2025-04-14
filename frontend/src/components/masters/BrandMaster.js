import React, { useEffect, useState } from 'react';
import {
  getAllBrands,
  addBrand,
  deleteBrand,
  updateBrand,
} from '../../services/brandService';
import './BrandMaster.css';

const BrandMaster = () => {
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await getAllBrands();
      console.log('Fetched brands:', data);

      // Assuming data is an array of brands directly or in a wrapper
      if (Array.isArray(data)) {
        setBrands(data);
      } else if (Array.isArray(data?.$values)) {
        setBrands(data.$values);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]); // fallback if error occurs
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;

    const added = await addBrand({
      brandName: newBrandName,
      description: newBrandDescription,
    });

    if (added) {
      setNewBrandName('');
      setNewBrandDescription('');
      loadBrands();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(id);
      loadBrands();
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.brandId);
    setEditedName(brand.brandName); // Updated from 'name' to 'brandName'
    setEditedDescription(brand.description || '');
  };

  const handleUpdate = async (id) => {
    const updated = await updateBrand(id, {
      brandName: editedName,
      description: editedDescription,
    });

    if (updated) {
      setEditingId(null);
      loadBrands();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="brand-management-container">
      <div className="brand-management-header">
        <h1>Brand Master</h1>
        <div className="add-brand-section">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Brand name"
          />
          <input
            type="text"
            value={newBrandDescription}
            onChange={(e) => setNewBrandDescription(e.target.value)}
            placeholder="Brand description"
          />
          <button onClick={handleAddBrand} className="add-brand-btn">
            Add
          </button>
        </div>
      </div>

      <div className="brand-table">
        <table>
          <thead>
            <tr>
              <th>Brand ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(brands) && brands.length > 0 ? (
              brands.map((brand) => (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>
                    {editingId === brand.brandId ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      brand.brandName // Updated from 'name' to 'brandName'
                    )}
                  </td>
                  <td>
                    {editingId === brand.brandId ? (
                      <input
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    ) : (
                      brand.description || '-'
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {editingId === brand.brandId ? (
                        <>
                          <button className="edit-btn" onClick={() => handleUpdate(brand.brandId)}>Save</button>
                          <button className="delete-btn" onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(brand)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(brand.brandId)}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No brands found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandMaster;
