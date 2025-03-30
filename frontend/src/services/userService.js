// frontend/src/services/userService.js
import api from '../utils/api';

export const getUsers = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    const response = await api.get(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
    console.log("Fetched Users:", response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
};
