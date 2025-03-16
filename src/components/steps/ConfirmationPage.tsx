'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Paper, Alert } from '@mui/material';
import apiClient from '@/services/apiClient';
import type { TransactionDetails, UserInfo, PaymentInfo, ReceiverInfo as ReceiverInfoType } from '@/types';

interface ConfirmationPageProps {
  transaction: TransactionDetails & { id?: string };
  sender: UserInfo;
  payment: PaymentInfo;
  receiver: ReceiverInfoType;
}

const COLORS = {
  primary: '#13629F',
  hoverPrimary: '#0D4A7A',
  success: '#F3DB41',
  error: 'error.main',
  text: 'white',
  mutedText: 'rgba(255, 255, 255, 0.7)',
  divider: 'rgba(255, 255, 255, 0.2)',
  paperBackground: 'rgba(255, 255, 255, 0.1)',
};

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ transaction, sender, payment, receiver }) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setReferenceNumber(Math.random().toString(36).substring(2, 15).toUpperCase());
  }, []);

  useEffect(() => {
    const processTransaction = async () => {
      try {
        console.log('Processing transaction with data:', {
          transaction,
          sender,
          receiver,
          payment
        });

        const response = await apiClient.post('/transactions', {
          ...transaction,
          sender,
          receiver,
          payment,
          referenceNumber
        });

        console.log('Transaction response:', response.data);

        if (response.data.success) {
          setStatus('success');
        } else {
          throw new Error(response.data.message || 'Transaction failed');
        }
      } catch (err: any) {
        console.error('Transaction error:', err);
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 
          err.message || 
          'Failed to process transaction. Please try again.'
        );
      }
    };
    processTransaction();
  }, [transaction, sender, receiver, payment, referenceNumber]);

  if (status === 'processing') {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress size={48} sx={{ color: COLORS.success }} />
        <Typography variant="h6" mt={2} sx={{ color: COLORS.text }}>
          Processing your transaction...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={3} textAlign="center" color={status === 'success' ? COLORS.success : COLORS.error}>
        {status === 'success' ? '✓ Transaction Successful!' : '× Transaction Failed'}
      </Typography>

      {status === 'error' && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            bgcolor: 'rgba(255, 72, 66, 0.1)',
            color: COLORS.error,
            '& .MuiAlert-icon': {
              color: COLORS.error,
            },
          }}
        >
          {errorMessage}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, bgcolor: COLORS.paperBackground, color: COLORS.text }}>
        <Typography variant="subtitle1" fontWeight="500" mb={2}>Transaction Details</Typography>
        <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Reference Number</Typography>
        <Typography variant="body1" fontWeight="500" sx={{ color: COLORS.success }}>{referenceNumber}</Typography>
        <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Amount</Typography>
        <Typography variant="body1">{transaction.sendAmount} {transaction.sendCurrency}</Typography>
        <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Receiver Gets</Typography>
        <Typography variant="body1">{transaction.receiveAmount} {transaction.receiveCurrency}</Typography>
        <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Sender</Typography>
        <Typography variant="body1">{sender.name} ({sender.email})</Typography>
        <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Receiver</Typography>
        <Typography variant="body1">{receiver.name} ({receiver.email})</Typography>
      </Paper>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/'}
          sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: COLORS.hoverPrimary } }}
        >
          {status === 'success' ? 'Make Another Transfer' : 'Try Again'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmationPage;
