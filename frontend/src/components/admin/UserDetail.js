import React, { useState, useEffect } from 'react';
import { getUserById } from '../../services/userService';
import './UserDetail.css';

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
    return <div className="not-found">User not found</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="user-detail-header">
        <h3>User Details</h3>
        <div className="user-detail-actions">
          <button className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="user-detail-content">
        <div className="detail-item">
          <div className="detail-label">User ID:</div>
          <div className="detail-value">{user.userId}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Username:</div>
          <div className="detail-value">{user.username || 'N/A'}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Email:</div>
          <div className="detail-value">{user.email}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">First Name:</div>
          <div className="detail-value">{user.firstName || 'N/A'}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Last Name:</div>
          <div className="detail-value">{user.lastName || 'N/A'}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Status:</div>
          <div className="detail-value">
            <span className={user.isActive ? 'status-active' : 'status-inactive'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Created At:</div>
          <div className="detail-value">{formatDate(user.createdAt)}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Updated At:</div>
          <div className="detail-value">{formatDate(user.updatedAt)}</div>
        </div>
        
        {user.roles && user.roles.length > 0 && (
          <div className="detail-item">
            <div className="detail-label">Roles:</div>
            <div className="detail-value">
              <ul className="detail-list">
                {user.roles.map(role => (
                  <li key={role.id || role.name}>{role.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {user.permissions && user.permissions.length > 0 && (
          <div className="detail-item">
            <div className="detail-label">Permissions:</div>
            <div className="detail-value">
              <ul className="detail-list">
                {user.permissions.map(permission => (
                  <li key={permission.id || permission.name}>{permission.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;