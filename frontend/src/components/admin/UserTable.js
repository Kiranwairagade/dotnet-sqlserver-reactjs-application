import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUserPermissions } from '../../services/userService';
import './UserTable.css';

const UserTable = ({ onEdit, onView, onAddNew }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, userId: null });
  const [updatingPermissions, setUpdatingPermissions] = useState(null);

  const permissionOptions = [
    "None",
    "Create", "Read", "Update", "Delete",
    "Create, Read", "Create, Update", "Create, Delete", "Read, Update", "Read, Delete", "Update, Delete",
    "Create, Read, Update", "Create, Read, Delete", "Create, Update, Delete", "Read, Update, Delete",
    "Create, Read, Update, Delete"
  ];

  const fetchUsers = async (page = pagination.pageNumber, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.pageSize, search);
      setUsers(data.users || data); // Handle different response formats
      setPagination((prev) => ({
        ...prev,
        pageNumber: data.pageNumber || page,
        totalCount: data.totalCount || (data.length || 0),
      }));
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.pageNumber, pagination.pageSize]);

  const handlePermissionChange = async (userId, permissionString) => {
    try {
      setUpdatingPermissions(userId);
      
      // Convert permission string to array or empty array if "None"
      const permissions = permissionString === "None" ? [] : permissionString.split(', ');
      
      // Update user data with new permissions
      await updateUserPermissions(userId, permissions);
      
      // Update user in local state to avoid full refetch
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, permissions } : user
      ));
      
      // Show success feedback
      alert(`Permissions updated successfully for user ID: ${userId}`);
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert(`Failed to update permissions: ${error.message || 'Unknown error'}`);
    } finally {
      setUpdatingPermissions(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      setLoading(true);
      await deleteUser(deleteConfirmation.userId);
      
      // Remove user from local state
      setUsers(users.filter(user => user.userId !== deleteConfirmation.userId));
      
      setDeleteConfirmation({ show: false, userId: null });
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalCount / pagination.pageSize)) {
      setPagination({...pagination, pageNumber: newPage});
    }
  };

  // Safe handler functions that check if callbacks exist
  const handleView = (user) => {
    if (typeof onView === 'function') {
      onView(user);
    } else {
      console.warn('onView callback is not defined');
      alert('View functionality is not implemented yet.');
    }
  };

  const handleEdit = (user) => {
    if (typeof onEdit === 'function') {
      onEdit(user);
    } else {
      console.warn('onEdit callback is not defined');
      alert('Edit functionality is not implemented yet.');
    }
  };

  const handleAddNew = () => {
    if (typeof onAddNew === 'function') {
      onAddNew();
    } else {
      console.warn('onAddNew callback is not defined');
      alert('Add new user functionality is not implemented yet.');
    }
  };

  return (
    <div className="user-table-container">
      <div className="table-header">
        <div className="search-container">
          <form onSubmit={(e) => { e.preventDefault(); fetchUsers(1, searchTerm); }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <button className="btn-add" onClick={handleAddNew}>Add New User</button>
      </div>

      {loading && !updatingPermissions ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Permissions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                    <td>
                      <select
                        value={user.permissions?.join(', ') || "None"}
                        onChange={(e) => handlePermissionChange(user.userId, e.target.value)}
                        disabled={updatingPermissions === user.userId}
                        className={updatingPermissions === user.userId ? "select-loading" : ""}
                      >
                        {permissionOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {updatingPermissions === user.userId && (
                        <span className="loading-indicator">Updating...</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-view" onClick={() => handleView(user)}>View</button>
                      <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                      <button 
                        className="btn-delete" 
                        onClick={() => setDeleteConfirmation({ show: true, userId: user.userId })}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {users.length > 0 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.pageNumber} of {Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setDeleteConfirmation({ show: false, userId: null })}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;