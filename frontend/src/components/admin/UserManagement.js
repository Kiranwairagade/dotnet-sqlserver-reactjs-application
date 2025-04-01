import React, { useState } from 'react';
import UserTable from './UserTable';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import './UserTable.css';

const UserManagement = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setActiveView('view');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActiveView('edit');
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setActiveView('create');
  };

  const handleSuccess = () => {
    // After successful create/edit operation, go back to list view
    setActiveView('list');
  };

  const handleCancel = () => {
    setActiveView('list');
  };

  // Render the appropriate component based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <UserForm 
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        );
      case 'edit':
        return (
          <UserForm 
            userId={selectedUser?.userId}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        );
      case 'view':
        return (
          <UserDetail 
            userId={selectedUser?.userId}
            onClose={handleCancel}
            onEdit={() => setActiveView('edit')}
          />
        );
      case 'list':
      default:
        return (
          <UserTable 
            onView={handleViewUser}
            onEdit={handleEditUser}
            onAddNew={handleAddNewUser}
          />
        );
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>User Management</h1>
        {activeView !== 'list' && (
          <button className="btn-back" onClick={() => setActiveView('list')}>
            Back to List
          </button>
        )}
      </div>
      
      <div className="user-management-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserManagement;