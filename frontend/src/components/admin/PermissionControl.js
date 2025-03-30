import React, { useEffect, useState } from "react";
import { getUsers } from '../../services/userService';

const PermissionControl = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.pageNumber, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined
      };

      const response = await getUsers(params);

      setUsers(response.users || []); // Adjust based on API response
      setPagination((prev) => ({
        ...prev,
        totalCount: response.totalCount || 0
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.pageNumber - 1)}
          disabled={pagination.pageNumber === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.pageNumber} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.pageNumber + 1)}
          disabled={pagination.pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="permission-container">
      <h2>User Management</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.roles?.join(", ")}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}
    </div>
  );
};

export default PermissionControl;
