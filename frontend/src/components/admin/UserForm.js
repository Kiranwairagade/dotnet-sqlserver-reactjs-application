import React, { useEffect, useState } from 'react';
import masterModules from '../../config/modules';
import './UserForm.css';

const permissions = ['Create', 'Read', 'Update', 'Delete'];

const UserForm = ({ selectedUser = null, onSubmitForm, onCancel, isLoading, error, users = [], onPageChange, onEditUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    userPermissions: [],
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Default page size
  
  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };

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
    setFormData(prev => {
      // Find if this module permission already exists
      const existingIndex = prev.userPermissions.findIndex(p => p.moduleName === module);
      let updatedPermissions = [...prev.userPermissions];
      
      if (existingIndex >= 0) {
        // Update existing permission
        const updated = {
          ...updatedPermissions[existingIndex],
        };
        
        // Toggle the specific permission
        switch (action) {
          case 'Create': updated.canCreate = !updated.canCreate; break;
          case 'Read': updated.canRead = !updated.canRead; break;
          case 'Update': updated.canUpdate = !updated.canUpdate; break;
          case 'Delete': updated.canDelete = !updated.canDelete; break;
          default: break;
        }
        
        updatedPermissions[existingIndex] = updated;
      } else {
        // Create new permission for this module
        const newPermission = {
          moduleName: module,
          canCreate: action === 'Create' ? true : false,
          canRead: action === 'Read' ? true : false,
          canUpdate: action === 'Update' ? true : false,
          canDelete: action === 'Delete' ? true : false,
        };
        
        updatedPermissions.push(newPermission);
      }
      
      return {
        ...prev,
        userPermissions: updatedPermissions
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = { ...formData };

    if (selectedUser) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    onSubmitForm(payload);
  };

  // Helper function to check if a permission is checked
  const isPermissionChecked = (module, action) => {
    const modulePermission = formData.userPermissions.find(p => p.moduleName === module);
    if (!modulePermission) return false;
    
    switch (action) {
      case 'Create': return modulePermission.canCreate || false;
      case 'Read': return modulePermission.canRead || false;
      case 'Update': return modulePermission.canUpdate || false;
      case 'Delete': return modulePermission.canDelete || false;
      default: return false;
    }
  };

  // Pagination component
  const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];
    
    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="page-link"
        >
          &laquo; Prev
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-link ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
          className="page-link"
        >
          Next &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="user-form-container">
      {users.length > 0 && (
        <div className="users-list-container">
          <h3>Users List</h3>
          <table className="users-list-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.username}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button onClick={() => onEditUser(user)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination 
            usersPerPage={usersPerPage} 
            totalUsers={users.length} 
            paginate={paginate} 
            currentPage={currentPage}
          />
        </div>
      )}

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
                        checked={isPermissionChecked(module, action)}
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