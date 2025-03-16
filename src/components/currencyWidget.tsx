'use client';

import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box, Typography } from "@mui/material";
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

const CurrencyWidget = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [senderInfo, setSenderInfo] = useState<UserInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfoType | null>(null);

  const steps = ["Exchange", "Your Information", "Payment Method", "Receiver Information", "Confirmation"];

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

  return (
    <Box 
      className="widget-container" 
      sx={{ 
        width: '400px',
        maxWidth: '100%',
        minHeight: '500px',
        maxHeight: '700px',
        borderRadius: "10px",
        overflow: "hidden",
        bgcolor: "black",
        color: "white",
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box className="widget-header" sx={{ mb: 2 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%"
        }}>
          <Box sx={{ width: '80px' }}>
            <Image 
              src="/images/dikalo-logo.jpg" 
              alt="Dikalo Logo" 
              width={80} 
              height={20} 
              priority
              style={{ 
                height: 'auto',
                width: '100%',
                maxWidth: '80px'
              }}
            />
          </Box>
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "flex-end"
          }}>
            <Box sx={{ width: '120px' }}>
              <Image 
                src="/images/afripaylogowhite.png" 
                alt="Afpay Logo" 
                width={120} 
                height={30}
                priority
                style={{ 
                  height: 'auto',
                  width: '100%',
                  maxWidth: '120px'
                }}
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
      </Box>

      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#13629F',
          borderRadius: '4px'
        }
      }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 2,
            '& .MuiStepLabel-label': { 
              color: 'white', 
              fontSize: '0.8rem',
              fontWeight: "bold" 
            },
            '& .MuiStepIcon-root': { 
              color: '#13629F',
              fontSize: '1.5rem'
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
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box className="widget-content">
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
      </Box>
    </Box>
  );
};

console.log("DEBUG: CurrencyWidget Loaded ✅");
export default CurrencyWidget;