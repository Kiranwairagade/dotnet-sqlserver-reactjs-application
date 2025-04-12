import axios from 'axios';

const API_BASE_URL = 'http://localhost:5207/api/categories';

// Fetch all categories
export const getAllCategories = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Add a new category
export const addCategory = async (category) => {
  const response = await axios.post(API_BASE_URL, category);
  return response.status === 201 || response.status === 200;
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.status === 200;
};

// Update a category by ID
export const updateCategory = async (id, updatedCategory) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedCategory);
  return response.status === 200;
};
