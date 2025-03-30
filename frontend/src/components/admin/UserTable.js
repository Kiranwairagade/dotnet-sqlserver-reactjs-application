// frontend/src/components/admin/UserTable.js
import React, { useState, useEffect } from 'react';
import { getUsers } from '../../services/userService';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async (page = pagination.pageNumber, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.pageSize, search);
      console.log("Users in Component:", data.users); // Debugging
      setUsers(data.users);
      setPagination((prev) => ({
        ...prev,
        pageNumber: data.pageNumber,
        totalCount: data.totalCount,
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNumber: 1 })); // Reset to first page
    fetchUsers(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalCount / pagination.pageSize)) {
      setPagination({ ...pagination, pageNumber: newPage });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="user-table-container">
      <div className="search-container">
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
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
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
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.updatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No users found</td>
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
              Page {pagination.pageNumber} of {Math.ceil(pagination.totalCount / pagination.pageSize)}
            </span>
            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTable;
