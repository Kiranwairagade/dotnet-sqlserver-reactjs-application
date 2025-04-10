import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/userService';
import './UserTable.css';

const UserTable = ({ onEdit, onView, onAddNew, setSelectedUser, refreshTrigger }) => {
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

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.pageSize, search);
      setUsers(data.users || []);
      setPagination((prev) => ({
        ...prev,
        pageNumber: data.pageNumber || page,
        totalCount: data.totalCount || 0
      }));
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.pageNumber, searchTerm);
  }, [pagination.pageNumber, refreshTrigger]);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;
    try {
      setLoading(true);
      await deleteUser(deleteConfirmation.userId);
      fetchUsers(1, searchTerm); // Reset to first page after delete
      setDeleteConfirmation({ show: false, userId: null });
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalCount / pagination.pageSize)) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNumber: 1 })); // Reset to page 1
    fetchUsers(1, searchTerm); // Fetch results based on search
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize) || 1;

  return (
    <div className="user-table-container">
      <div className="header-row">
        <h2>User Management</h2>
        <button className="btn-add" onClick={onAddNew}>Add New User</button>
      </div>

      <div className="table-header">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
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
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => onView(user)}>View</button>
                      <button onClick={() => onEdit(user)}>Edit</button>
                      <button onClick={() => setDeleteConfirmation({ show: true, userId: user.userId })}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No users found</td></tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={pagination.pageNumber === 1} onClick={() => handlePageChange(pagination.pageNumber - 1)}>Previous</button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} className={pagination.pageNumber === index + 1 ? 'active' : ''} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            ))}
            <button disabled={pagination.pageNumber === totalPages} onClick={() => handlePageChange(pagination.pageNumber + 1)}>Next</button>
          </div>
        </>
      )}

      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirmation({ show: false, userId: null })}>Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
