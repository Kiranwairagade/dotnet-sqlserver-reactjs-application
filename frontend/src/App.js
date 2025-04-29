import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import CategoryMaster from './components/masters/CategoryMaster';
import BrandMaster from './components/masters/BrandMaster';
import SupplierMaster from './components/masters/SupplierMaster';
import ProductMaster from './components/masters/ProductMaster';
import ProtectedRoute from './components/common/ProtectedRoute';
import Chatbot from './components/common/Chatbot';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      {isAuthenticated && <Sidebar />}
      <main className="content-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Master Modules */}
            <Route path="/categories" element={<CategoryMaster />} />
            <Route path="/brands" element={<BrandMaster />} />
            <Route path="/suppliers" element={<SupplierMaster />} />
            <Route path="/products" element={<ProductMaster />} />
            
            <Route path="/user-management" element={<UserManagement />} />          
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
  
      </main>
    </div>
  );
}

export default App;
