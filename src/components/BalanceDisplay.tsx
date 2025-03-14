'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CircularProgress, Alert, Typography, Box } from '@mui/material';
import apiClient from '@/services/apiClient';

interface BalanceDisplayProps {
  userId: string;
  autoRefresh?: boolean;
  setBalance?: Dispatch<SetStateAction<number | null>>;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ 
  userId, 
  autoRefresh = false,
  setBalance: externalSetBalance
}) => {
  const [balance, setInternalBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateBalance = (newBalance: number) => {
    setInternalBalance(newBalance);
    // Also update the external balance state if provided
    if (externalSetBalance) {
      externalSetBalance(newBalance);
    }
  };

  const fetchBalance = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/balance/${userId}`);
      updateBalance(response.data.balance);
    } catch (err) {
      setError('Failed to fetch balance');
      console.error('Error fetching balance:', err);
    }
    setLoading(false);
  };

  // Fetch balance on mount and when userId changes
  useEffect(() => {
    fetchBalance();
    
    // Set up auto-refresh interval if enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      intervalId = setInterval(fetchBalance, 60000); // Refresh every minute
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userId, autoRefresh]);

  return (
    <Box sx={{ mb: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography>Loading balance...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : balance !== null ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">Available Balance:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F3DB41' }}>
            {balance.toLocaleString()} XOF
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary">Balance not available</Typography>
      )}
    </Box>
  );
};

export default BalanceDisplay;