import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import './Login.css';

const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      };

      const result = await register(userData);
      
      if (result.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setSignupError(result.message);
      }
    } catch (error) {
      setSignupError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="signup-container justify-content-center" >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="signup-card">
            <Card.Header className="signup-header ">
              Create an Account
            </Card.Header>
            <Card.Body>
              {signupError && (
                <Alert variant="danger">{signupError}</Alert>
              )}
              
              <Formik
                initialValues={{ 
                  firstName: '', 
                  lastName: '', 
                  email: '', 
                  password: '', 
                  confirmPassword: '',
                  terms: false 
                }}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="Enter your first name"
                          />
                          <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Enter your last name"
                          />
                          <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                        </div>
                      </Col>
                    </Row>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                        placeholder="Create a password"
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-check">
                      <Field
                        type="checkbox"
                        name="terms"
                        id="terms"
                        className={`form-check-input ${touched.terms && errors.terms ? 'is-invalid' : ''}`}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <Link to="/terms">terms and conditions</Link>
                      </label>
                      <ErrorMessage name="terms" component="div" className="invalid-feedback" />
                    </div>

                    <Button type="submit" variant="primary" className="signup-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Form>
                )}
              </Formik>
              
              <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
