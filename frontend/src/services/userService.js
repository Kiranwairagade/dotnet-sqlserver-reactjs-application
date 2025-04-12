// services/UserService.js
import axios from 'axios';

// ✅ Base URL for API (adjust if needed)
const API_BASE_URL = 'http://localhost:5207';
const API_URL = `${API_BASE_URL}/api/users`;

// ✅ Add interceptor for Authorization header
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Get users with pagination + search
const getUsers = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    const response = await axios.get(
      `${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// ✅ Get single user by ID
const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// ✅ Create new user
const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// ✅ Update user info
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// ✅ Delete user
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// ✅ Update permissions
const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/permissions`, permissions);
    return response.data;
  } catch (error) {
    console.error(`Error updating permissions for user ${userId}:`, error);
    throw error;
  }
};

// ✅ Get permissions
const getUserPermissions = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/permissions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error);
    throw error;
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPermissions,
  getUserPermissions,
};
