import React, { useState } from 'react';
import UserTable from './UserTable';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import { createUser, updateUser } from '../../services/userService';
import './UserTable.css';

const UserManagement = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);

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
    // Trigger table refresh
    setRefreshTable(prev => !prev);
  };

  const handleCancel = () => {
    setActiveView('list');
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (activeView === 'create') {
        await createUser(formData);
      } else if (activeView === 'edit' && selectedUser) {
        await updateUser(selectedUser.userId, formData);
      }
      handleSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Unknown error occurred'}`);
    }
  };

  // Render the appropriate component based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <UserForm 
            selectedUser={null}
            onCancel={handleCancel} 
            onSubmitForm={handleFormSubmit} 
          />
        );
      case 'edit':
        return (
          <UserForm 
            selectedUser={selectedUser}
            onCancel={handleCancel} 
            onSubmitForm={handleFormSubmit} 
          />
        );
      case 'view':
        return (
          <UserDetail 
            userId={selectedUser?.userId} 
            onClose={handleCancel}
            onEdit={() => handleEditUser(selectedUser)}
          />
        );
      case 'list':
      default:
        return (
          <UserTable 
            onView={handleViewUser}
            onEdit={handleEditUser}
            onAddNew={handleAddNewUser}
            setSelectedUser={setSelectedUser}
            refreshTrigger={refreshTable}
          />
        );
    }
  };

  return (
    <div className="user-management-container">          
      <div className="user-management-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserManagement;