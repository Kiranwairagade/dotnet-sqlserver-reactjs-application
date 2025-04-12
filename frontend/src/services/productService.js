import { api } from '../utils/api';

/**
 * Get products with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {string} params.search - Search term
 * @param {string} params.categoryId - Category ID filter
 * @param {number} params.pageSize - Items per page
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortDirection - Sort direction (asc/desc)
 * @returns {Promise<Object>} - Paginated product data
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product data
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new product
 * @param {FormData} productData - Product data with images as FormData
 * @returns {Promise<Object>} - Created product data
 */
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {FormData} productData - Updated product data with images as FormData
 * @returns {Promise<Object>} - Updated product data
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a product
 * @param {string} id - Product ID to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all product categories
 * @returns {Promise<Array>} - List of categories
 */
export const getProductCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a product category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} - Category data
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new product category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} - Created category data
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} - Updated category data
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a category
 * @param {string} id - Category ID to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};