import React, { useState, useEffect } from 'react';
import { getUserById } from '../../services/userService';
import './UserTable.css';

const UserDetail = ({ userId, onClose, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="user-detail-header">
        <h2>User Details</h2>
        <div className="user-detail-actions">
          <button className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="user-detail-content">
        <div className="detail-group">
          <label>User ID:</label>
          <span>{user.userId}</span>
        </div>
        
        <div className="detail-group">
          <label>Username:</label>
          <span>{user.username || 'N/A'}</span>
        </div>
        
        <div className="detail-group">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        
        <div className="detail-group">
          <label>First Name:</label>
          <span>{user.firstName || 'N/A'}</span>
        </div>
        
        <div className="detail-group">
          <label>Last Name:</label>
          <span>{user.lastName || 'N/A'}</span>
        </div>
        
        <div className="detail-group">
          <label>Status:</label>
          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="detail-group">
          <label>Created At:</label>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        
        <div className="detail-group">
          <label>Updated At:</label>
          <span>{formatDate(user.updatedAt)}</span>
        </div>
        
        {user.roles && user.roles.length > 0 && (
          <div className="detail-group">
            <label>Roles:</label>
            <ul className="role-list">
              {user.roles.map(role => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {user.permissions && user.permissions.length > 0 && (
          <div className="detail-group">
            <label>Permissions:</label>
            <ul className="permission-list">
              {user.permissions.map(permission => (
                <li key={permission.id}>{permission.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;