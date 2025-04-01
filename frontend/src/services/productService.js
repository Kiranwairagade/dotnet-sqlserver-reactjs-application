import { api } from '../utils/api';

// Product operations
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Category operations
export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Brand operations
export const getAllBrands = async () => {
  try {
    const response = await api.get('/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error.response?.data || error.message);
    throw error;
  }
};

export const createBrand = async (brandData) => {
  try {
    const response = await api.post('/brands', brandData);
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error.response?.data || error.message);
    throw error;
  }
};

export const updateBrand = async (id, brandData) => {
  try {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  } catch (error) {
    console.error(`Error updating brand with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Supplier operations
export const getAllSuppliers = async () => {
  try {
    const response = await api.get('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error.response?.data || error.message);
    throw error;
  }
};

export const createSupplier = async (supplierData) => {
  try {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error.response?.data || error.message);
    throw error;
  }
};

export const updateSupplier = async (id, supplierData) => {
  try {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting supplier with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
