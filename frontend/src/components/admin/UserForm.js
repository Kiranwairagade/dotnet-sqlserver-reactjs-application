import React, { useState, useEffect } from 'react';
import { createUser, updateUser, getUserById } from '../../services/userService';
import { getSidebarItems } from '../../services/sidebarService'; // Fetch sidebar list
import './UserForm.css';

const UserForm = ({ userId = null, onCancel, onSuccess }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    isActive: true,
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [sidebarList, setSidebarList] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    fetchSidebarItems();
    if (userId) {
      setIsEdit(true);
      fetchUserDetails();
    }
  }, [userId]);

  const fetchSidebarItems = async () => {
    try {
      const items = await getSidebarItems();
      setSidebarList(items);

      // Initialize permissions for new sidebar items
      setPermissions((prevPermissions) => {
        const updatedPermissions = { ...prevPermissions };
        items.forEach((item) => {
          if (!updatedPermissions[item.id]) {
            updatedPermissions[item.id] = ''; // Default empty permission
          }
        });
        return updatedPermissions;
      });

    } catch (err) {
      console.error('Failed to load sidebar items', err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser({
        username: userData.username || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        isActive: userData.isActive || false,
        password: '', // Keep blank for edit
        confirmPassword: ''
      });
      setPermissions(userData.permissions || {});
    } catch (err) {
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.username || !user.firstName || !user.lastName) {
      setError('All fields are required.');
      return;
    }
    if (!isEdit && user.password !== user.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        ...user,
        permissions
      };

      if (!isEdit) {
        userData.password = user.password;
      }

      if (isEdit) {
        await updateUser(userId, userData);
      } else {
        await createUser(userData);
      }
      onSuccess();
    } catch (err) {
      setError(isEdit ? 'Failed to update user.' : 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input type="text" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input type="text" id="lastName" name="lastName" value={user.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username*</label>
            <input type="text" id="username" name="username" value={user.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={user.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" name="isActive" checked={user.isActive} onChange={handleChange} /> Active User
          </label>
        </div>
        {!isEdit && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input type="password" id="password" name="password" value={user.password} onChange={handleChange} required minLength={8} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
        )}
        <h5>Permissions</h5>
        {sidebarList.map((item) => (
          <div key={item.id} className="permissions-group">
            <label>{item.name}</label>
            <select value={permissions[item.id] || ''} onChange={(e) => setPermissions({ ...permissions, [item.id]: e.target.value })}>
              <option value="">None</option>
              <option value="Create">Create</option>
              <option value="Read">Read</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="Create, Read">Create & Read</option>
              <option value="Create, Update">Create & Update</option>
              <option value="Create, Delete">Create & Delete</option>
              <option value="Read, Update">Read & Update</option>
              <option value="Read, Delete">Read & Delete</option>
              <option value="Update, Delete">Update & Delete</option>
              <option value="Create, Read, Update">Create, Read & Update</option>
              <option value="Create, Read, Delete">Create, Read & Delete</option>
              <option value="Create, Update, Delete">Create, Update & Delete</option>
              <option value="Read, Update, Delete">Read, Update & Delete</option>
              <option value="Create, Read, Update, Delete">Create, Read, Update & Delete</option>
            </select>
          </div>
        ))}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
