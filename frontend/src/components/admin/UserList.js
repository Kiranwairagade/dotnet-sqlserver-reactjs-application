import React, { useState, useEffect } from 'react';
import { Card, Table, Alert } from 'react-bootstrap';
import { getAllUsers } from '../../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <Card className="shadow-sm mt-3">
      <Card.Header className="bg-white">
        <h5 className="mb-0">User List</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive borderless className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-3">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default UserList;
