import axios from 'axios';

const BASE_URL = 'http://localhost:5207/api'; // Replace with your actual API URL

// Get all suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/suppliers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return null;
  }
};

// Add a new supplier
export const addSupplier = async (supplierData) => {
  try {
    // Validate that the required fields are present
    if (!supplierData.Name || !supplierData.Email || !supplierData.Phone || !supplierData.Address) {
      console.error("Missing required fields: Name, Email, Phone, and Address are required.");
      return null;
    }

    // Send the data to the server
    const response = await axios.post(`${BASE_URL}/suppliers`, supplierData);
    return response.data;
  } catch (error) {
    console.error("Error adding supplier:", error.response ? error.response.data : error.message);
    return null;
  }
};

// Delete a supplier
export const deleteSupplier = async (supplierId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/suppliers/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return null;
  }
};

// Update an existing supplier
export const updateSupplier = async (supplierId, supplierData) => {
  try {
    // Validate that the required fields are present
    if (!supplierData.Name || !supplierData.Email || !supplierData.Phone || !supplierData.Address) {
      console.error("Missing required fields: Name, Email, Phone, and Address are required.");
      return null;
    }

    // Send the data to the server
    const response = await axios.put(`${BASE_URL}/suppliers/${supplierId}`, supplierData);
    return response.data;
  } catch (error) {
    console.error("Error updating supplier:", error.response ? error.response.data : error.message);
    return null;
  }
};
