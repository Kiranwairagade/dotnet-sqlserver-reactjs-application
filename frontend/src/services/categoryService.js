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
  return response.data;
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const updateCategory = async (id, updatedCategory) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCategory),
    });
  
    return response.ok;
  };
  