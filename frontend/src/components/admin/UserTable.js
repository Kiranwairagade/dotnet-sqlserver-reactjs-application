import React, { useState, useEffect } from 'react';
import { deleteUser } from '../../services/userService';
import './UserTable.css';
import axios from 'axios';

const UserTable = ({ onEdit, onView, onAddNew, setSelectedUser, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5207/api/users');
      const userList = res.data.users?.$values || [];
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // set to empty array if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.userId !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.startsWith('0001')) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h2>User List</h2>
        <button className="add-button" onClick={onAddNew}>New User</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Active</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.username ?? 'N/A'}</td>
                  <td>{user.email ?? 'N/A'}</td>
                  <td>{(user.firstName ?? '') + ' ' + (user.lastName ?? '')}</td>
                  <td>{user.isActive ? 'Yes' : 'No'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.updatedAt)}</td>
                  <td>
                    <button onClick={() => onView(user)}>View</button>
                    <button onClick={() => onEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.userId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
