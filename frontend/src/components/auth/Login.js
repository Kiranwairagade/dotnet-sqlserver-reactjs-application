import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import './Login.css'; // Import custom styles

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={5}>
          <Card className="login-card shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center fw-bold mb-4 text-primary">Welcome Back</h2>
              <p className="text-center text-muted">Sign in to continue to your dashboard</p>
              {loginError && <Alert variant="danger">{loginError}</Alert>}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>

                    <div className="d-grid">
                      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="rounded-pill">
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="mt-4 text-center">
                <p className="mb-2">
                  Don't have an account? <Link to="/signup" className="text-primary fw-semibold">Sign up</Link>
                </p>
                <p>
                  <Link to="/forgot-password" className="text-danger fw-semibold">Forgot Password?</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;