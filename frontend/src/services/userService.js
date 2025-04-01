import { api } from '../utils/api';

export const getUsers = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    const response = await api.get('/users', {
      params: {
        pageNumber,
        pageSize,
        searchTerm
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUserPermissions = async (userId, permissions) => {
  try {
    // Option 1: Try to update the whole user object with the new permissions
    const user = await getUserById(userId);
    if (user) {
      const updatedUser = { ...user, permissions };
      const response = await updateUser(userId, updatedUser);
      return response;
    }
    
    // Option 2: If the API has a specific endpoint for permissions but it's different
    // Uncomment this if Option 1 doesn't work and modify the endpoint as needed
    /*
    const response = await api.put(`/users/${userId}`, { permissions });
    return response.data;
    */
    
    throw new Error('Could not update user permissions');
  } catch (error) {
    console.error(`Error updating permissions for user ${userId}:`, error);
    throw error;
  }
};

export const getUserPermissions = async (userId) => {
  try {
    // If there's no specific endpoint for permissions, just get the whole user
    const user = await getUserById(userId);
    return user.permissions || [];
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error);
    throw error;
  }
};