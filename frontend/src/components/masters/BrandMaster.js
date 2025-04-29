import React, { useEffect, useState } from 'react';
import {
  getAllBrands,
  addBrand,
  deleteBrand,
  updateBrand,
} from '../../services/brandService';
import PermissionCheck from '../common/PermissionCheck';
import './BrandMaster.css';

const BrandMaster = () => {
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to load brands');
      setBrands([]); // fallback if error occurs
      setIsLoading(false);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      alert('Brand name is required!');
      return;
    }

    try {
      const added = await addBrand({
        brandName: newBrandName,
        description: newBrandDescription,
      });

      if (added) {
        setNewBrandName('');
        setNewBrandDescription('');
        loadBrands();
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You do not have permission to add brands.');
      } else {
        console.error('Error adding brand:', error);
        alert('Failed to add brand. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
        loadBrands();
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('You do not have permission to delete brands.');
        } else {
          console.error('Error deleting brand:', error);
          alert('Failed to delete brand. Please try again.');
        }
      }
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.brandId);
    setEditedName(brand.brandName); // Using brandName property
    setEditedDescription(brand.description || '');
  };

  const handleUpdate = async (id) => {
    if (!editedName.trim()) {
      alert('Brand name is required!');
      return;
    }

    try {
      const updated = await updateBrand(id, {
        brandName: editedName,
        description: editedDescription,
      });

      if (updated) {
        setEditingId(null);
        loadBrands();
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You do not have permission to update brands.');
      } else {
        console.error('Error updating brand:', error);
        alert('Failed to update brand. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const permissionDeniedMessage = (action) => (
    <div className="permission-denied">
      <p>You don't have permission to {action} brands.</p>
    </div>
  );

  return (
    <div className="brand-management-container">
      <div className="brand-management-header">
        <h1>Brand Master</h1>
        <PermissionCheck 
          moduleName="brands" 
          action="create"
          fallback={permissionDeniedMessage('add')}
        >
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
        </PermissionCheck>
      </div>

      <div className="brand-table">
        {isLoading ? (
          <p>Loading brands...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
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
                        brand.brandName // Using brandName property
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
                            <PermissionCheck moduleName="brands" action="edit">
                              <button className="edit-btn" onClick={() => handleUpdate(brand.brandId)}>Save</button>
                            </PermissionCheck>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <PermissionCheck moduleName="brands" action="edit">
                              <button className="edit-btn" onClick={() => handleEdit(brand)}>Edit</button>
                            </PermissionCheck>
                            <PermissionCheck moduleName="brands" action="delete">
                              <button className="delete-btn" onClick={() => handleDelete(brand.brandId)}>Delete</button>
                            </PermissionCheck>
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
        )}
      </div>
    </div>
  );
};

export default BrandMaster;