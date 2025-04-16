import React, { useEffect, useState } from 'react';
import masterModules from '../../config/modules';
import './UserForm.css';

const permissions = ['Create', 'Read', 'Update', 'Delete'];

const UserForm = ({ selectedUser = null, onSubmitForm, onCancel, isLoading, error }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    modulePermissions: {},
    userPermissions: [],
  });

  useEffect(() => {
    if (selectedUser) {
      const modulePerms = {};
      if (selectedUser.userPermissions && Array.isArray(selectedUser.userPermissions)) {
        selectedUser.userPermissions.forEach(perm => {
          modulePerms[perm.moduleName] = {
            Create: perm.canCreate || false,
            Read: perm.canRead || false,
            Update: perm.canUpdate || false,
            Delete: perm.canDelete || false,
          };
        });
      }

      setFormData({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        password: '',
        confirmPassword: '',
        isActive: selectedUser.isActive ?? true,
        modulePermissions: modulePerms,
        userPermissions: selectedUser.userPermissions || [],
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isActive: true,
        modulePermissions: {},
        userPermissions: [],
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (module, action) => {
    setFormData(prev => ({
      ...prev,
      modulePermissions: {
        ...prev.modulePermissions,
        [module]: {
          ...prev.modulePermissions[module],
          [action]: !prev.modulePermissions[module]?.[action],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userPermissions = Object.entries(formData.modulePermissions).map(([moduleName, perms]) => ({
      moduleName,
      canCreate: perms.Create || false,
      canRead: perms.Read || false,
      canUpdate: perms.Update || false,
      canDelete: perms.Delete || false,
    }));

    const payload = {
      ...formData,
      userPermissions,
    };

    if (selectedUser) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    onSubmitForm(payload);
  };

  return (
    <div className="user-form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={formData.username} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>
        </div>

        {!selectedUser && (
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
          <label>Is Active</label>
        </div>

        <div className="permissions-table-container">
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Module</th>
                {permissions.map(action => (
                  <th key={action}>{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {masterModules.map(module => (
                <tr key={module}>
                  <td>{module}</td>
                  {permissions.map(action => (
                    <td key={action}>
                      <input
                        type="checkbox"
                        checked={formData.modulePermissions[module]?.[action] || false}
                        onChange={() => handleCheckboxChange(module, action)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : selectedUser ? 'Update User' : 'Create User'}
          </button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
