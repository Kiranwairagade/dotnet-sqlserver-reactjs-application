import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { FaSearch, FaPlus, FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import { getAllProducts } from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../contexts/PermissionContext';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermission();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  // Fetch products based on filter, sort, and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params = {
          pageNumber: currentPage,
          pageSize,
          sortBy,
          sortDirection,
          searchTerm: searchTerm.trim(),
          categoryId: selectedCategory || undefined
        };
        
        const response = await getAllProducts(params);
        
        setProducts(response.items || []);
        setTotalPages(Math.ceil(response.totalCount / pageSize));
        
        // Extract unique categories from products
        if (response.items && response.items.length > 0) {
          const uniqueCategories = [...new Set(response.items.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, sortDirection, searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>
    );
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    
    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    );
    
    return (
      <nav aria-label="Product pagination">
        <ul className="pagination justify-content-center mb-0">
          {pages}
        </ul>
      </nav>
    );
  };

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        {isAuthenticated && hasPermission('Product', 'create') && (
          <Button 
            as={Link} 
            to="/products/add" 
            variant="primary"
          >
        <FaPlus className="me-2" /> Add Product
</Button>
)}
</div>

<Form onSubmit={handleSearch} className="mb-4">
<Row className="g-2">
<Col md={6}>
  <InputGroup>
    <Form.Control
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Button type="submit" variant="secondary">
      <FaSearch />
    </Button>
  </InputGroup>
</Col>
<Col md={4}>
  <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
    <option value="">All Categories</option>
    {categories.map((category) => (
      <option key={category} value={category}>{category}</option>
    ))}
  </Form.Select>
</Col>
</Row>
</Form>

<Row className="mb-3">
<Col>
<Button variant="link" onClick={() => handleSortChange('name')}>Name {getSortIcon('name')}</Button>
<Button variant="link" onClick={() => handleSortChange('price')}>Price {getSortIcon('price')}</Button>
</Col>
</Row>

{loading ? (
<p>Loading products...</p>
) : products.length === 0 ? (
<Alert variant="info">No products found.</Alert>
) : (
<Row>
{products.map((product) => (
  <Col key={product.id} md={4} className="mb-4">
    <ProductCard product={product} />
  </Col>
))}
</Row>
)}

{totalPages > 1 && renderPagination()}
</Container>
);
};

export default ProductList;
