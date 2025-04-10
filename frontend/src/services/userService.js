import { api } from '../utils/api';

// Fetch all users with pagination and search
export const getUsers = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    const response = await api.get('/users', {
      params: { pageNumber, pageSize, searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};

// Update user permissions
export const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await api.put(`/users/${userId}/permissions`, permissions);
    return response.data;
  } catch (error) {
    console.error(`Error updating permissions for user ${userId}:`, error);
    throw error;
  }
};

// Get user permissions (from user details)
export const getUserPermissions = async (userId) => {
  try {
    const user = await getUserById(userId);
    return user.permissions || [];
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error);
    throw error;
  }
};
