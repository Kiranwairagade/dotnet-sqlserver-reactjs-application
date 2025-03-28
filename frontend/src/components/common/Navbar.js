import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaSignOutAlt, FaShoppingCart, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "./Navbar.css"; // Add custom styles

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = (dropdown) => {
    setShowDropdown(showDropdown === dropdown ? null : dropdown);
  };

  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="navbar">     
        <Link to="/" className="navbar-brand">
          <FaShoppingCart className="icon" />
          <span>ECommerce Manager</span>
        </Link>

        {isAuthenticated && (
          <div className="nav-links">
            <div
              className="dropdown"
              onClick={() => toggleDropdown("masters")}
            >
              Masters
              {showDropdown === "masters" && (
                <div className="dropdown-menu">
                  <Link to="/master/categories">Categories</Link>
                  <Link to="/master/brands">Brands</Link>
                  <Link to="/master/suppliers">Suppliers</Link>
                </div>
              )}
            </div>

            <div
              className="dropdown"
              onClick={() => toggleDropdown("admin")}
            >
              Admin
              {showDropdown === "admin" && (
                <div className="dropdown-menu">
                  <Link to="/admin/users">User Management</Link>
                  <Link to="/admin/permissions">Permissions</Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="dropdown" onClick={() => toggleDropdown("user")}>
              <FaUser className="icon" />
              {currentUser?.name || "User"}
              {showDropdown === "user" && (
                <div className="dropdown-menu">
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
