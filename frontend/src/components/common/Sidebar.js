import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../contexts/PermissionContext';
import { Offcanvas, Nav } from 'react-bootstrap';
import { 
  FaBox, 
  FaListAlt, 
  FaTag, 
  FaTruck, 
  FaUsers
} from 'react-icons/fa';
import "./Sidebar.css";

const Sidebar = ({ show, onHide }) => {
  const { userRole } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Offcanvas show={show} onHide={onHide} responsive="lg" className="sidebar" style={{ backgroundColor: '#e0f7fa' }}> 
      <Offcanvas.Body className="p-0">
        <Nav className="flex-column">
          
          {/* Product Section as a List */}
          
          <ul className="sidebar-list">
            <li>
              <Nav.Link as={Link} to="/products" className={`sidebar-link ${isActive('/products') ? 'active' : ''}`} onClick={onHide}>
                <FaBox className="me-2" /> All Products
              </Nav.Link>
            </li>
            {hasPermission('Product', 'create') && (
              <li>
                <Nav.Link as={Link} to="/products/add" className={`sidebar-link ${isActive('/products/add') ? 'active' : ''}`} onClick={onHide}>
                  <FaBox className="me-2" /> Add Product
                </Nav.Link>
              </li>
            )}
        
            <li>
              <Nav.Link as={Link} to="/employee/categories" className={`sidebar-link ${isActive('/employee/categories') ? 'active' : ''}`} onClick={onHide}>
                <FaListAlt className="me-2" /> Categories
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={Link} to="/employee/brands" className={`sidebar-link ${isActive('/employee/brands') ? 'active' : ''}`} onClick={onHide}>
                <FaTag className="me-2" /> Brands
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={Link} to="/employee/suppliers" className={`sidebar-link ${isActive('/employee/suppliers') ? 'active' : ''}`} onClick={onHide}>
                <FaTruck className="me-2" /> Suppliers
              </Nav.Link>
            </li>
          </ul>

          {/* Admin Section */}
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
