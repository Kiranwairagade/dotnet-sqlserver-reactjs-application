import api from "../utils/api";

export const getAllUsers = async (params) => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getUserPermissions = async (userId) => {
  const response = await api.get(`/users/${userId}/permissions`);
  return response.data;
};
