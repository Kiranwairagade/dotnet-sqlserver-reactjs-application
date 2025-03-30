import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';
import { getAllUsers } from '../../services/userService';
import { usePermission } from '../../contexts/PermissionContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if user has permission to view users
        if (!hasPermission('users', 'view')) {
          setError('You do not have permission to view users');
          setLoading(false);
          return;
        }

        const response = await getAllUsers({
          pageNumber: 1,
          pageSize: 10
        });
        
        setUsers(response.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [hasPermission]);

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <Card className="shadow-sm mt-3">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">User Management</h5>
        {hasPermission('users', 'create') && (
          <button className="btn btn-primary btn-sm">Add New User</button>
        )}
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive borderless hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.roles?.join(', ') || 'No Role'}</td>
                  <td>
                    <span 
                      className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {hasPermission('users', 'edit') && (
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Edit
                      </button>
                    )}
                    {hasPermission('users', 'delete') && (
                      <button className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default UserList;