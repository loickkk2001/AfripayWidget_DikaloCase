'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const { loading, login } = useAuth();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/finance');
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');

    // Validate against the specific credentials
    const validEmail = "mouliofitzgerald@gmail.com";
    const validPassword = "Diablomanore237@";

    if (values.email !== validEmail || values.password !== validPassword) {
      setError('Invalid email or password');
      return;
    }

    try {
      const success = await login(values.email, values.password);
      if (success) {
        router.replace('/finance');
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#121212',
        minHeight: '100vh',
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Login to AfriPay
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    bgcolor: '#F3DB41', 
                    color: 'black',
                    '&:hover': {
                      bgcolor: '#c7b235',
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'black' }} />
                      Logging in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
}
