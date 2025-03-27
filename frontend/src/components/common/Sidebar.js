import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../contexts/PermissionContext';
import { Offcanvas, Nav } from 'react-bootstrap';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaListAlt, 
  FaTag, 
  FaTruck, 
  FaUsers, 
  FaUsersCog,
  FaCog
} from 'react-icons/fa';

const Sidebar = ({ show, onHide }) => {
  const { userRole } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  // Helper function to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <Offcanvas show={show} onHide={onHide} responsive="lg" className="sidebar" style={{ backgroundColor: '#e0f7fa' }}> 
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>ECommerce Manager</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0">
        <Nav className="flex-column">
          
          
          <div className="sidebar-heading px-3 mt-3 mb-1 text-muted">Products</div>
          <Nav.Item>
            <Nav.Link as={Link} to="/products" className={`sidebar-link ${isActive('/products') ? 'active' : ''}`} onClick={onHide}>
              <FaBox className="me-2" /> All Products
            </Nav.Link>
          </Nav.Item>
          {hasPermission('Product', 'create') && (
            <Nav.Item>
              <Nav.Link as={Link} to="/products/add" className={`sidebar-link ${isActive('/products/add') ? 'active' : ''}`} onClick={onHide}>
                <FaBox className="me-2" /> Add Product
              </Nav.Link>
            </Nav.Item>
          )}
          
          <div className="sidebar-heading px-3 mt-3 mb-1 text-muted">Masters</div>
          <Nav.Item>
            <Nav.Link as={Link} to="/master/categories" className={`sidebar-link ${isActive('/master/categories') ? 'active' : ''}`} onClick={onHide}>
              <FaListAlt className="me-2" /> Categories
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/master/brands" className={`sidebar-link ${isActive('/master/brands') ? 'active' : ''}`} onClick={onHide}>
              <FaTag className="me-2" /> Brands
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/master/suppliers" className={`sidebar-link ${isActive('/master/suppliers') ? 'active' : ''}`} onClick={onHide}>
              <FaTruck className="me-2" /> Suppliers
            </Nav.Link>
          </Nav.Item>
          
          {userRole === 'Admin' && (
            <>
              <div className="sidebar-heading px-3 mt-3 mb-1 text-muted">Administration</div>
              <Nav.Item>
                <Nav.Link as={Link} to="/admin/users" className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`} onClick={onHide}>
                  <FaUsers className="me-2" /> User Management
                </Nav.Link>
              </Nav.Item>
              
            </>
          )}                
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;