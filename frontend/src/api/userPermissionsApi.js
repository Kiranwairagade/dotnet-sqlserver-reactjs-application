// src/api/userPermissionsApi.js
import { api } from '../utils/api';

export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/UserPermissions/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
};

export const getSimplePermissions = async (userId) => {
  try {
    const response = await api.get(`/UserPermissions/simple/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching simple permissions:', error);
    throw error;
  }
};

export const setPermission = async (permissionData) => {
  try {
    const response = await api.post('/UserPermissions', permissionData);
    return response.data;
  } catch (error) {
    console.error('Error setting permission:', error);
    throw error;
  }
};

export const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await api.put(`/UserPermissions/${userId}`, permissions);
    return response.data;
  } catch (error) {
    console.error('Error updating user permissions:', error);
    throw error;
  }
};

export const deletePermission = async (permissionId) => {
  try {
    const response = await api.delete(`/UserPermissions/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};