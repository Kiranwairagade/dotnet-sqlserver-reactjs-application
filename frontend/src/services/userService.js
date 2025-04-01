// frontend/src/services/userService.js
import api from '../utils/api';

// Get users with pagination and search
export const getUsers = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    const response = await api.get('/users', {
      params: { pageNumber, pageSize, searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching users:`, error);
    throw error;
  }
};

// Get a specific user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data;
  } catch (error) {
    console.error(`Error creating user:`, error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// Toggle user active status
export const toggleUserStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(`/api/users/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Error toggling user ${userId} status:`, error);
    throw error;
  }
};

// Get user roles
export const getUserRoles = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/roles`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    throw error;
  }
};

// Update user roles
export const updateUserRoles = async (userId, roleIds) => {
  try {
    const response = await api.put(`/api/users/${userId}/roles`, { roleIds });
    return response.data;
  } catch (error) {
    console.error(`Error updating roles for user ${userId}:`, error);
    throw error;
  }
};

// Get user permissions
export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/permissions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error);
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserRoles,
  updateUserRoles,
  getUserPermissions
};
