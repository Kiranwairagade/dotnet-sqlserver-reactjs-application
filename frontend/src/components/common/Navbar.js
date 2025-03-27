import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { FaUser, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Hide Navbar on Login and Signup pages
  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="py-2 mb-4">
        <Container fluid>
          {isAuthenticated && (
            <Button
              variant="outline-light"
              className="me-2 d-lg-none"
              onClick={toggleSidebar}
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
          )}

          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FaShoppingCart className="me-2" size={24} />
            <span className="fw-bold">ECommerce Manager</span>
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated && (
                <NavDropdown title="Masters" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/master/categories">Categories</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/master/brands">Brands</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/master/suppliers">Suppliers</NavDropdown.Item>
                </NavDropdown>
              )}
              {isAuthenticated && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/admin/users">User Management</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/permissions">Permissions</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            <Nav>
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" /> {currentUser?.name || "User"}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                  <Button as={Link} to="/signup" variant="outline-light">Sign Up</Button>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {isAuthenticated && <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />}
    </>
  );
};

export default Navbar;