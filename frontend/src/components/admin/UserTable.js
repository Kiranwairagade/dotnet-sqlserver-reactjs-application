import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../../services/userService';
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

  const handlePermissionChange = async (userId, newPermissions) => {
    try {
      await updateUser(userId, { permissions: newPermissions });
      fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
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
        <button className="btn-add" onClick={onAddNew}>Add New User</button>
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
                        onChange={(e) => handlePermissionChange(user.userId, e.target.value.split(', '))}
                      >
                        {permissionOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-view" onClick={() => onView(user)}>View</button>
                      <button className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirmation({ show: true, userId: user.userId })}>Delete</button>
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
        </>
      )}
    </div>
  );
};

export default UserTable;