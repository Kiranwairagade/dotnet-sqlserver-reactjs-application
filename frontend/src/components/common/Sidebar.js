import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaListAlt,
  FaTag,
  FaTruck,
  FaBox,
  FaUserShield,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { getSidebarItems } from "../../services/sidebarService";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarList, setSidebarList] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await getSidebarItems();
      setSidebarList(items);
    };
    fetchItems();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {/* Masters Section */}
        <li className="sidebar-section">Masters</li>
        <li>
          <Link to="/master/categories" className="sidebar-link">
            <FaListAlt className="me-2" /> Categories
          </Link>
        </li>
        <li>
          <Link to="/master/brands" className="sidebar-link">
            <FaTag className="me-2" /> Brands
          </Link>
        </li>
        <li>
          <Link to="/master/suppliers" className="sidebar-link">
            <FaTruck className="me-2" /> Suppliers
          </Link>
        </li>
        <li>
          <Link to="/master/products" className="sidebar-link">
            <FaBox className="me-2" /> Products
          </Link>
        </li>
        <li>
          <Link to="/master/employees" className="sidebar-link">
            <FaUserShield className="me-2" /> Employees
          </Link>
        </li>

        {/* Admin Section */}
        <li className="sidebar-section">Admin</li>
        <li>
          <Link to="/admin/usermanagement" className="sidebar-link">
            <FaUsers className="me-2" /> User Management
          </Link>
        </li>

        {/* Logout Button */}
        <li>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
