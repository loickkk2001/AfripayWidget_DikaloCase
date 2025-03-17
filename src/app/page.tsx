'use client';

import React, { useEffect, useState } from 'react';
import CurrencyWidget from '@/components/currencyWidget';
import { Box, CircularProgress, Typography } from '@mui/material';
import { login } from '@/services/apiClient';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performLogin = async () => {
      try {
        setLoading(true);
        const response = await login('mouliofitzgerard@gmail.com', 'Diablomanore237@');
        if (response) {
          setIsLoggedIn(true);
        }
      } catch (err: any) {
        setError(err.message || 'Login failed');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    };

    performLogin();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography>Initializing payment system...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!isLoggedIn) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <Typography color="error">Failed to initialize payment system</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#000000',
      p: 2
    }}>
      <CurrencyWidget userId="75" companyName="Dikalo" />
    </Box>
  );
}