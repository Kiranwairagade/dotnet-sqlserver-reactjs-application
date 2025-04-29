// src/components/common/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../contexts/PermissionContext';
import {
  LayoutDashboard,
  UserCog,
  LogOut,
  Box,
  Tag,
  Truck,
  PackageSearch,
  Users,
  Lock
} from 'lucide-react';
import masterModules from '../../config/modules';
import './Sidebar.css';

const icons = {
  Categories: <Tag size={18} />,
  Brands: <Box size={18} />,
  Suppliers: <Truck size={18} />,
  Products: <PackageSearch size={18} />,
  Employees: <Users size={18} />
};

const Sidebar = () => {
  const { logout } = useAuth();
  const { hasPermission, isLoading } = usePermission();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to handle click on modules without permission
  const handleRestrictedClick = (e, module) => {
    if (!hasPermission(module.toLowerCase(), 'view')) {
      e.preventDefault();
      alert(`You don't have permission to access the ${module} module.`);
    }
  };

  return (
    <div className="sidebar">
      <h2>Masters</h2>
      <ul className="sidebar-list">
        {masterModules.map((module) => {
          const hasAccess = !isLoading && hasPermission(module.toLowerCase(), 'view');
          
          return (
            <li key={module}>
              <NavLink 
                to={`/${module.toLowerCase()}`} 
                className={`sidebar-link ${!hasAccess ? 'restricted' : ''}`}
                onClick={(e) => handleRestrictedClick(e, module)}
              >
                {icons[module]} 
                <span>{module}</span>
                {!hasAccess && <Lock size={14} className="lock-icon" />}
              </NavLink>
            </li>
          );
        })}
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