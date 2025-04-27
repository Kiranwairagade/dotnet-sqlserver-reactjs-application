// Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import {
  LayoutDashboard,
  UserCog,
  LogOut,
  Box,
  Tag,
  Truck,
  PackageSearch,
  Users
} from 'lucide-react';
import masterModules from '../../../src/config/modules';
import './Sidebar.css';

const icons = {
  Categories: <Tag size={18} />,
  Brands: <Box size={18} />,
  Suppliers: <Truck size={18} />,
  Products: <PackageSearch size={18} />,
  Employees: <Users size={18} />
};

const Sidebar = () => {
  const { logout } = useAuth();  // use logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // update auth state
    navigate('/login'); // redirect to login
  };

  return (
    <div className="sidebar">
      <h2> Masters</h2>
      <ul className="sidebar-list">
        {masterModules.map((module) => (
          <li key={module}>
            <NavLink to={`/${module.toLowerCase()}`} className="sidebar-link">
              {icons[module]} <span>{module}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <h2>Admin</h2>
      <ul className="sidebar-list">
        <li>
          <NavLink to="/user-management" className="sidebar-link">
            <UserCog size={18} /> <span>User Management</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/chatbot" className="sidebar-link">
            <UserCog size={18} /> <span>ChatBot</span>
          </NavLink>
        </li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} /> <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
