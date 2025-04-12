import React, { useState, useEffect } from 'react';
import { getUserById } from '../../services/userService';
import './UserDetail.css';

const UserDetail = ({ userId, onClose, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setError('User ID is required');
      setLoading(false);
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      console.log("Fetched user details:", userData); // Debug logging
      
      if (userData) {
        setUser(userData);
        setError(null);
      } else {
        setError('User data not found');
      }
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error('Error fetching user details:', err);
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
        
        {/* Display user permissions in a table format similar to UserForm */}
        {user.userPermissions && user.userPermissions.length > 0 && (
          <div className="detail-item permissions-section">
            <div className="detail-label">Module Permissions:</div>
            <div className="detail-value">
              <table className="permissions-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Create</th>
                    <th>Read</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {user.userPermissions.map((permission, idx) => (
                    <tr key={idx}>
                      <td>{permission.moduleName}</td>
                      <td>
                        <div className={`permission-indicator ${permission.canCreate ? 'granted' : 'denied'}`}>
                          {permission.canCreate ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <div className={`permission-indicator ${permission.canRead ? 'granted' : 'denied'}`}>
                          {permission.canRead ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <div className={`permission-indicator ${permission.canUpdate ? 'granted' : 'denied'}`}>
                          {permission.canUpdate ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <div className={`permission-indicator ${permission.canDelete ? 'granted' : 'denied'}`}>
                          {permission.canDelete ? 'Yes' : 'No'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Keep the old permissions display as a fallback */}
        {!user.userPermissions && user.permissions && user.permissions.length > 0 && (
          <div className="detail-item">
            <div className="detail-label">Permissions:</div>
            <div className="detail-value">
              <ul className="detail-list">
                {user.permissions.map((permission, idx) => (
                  <li key={idx}>{permission}</li>
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