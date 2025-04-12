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
  });

  useEffect(() => {
    if (selectedUser) {
      const modulePerms = {};
      if (selectedUser.userPermissions && Array.isArray(selectedUser.userPermissions)) {
        selectedUser.userPermissions.forEach(perm => {
          modulePerms[perm.moduleName] = {
            Create: perm.canCreate,
            Read: perm.canRead,
            Update: perm.canUpdate,
            Delete: perm.canDelete
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

  const buildUserPermissionsPayload = () => {
    return masterModules.map((module) => {
      const perms = formData.modulePermissions[module] || {};
      return {
        moduleName: module,
        canCreate: perms.Create || false,
        canRead: perms.Read || false,
        canUpdate: perms.Update || false,
        canDelete: perms.Delete || false,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email) {
      alert('Please fill all required fields.');
      return;
    }

    if (!selectedUser && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      isActive: formData.isActive,
    };

    if (!selectedUser) {
      if (!formData.password) {
        alert('Password is required');
        return;
      }
      userPayload.password = formData.password;
    }

    const userPermissions = buildUserPermissionsPayload();
    onSubmitForm({ ...userPayload, userPermissions });
  };

  return (
    <div className="user-form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <h2>{selectedUser ? 'Edit User' : 'Create New User'}</h2>

        {error && <div className="form-error">{error}</div>}

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

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
        </div>

        <div className="permissions-section">
          <h3>Module Permissions</h3>
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : selectedUser ? 'Update User' : 'Create User'}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
