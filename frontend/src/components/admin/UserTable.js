import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/userService';
import './UserTable.css';

const UserTable = ({ onEdit, onView, onAddNew }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 7,
    totalCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, userId: null });

  const fetchUsers = async (page = pagination.pageNumber, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.pageSize, search);
      setUsers(data.users || data);
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
  }, [pagination.pageNumber]);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;
    try {
      setLoading(true);
      await deleteUser(deleteConfirmation.userId);
      fetchUsers(); // Refresh user list
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
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <div className="user-table-container">
      <div className="header-row">
        <h2>User Management</h2>
        <button className="btn-add" onClick={onAddNew}>Add New User</button>
      </div>

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
      </div>

      {loading ? (
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
                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-view" onClick={() => onView(user)}>View</button>
                      <button className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
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
                  <td colSpan="6" className="no-data">No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.pageNumber} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirmation({ show: false, userId: null })}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>
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
