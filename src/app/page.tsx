'use client';

import { useState, useEffect } from 'react';
import CurrencyWidget from "@/components/currencyWidget";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

console.log("DEBUG: App Component Loaded ✅");

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    
    if (token && storedUserId) {
      setUserId(storedUserId);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Box
      sx={{
        bgcolor: '#121212',
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#FFF", fontWeight: "bold" }}>
            AfriPay Money Transfer
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Fast, secure money transfers to Africa
          </Typography>
        </Box>
        
        <Box
          sx={{
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {isLoading ? (
            <Box sx={{ textAlign: 'center', color: 'white' }}>Loading...</Box>
          ) : userId ? (
            <CurrencyWidget companyName="Dikalo" userId={userId} />
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4, 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'white'
            }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Welcome to AfriPay</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please log in to access the currency exchange services and manage your transfers.
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleLogin}
                sx={{ 
                  bgcolor: '#F3DB41', 
                  color: 'black',
                  '&:hover': {
                    bgcolor: '#c7b235',
                  }
                }}
              >
                Login to Continue
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}