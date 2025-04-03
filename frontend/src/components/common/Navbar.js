import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "./Navbar.css"; // Import the updated CSS

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = (dropdown, event) => {
    event.stopPropagation(); // Prevents event from bubbling up
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Hide dropdowns when clicking outside
  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="navbar" onClick={closeDropdown}>
        {/* Brand Section */}
        <Link to="/" className="navbar-brand">
          <FaShoppingCart className="icon" />
          <span>ECommerce Manager</span>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <div className="nav-links">
            {/* Masters Dropdown */}
            <div
              className={`dropdown ${activeDropdown === "masters" ? "active" : ""}`}
              onClick={(e) => toggleDropdown("masters", e)}
            >
              Masters
              {activeDropdown === "masters" && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <Link to="/master/categories">Categories</Link>
                  <Link to="/master/brands">Brands</Link>
                  <Link to="/master/suppliers">Suppliers</Link>
                </div>
              )}
            </div>

            {/* Admin Dropdown */}
            <div
              className={`dropdown ${activeDropdown === "admin" ? "active" : ""}`}
              onClick={(e) => toggleDropdown("admin", e)}
            >
              Admin
              {activeDropdown === "admin" && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <Link to="/admin/users">User Management</Link>
                  <Link to="/admin/permissions">Permissions</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authentication Section */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div
              className={`dropdown ${activeDropdown === "user" ? "active" : ""}`}
              onClick={(e) => toggleDropdown("user", e)}
            >
              <FaUser className="icon" />
              {currentUser?.name || "User"}
              {activeDropdown === "user" && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <Link to="/profile">My Profile</Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {isAuthenticated && <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />}
    </>
  );
};

export default Navbar;
