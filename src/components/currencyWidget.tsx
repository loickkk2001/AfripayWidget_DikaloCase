'use client';

import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box, Typography, useMediaQuery, useTheme, Paper, Container } from "@mui/material";
import ExchangeForm from "@/components/steps/ExchangeForm";
import SenderKYC from "@/components/steps/SenderKYC";
import PaymentMethod from "@/components/steps/PaymentMethod";
import ReceiverInfo from "@/components/steps/ReceiverInfo";
import ConfirmationPage from "@/components/steps/ConfirmationPage";
import type {
  UserInfo,
  ReceiverInfo as ReceiverInfoType,
  TransactionDetails,
  PaymentInfo,
} from "@/types";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CurrencyWidgetProps {
  userId: string;
  companyName?: string;
}

const CurrencyWidget = ({ userId, companyName = "Dikalo" }: CurrencyWidgetProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [senderInfo, setSenderInfo] = useState<UserInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfoType | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ["Exchange", "Your Info", "Payment", "Receiver", "Confirm"];

  const handleExchangeSubmit = (details: TransactionDetails) => {
    setTransactionDetails(details);
    setActiveStep(1);
  };

  const handleSenderSubmit = (info: UserInfo) => {
    setSenderInfo(info);
    setActiveStep(2);
  };

  const handlePaymentSubmit = (info: PaymentInfo) => {
    setPaymentInfo(info);
    setActiveStep(3);
  };

  const handleReceiverSubmit = (info: ReceiverInfoType) => {
    setReceiverInfo(info);
    setActiveStep(4);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 0, sm: 4 } }}>
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          minHeight: { xs: '100vh', sm: 'auto' },
          backgroundColor: 'black',
          backgroundImage: 'linear-gradient(to bottom right, rgba(19, 98, 159, 0.05), rgba(243, 219, 65, 0.05))',
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(19, 98, 159, 0.1), transparent)',
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            padding: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Header */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ 
              width: '80px', 
              height: '20px', 
              position: 'relative',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
              <Image
                src="/images/dikalo-logo.jpg"
                alt="Dikalo Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end"
            }}>
              <Box sx={{ 
                width: '120px', 
                height: '30px', 
                position: 'relative',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}>
                <Image
                  src="/images/afripaylogowhite.png"
                  alt="Afpay Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: '0.75rem',
                  mt: 0.5,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Powered by AfripayFinance ©
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                fontWeight: "500",
                transition: 'all 0.3s ease',
                '&.Mui-active': {
                  color: '#F3DB41',
                  fontWeight: "700",
                },
                '&.Mui-completed': {
                  color: '#13629F',
                }
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(19, 98, 159, 0.3)',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                '&.Mui-active': {
                  color: '#F3DB41',
                  transform: 'scale(1.2)',
                },
                '&.Mui-completed': {
                  color: '#13629F',
                }
              },
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ flex: 1 }}
            >
              <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                {activeStep === 0 && <ExchangeForm onSubmit={handleExchangeSubmit} />}
                {activeStep === 1 && (
                  <SenderKYC
                    onSubmit={handleSenderSubmit}
                    requireFullKYC={(transactionDetails?.sendAmount ?? 0) > 500}
                  />
                )}
                {activeStep === 2 && <PaymentMethod onSubmit={handlePaymentSubmit} />}
                {activeStep === 3 && <ReceiverInfo onSubmit={handleReceiverSubmit} />}
                {activeStep === 4 && transactionDetails && senderInfo && paymentInfo && receiverInfo && (
                  <ConfirmationPage
                    transaction={transactionDetails}
                    sender={senderInfo}
                    payment={paymentInfo}
                    receiver={receiverInfo}
                  />
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Container>
  );
};

console.log("DEBUG: CurrencyWidget Loaded ✅");
export default CurrencyWidget;