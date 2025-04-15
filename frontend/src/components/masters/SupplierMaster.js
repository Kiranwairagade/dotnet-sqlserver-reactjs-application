import React, { useEffect, useState } from 'react';
import {
  getAllSuppliers,
  addSupplier,
  deleteSupplier,
  updateSupplier,
} from '../../services/supplierService';
import './SupplierMaster.css';

const SupplierMaster = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierAddress, setNewSupplierAddress] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllSuppliers();
      console.log('Suppliers data:', data);
      
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else {
        console.error('Expected array but got:', typeof data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError('Failed to load suppliers');
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (
      !newSupplierName.trim() ||
      !newSupplierEmail.trim() ||
      !newSupplierPhone.trim() ||
      !newSupplierAddress.trim()
    ) {
      alert('All fields are required!');
      return;
    }

    try {
      const added = await addSupplier({
        Name: newSupplierName,
        Email: newSupplierEmail,
        Phone: newSupplierPhone,
        Address: newSupplierAddress,
      });

      if (added) {
        setNewSupplierName('');
        setNewSupplierEmail('');
        setNewSupplierPhone('');
        setNewSupplierAddress('');
        loadSuppliers();
      } else {
        alert('Failed to add supplier. Please check console for details.');
      }
    } catch (error) {
      console.error('Error in handleAddSupplier:', error);
      alert('An error occurred while adding the supplier.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        loadSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier.');
      }
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.supplierId);
    setEditedName(supplier.name);
    setEditedEmail(supplier.email);
    setEditedPhone(supplier.phone);
    setEditedAddress(supplier.address);
  };

  const handleUpdate = async (id) => {
    if (
      !editedName.trim() ||
      !editedEmail.trim() ||
      !editedPhone.trim() ||
      !editedAddress.trim()
    ) {
      alert('All fields are required!');
      return;
    }

    try {
      const updated = await updateSupplier(id, {
        Name: editedName,
        Email: editedEmail,
        Phone: editedPhone,
        Address: editedAddress,
      });

      if (updated) {
        setEditingId(null);
        loadSuppliers();
      } else {
        alert('Failed to update supplier. Please check console for details.');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('An error occurred while updating the supplier.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="supplier-management-container">
      <div className="supplier-management-header">
        <h1>Supplier Master</h1>
        <div className="add-supplier-section">
          <input
            type="text"
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
            placeholder="Supplier name"
          />
          <input
            type="email"
            value={newSupplierEmail}
            onChange={(e) => setNewSupplierEmail(e.target.value)}
            placeholder="Supplier email"
          />
          <input
            type="text"
            value={newSupplierPhone}
            onChange={(e) => setNewSupplierPhone(e.target.value)}
            placeholder="Supplier phone"
          />
          <input
            type="text"
            value={newSupplierAddress}
            onChange={(e) => setNewSupplierAddress(e.target.value)}
            placeholder="Supplier address"
          />

          <button onClick={handleAddSupplier} className="add-supplier-btn">
            Add
          </button>
        </div>
      </div>

      <div className="supplier-table">
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading suppliers...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.supplierId}>
                    <td>{supplier.supplierId}</td>
                    <td>
                      {editingId === supplier.supplierId ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        supplier.name
                      )}
                    </td>
                    <td>
                      {editingId === supplier.supplierId ? (
                        <input
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                        />
                      ) : (
                        supplier.email
                      )}
                    </td>
                    <td>
                      {editingId === supplier.supplierId ? (
                        <input
                          type="text"
                          value={editedPhone}
                          onChange={(e) => setEditedPhone(e.target.value)}
                        />
                      ) : (
                        supplier.phone
                      )}
                    </td>
                    <td>
                      {editingId === supplier.supplierId ? (
                        <input
                          type="text"
                          value={editedAddress}
                          onChange={(e) => setEditedAddress(e.target.value)}
                        />
                      ) : (
                        supplier.address
                      )}
                    </td>
                    <td>
                      {editingId === supplier.supplierId ? (
                        <>
                          <button className="save-btn" onClick={() => handleUpdate(supplier.supplierId)}>
                            Save
                          </button>
                          <button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(supplier)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(supplier.supplierId)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupplierMaster;