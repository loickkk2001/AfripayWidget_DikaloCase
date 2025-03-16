'use client';

import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { Stepper, Step, StepLabel, Box, Typography } from "@mui/material";
=======
import { Stepper, Step, StepLabel, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
>>>>>>> Stashed changes
import ExchangeForm from "@/components/steps/ExchangeForm";
import SenderKYC from "@/components/steps/SenderKYC";
import PaymentMethod from "@/components/steps/PaymentMethod";
import ReceiverInfo from "@/components/steps/ReceiverInfo";
import ConfirmationPage from "@/components/steps/ConfirmationPage";
import CashInForm from "@/components/CashInForm";
import BalanceDisplay from "@/components/BalanceDisplay";
import type {
  UserInfo,
  ReceiverInfo as ReceiverInfoType,
  TransactionDetails,
  PaymentInfo,
} from "@/types";
import Image from 'next/image';

<<<<<<< Updated upstream
const CurrencyWidget = ({ companyName = "Dikalo", userId }: { companyName?: string; userId: string }) => {
=======
interface CurrencyWidgetProps {
  userId: string;
}

const CurrencyWidget = ({ userId }: CurrencyWidgetProps) => {
  const [mounted, setMounted] = useState(false);
>>>>>>> Stashed changes
  const [activeStep, setActiveStep] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [senderInfo, setSenderInfo] = useState<UserInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfoType | null>(null);
<<<<<<< Updated upstream
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState<number | null>(null); // Add balance state

  // Check for authentication token on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token && !!userId);
    
    // Log for debugging
    console.log("Authentication status:", !!token, "UserID:", userId);
  }, [userId]);
=======
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
>>>>>>> Stashed changes

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

  // Handle successful cash-in to refresh balance
  const handleCashInSuccess = () => {
    // Find the BalanceDisplay ref and call its refresh method
    // Or simply force a component re-render
    setIsAuthenticated(false);
    setTimeout(() => setIsAuthenticated(true), 100);
  };

  return (
<<<<<<< Updated upstream
    <Box className="widget-container" sx={{ borderRadius: "10px", overflow: "hidden", bgcolor: "black", color: "white" }}>
      <Box className="widget-header">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mb: 2 }}>
          <Box>
            <Image 
              src="/images/dikalo-logo.jpg" 
              alt="Dikalo Logo" 
              width={80} 
              height={20} 
              style={{ height: '20px', width: 'auto' }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Image 
              src="/images/afripaylogowhite.png" 
              alt="Afpay Logo" 
              width={120} 
              height={30}
              style={{ height: '30px', width: 'auto' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Powered by AfripayFinance ©
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Only show account info if authenticated */}
      {isAuthenticated && (
        <Box className="widget-finance" sx={{ mb: 4, p: 2, bgcolor: "#1E1E1E", borderRadius: "10px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your Account</Typography>
          <BalanceDisplay userId={userId} autoRefresh={true} setBalance={setBalance} />
        </Box>
      )}

      {/* Main step flow or cash-in form */}
      {activeStep === 5 ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Deposit Funds</Typography>
          <CashInForm userId={userId} setBalance={setBalance} onSuccess={handleCashInSuccess} />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography 
              variant="button" 
              sx={{ cursor: 'pointer', color: '#F3DB41' }}
              onClick={() => setActiveStep(0)}
            >
              Return to Exchange
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-label": { color: "white", fontWeight: "bold" },
              "& .MuiStepIcon-root": { color: "#13629F" },
              "& .MuiStepIcon-text": { fill: "white", fontSize: "16px" },
              "& .MuiStepIcon-root.Mui-active": { color: "#F3DB41" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#F3DB41" },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>
                  <Typography sx={{ color: 'white' }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box className="widget-content" sx={{ mt: 3 }}>
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
                balance={balance} // Pass balance prop
              />
            )}
          </Box>
        </>
      )}

      {/* Add option to deposit funds */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography 
          variant="button" 
          sx={{ cursor: 'pointer', color: '#F3DB41' }}
          onClick={() => setActiveStep(activeStep === 5 ? 0 : 5)}
        >
          {activeStep === 5 ? 'Back to Exchange' : 'Need to deposit funds?'}
        </Typography>
=======
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
        padding: { xs: '16px', sm: '20px' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: { xs: '100vh', sm: 'auto' },
        backgroundColor: 'black',
        borderRadius: { xs: 0, sm: '10px' },
        boxShadow: { xs: 'none', sm: '0 4px 6px rgba(0, 0, 0, 0.1)' },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        width: "100%",
        mb: 2
      }}>
        <Box sx={{ width: '80px', height: '20px', position: 'relative' }}>
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
          <Box sx={{ width: '120px', height: '30px', position: 'relative' }}>
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
              fontSize: '0.75rem'
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
          mb: 3,
          '& .MuiStepLabel-label': { 
            color: 'white', 
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            fontWeight: "bold",
            whiteSpace: 'nowrap',
          },
          '& .MuiStepIcon-root': { 
            color: '#13629F',
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          },
          '& .MuiStepIcon-text': { 
            fill: 'white', 
            fontSize: '0.7rem'
          },
          '& .MuiStepIcon-root.Mui-active': { 
            color: '#F3DB41' 
          },
          '& .MuiStepIcon-root.Mui-completed': { 
            color: '#F3DB41' 
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
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        color: 'white',
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
>>>>>>> Stashed changes
      </Box>
    </Box>
  );
};

console.log("DEBUG: CurrencyWidget Loaded ✅");
export default CurrencyWidget;