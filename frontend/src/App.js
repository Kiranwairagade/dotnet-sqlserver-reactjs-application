import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar'; // Ensure Sidebar is included
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import ProductForm from './components/products/ProductForm';
import UserManagement from './components/admin/UserManagement';
import CategoryMaster from './components/masters/CategoryMaster';
import BrandMaster from './components/masters/BrandMaster';
import SupplierMaster from './components/masters/SupplierMaster';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      {isAuthenticated && <Sidebar />} {/* Sidebar is now persistent */}
      <main className="content-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/master/categories" element={<CategoryMaster />} />
            <Route path="/master/brands" element={<BrandMaster />} />
            <Route path="/master/suppliers" element={<SupplierMaster />} />
          </Route>

          {/* Default route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
