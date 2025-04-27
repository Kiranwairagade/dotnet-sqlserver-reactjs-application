// src/api/userPermissionsApi.js

import axios from "axios";

const API_URL = "http://localhost:5207/api/UserPermissions";

export const getUserPermissions = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/simple/${userId}`);
    return response.data; // List of allowed modules
  } catch (error) {
    console.error("Error fetching permissions", error);
    return [];
  }
};
