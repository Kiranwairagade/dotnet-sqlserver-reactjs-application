import React, { useEffect, useState } from 'react';
import masterModules from '../../../src/config/modules';
import './UserForm.css';

const permissions = ['Create', 'Read', 'Update', 'Delete'];

const UserForm = ({ selectedUser = null, onSubmitForm, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    modulePermissions: {},
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        password: '',
        confirmPassword: '',
        isActive: selectedUser.isActive ?? true,
        modulePermissions: selectedUser.modulePermissions || {},
      });
    }
  }, [selectedUser]);

  const handleCheckboxChange = (module, action) => {
    setFormData((prevState) => ({
      ...prevState,
      modulePermissions: {
        ...prevState.modulePermissions,
        [module]: {
          ...prevState.modulePermissions[module],
          [action]: !prevState.modulePermissions?.[module]?.[action],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email) {
      alert('Please fill all required fields.');
      return;
    }
    
    if (!selectedUser && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userPayload = { ...formData };
    if (selectedUser) {
      // Don't send password fields when updating
      delete userPayload.password;
      delete userPayload.confirmPassword;
    } else if (!formData.password) {
      // Password is required for new users
      alert('Password is required');
      return;
    }

    onSubmitForm(userPayload);
  };

  return (
    <div className="user-form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <h2>{selectedUser ? 'Edit User' : 'Create New User'}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>First Name*</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Username*</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {!selectedUser && (
          <div className="form-row">
            <div className="form-group">
              <label>Password*</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password*</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
          />
          <label>Active User</label>
        </div>

        <h3>Module Permissions</h3>
        <div className="permissions-table-container">
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Module</th>
                {permissions.map((perm) => (
                  <th key={perm}>{perm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {masterModules.map((module) => (
                <tr key={module}>
                  <td>{module}</td>
                  {permissions.map((perm) => (
                    <td key={perm}>
                      <input
                        type="checkbox"
                        checked={formData.modulePermissions?.[module]?.[perm] || false}
                        onChange={() => handleCheckboxChange(module, perm)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {selectedUser ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;