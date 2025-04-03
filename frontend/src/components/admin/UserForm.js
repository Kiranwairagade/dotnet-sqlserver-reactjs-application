import React, { useState, useEffect } from 'react';
import { createUser, updateUser, getUserById } from '../../services/userService';
import './UserForm.css';

const UserForm = ({ userId = null, onCancel, onSuccess }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    isActive: true,
    password: '', // Only used for new users
    confirmPassword: '' // Only used for new users
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsEdit(true);
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      // Omit the password fields when editing an existing user
      setUser({
        username: userData.username || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        isActive: userData.isActive || false,
      });
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error(err);
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

  const validateForm = () => {
    // Basic validation
    if (!user.email || !user.username) {
      setError('Username and Email are required fields.');
      return false;
    }
    
    if (!isEdit && user.password !== user.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (!isEdit && user.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit) {
        await updateUser(userId, {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive
        });
      } else {
        await createUser({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          password: user.password
        });
      }
      
      onSuccess();
    } catch (err) {
      setError(isEdit 
        ? 'Failed to update user. Please try again.' 
        : 'Failed to create user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Loading user details...</div>;
  }

  return (
    <div className="user-form-container">
      <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="user-form">
  <div className="form-group">
    <label htmlFor="username">Username*</label>
    <input
      type="text"
      id="username"
      name="username"
      value={user.username}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="email">Email*</label>
    <input
      type="email"
      id="email"
      name="email"
      value={user.email}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={user.firstName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={user.lastName}
        onChange={handleChange}
      />
    </div>
  </div>

  <div className="form-group checkbox-group">
    <label>
      <input
        type="checkbox"
        name="isActive"
        checked={user.isActive}
        onChange={handleChange}
      />
      Active User
    </label>
  </div>

  {!isEdit && (
    <>
      <div className="form-group">
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required={!isEdit}
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password*</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
          required={!isEdit}
        />
      </div>
    </>
  )}

  <div className="form-actions">
    <button type="button" className="btn-cancel" onClick={onCancel}>
      Cancel
    </button>
    <button type="submit" className="btn-submit" disabled={loading}>
      {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
    </button>
  </div>
</form>

    </div>
  );
};

export default UserForm;