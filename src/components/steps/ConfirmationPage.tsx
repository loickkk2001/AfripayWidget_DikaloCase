'use client';

import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';
import { financeService } from '@/services/apiServices';
import type { TransactionDetails, UserInfo, PaymentInfo, ReceiverInfo as ReceiverInfoType } from '@/types';

interface ConfirmationPageProps {
  transaction: TransactionDetails;
  sender: UserInfo;
  payment: PaymentInfo;
  receiver: ReceiverInfoType;
}

type ProcessStatus = 'idle' | 'verifying_kyc' | 'processing_transaction' | 'success' | 'error';

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
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleConfirm = async () => {
    setStatus('verifying_kyc');
    setErrorMessage('');

    try {
      // Step 1: KYC Verification
      const kycResponse = await financeService.verifyKYC(sender);
      
      if (!kycResponse.success) {
        throw new Error(kycResponse.message || 'KYC verification failed');
      }

      // Step 2: Process Transaction
      setStatus('processing_transaction');
      const response = await financeService.processTransaction(
        transaction,
        sender,
        payment,
        receiver
      );

      if (response.success) {
        setTransactionId(response.data.transactionId);
        setStatus('success');
      } else {
        throw new Error(response.message || 'Transaction failed');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
      setStatus('error');
    }
  };

  const renderStatusContent = () => {
    switch (status) {
      case 'verifying_kyc':
        return (
          <Box textAlign="center" py={4}>
            <CircularProgress size={48} sx={{ color: COLORS.success }} />
            <Typography variant="h6" mt={2} sx={{ color: COLORS.text }}>
              Verifying your information...
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.mutedText }}>
              Please wait while we verify your details
            </Typography>
          </Box>
        );
      
      case 'processing_transaction':
        return (
          <Box textAlign="center" py={4}>
            <CircularProgress size={48} sx={{ color: COLORS.success }} />
            <Typography variant="h6" mt={2} sx={{ color: COLORS.text }}>
              Processing your transaction...
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.mutedText }}>
              Please do not close this window
            </Typography>
          </Box>
        );
      
      default:
        return (
          <Box>
            {status === 'success' && (
              <Typography variant="h5" mb={3} textAlign="center" color={COLORS.success}>
                ✓ Transaction Successful!
              </Typography>
            )}
            {status === 'error' && (
              <Typography variant="h5" mb={3} textAlign="center" color={COLORS.error}>
                × Transaction Failed
                <Typography variant="body2" color={COLORS.error}>
                  {errorMessage}
                </Typography>
              </Typography>
            )}

            <Paper elevation={2} sx={{ p: 3, bgcolor: COLORS.paperBackground, color: COLORS.text }}>
              <Typography variant="subtitle1" fontWeight="500" mb={2}>Transaction Details</Typography>
              
              <Typography variant="body2" sx={{ color: COLORS.mutedText }}>Amount</Typography>
              <Typography variant="body1" fontWeight="500">
                {transaction.sendAmount} {transaction.sendCurrency}
              </Typography>

              <Typography variant="body2" sx={{ color: COLORS.mutedText, mt: 2 }}>Receiver</Typography>
              <Typography variant="body1">{receiver.name}</Typography>
              <Typography variant="body2">{receiver.phone}</Typography>

              {status === 'success' && (
                <>
                  <Typography variant="body2" sx={{ color: COLORS.mutedText, mt: 2 }}>Transaction ID</Typography>
                  <Typography variant="body1" sx={{ color: COLORS.success }}>{transactionId}</Typography>
                </>
              )}
            </Paper>

            {status === 'idle' && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleConfirm}
                sx={{
                  mt: 3,
                  bgcolor: COLORS.primary,
                  '&:hover': { bgcolor: COLORS.hoverPrimary }
                }}
              >
                Confirm Transaction
              </Button>
            )}

            {(status === 'success' || status === 'error') && (
              <Button
                fullWidth
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  mt: 3,
                  bgcolor: COLORS.primary,
                  '&:hover': { bgcolor: COLORS.hoverPrimary }
                }}
              >
                New Transaction
              </Button>
            )}
          </Box>
        );
    }
  };

  return renderStatusContent();
};

export default ConfirmationPage;
