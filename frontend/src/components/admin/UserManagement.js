import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { usePermission } from '../../contexts/PermissionContext';
import { getUsers } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0
  });

  const { hasPermission } = usePermission();

  useEffect(() => {
    if (!hasPermission('users', 'view')) {
      setError('You do not have permission to view users');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [pagination.pageNumber, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined
      };

      const response = await getUsers(params);

      setUsers(response.users || []);
      setPagination(prev => ({
        ...prev,
        totalCount: response.totalCount || 0
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, pageNumber: newPage }));
  };

  if (!hasPermission('users', 'view')) {
    return <Alert variant="danger">You do not have permission to view users.</Alert>;
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h3>User Management</h3>
          {hasPermission('users', 'create') && (
            <Button variant="primary">Add New User</Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-3"
        />

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.roles?.join(', ') || 'No Roles'}</td>
                <td>
                  {hasPermission('users', 'edit') && (
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                  )}
                  {hasPermission('users', 'delete') && (
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={() => handlePageChange(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber === 1}
            className="me-2"
          >
            Previous
          </Button>
          <span className="align-self-center">
            Page {pagination.pageNumber} of {totalPages}
          </span>
          <Button 
            variant="outline-secondary" 
            onClick={() => handlePageChange(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber === totalPages}
            className="ms-2"
          >
            Next
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserManagement;
