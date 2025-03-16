'use client';

import React from 'react';
import { Container } from '@mui/material';
import CurrencyWidget from '@/components/currencyWidget';
import { useAuth } from '@/hooks/useAuth';

export default function FinancePage() {
  const { userId } = useAuth();

  if (!userId) {
    return null; // Auth hook will handle redirect
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CurrencyWidget userId={userId} />
    </Container>
  );
}