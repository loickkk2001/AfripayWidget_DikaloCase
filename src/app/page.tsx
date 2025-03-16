'use client';

import { Box, Container, Typography } from '@mui/material';
import CurrencyWidget from '@/components/currencyWidget';

export default function Home() {
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
          <CurrencyWidget />
        </Box>
      </Container>
    </Box>
  );
}