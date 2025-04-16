import React, { useEffect, useState } from 'react';
import { getUserById, getUserPermissions } from '../../services/userService';
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

      if (!userData) {
        setError('User data not found');
        setLoading(false);
        return;
      }

      const permissions = await getUserPermissions(userId);

      const userWithPermissions = {
        ...userData,
        userPermissions: Array.isArray(permissions) ? permissions : [],
      };

      setUser(userWithPermissions);
      setError(null);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading user details...</div>;

  if (error) return <div className="error">{error}</div>;

  if (!user) return <div className="not-found">User not found</div>;

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
          <strong>User ID:</strong> {user.userId || 'N/A'}
        </div>

        <div className="detail-item">
          <strong>Name:</strong> {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
        </div>

        <div className="detail-item">
          <strong>Username:</strong> {user.username || 'N/A'}
        </div>

        <div className="detail-item">
          <strong>Email:</strong> {user.email || 'N/A'}
        </div>

        <div className="detail-item">
          <strong>Status:</strong>{' '}
          <span className={user.isActive ? 'status-active' : 'status-inactive'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="detail-item">
          <strong>Created:</strong> {formatDate(user.createdAt)}
        </div>

        <div className="detail-item">
          <strong>Last Updated:</strong> {formatDate(user.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
