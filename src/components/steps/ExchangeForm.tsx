import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { TextField, Select, MenuItem, Button, Box, CircularProgress, Typography, Paper } from '@mui/material';
import * as Yup from 'yup';
import type { TransactionDetails } from '@/types';

// Define the valid currency types
type Currency = 'EUR' | 'XAF' | 'XOF' | 'NGN';

// Define the structure of the fixedRates object
type FixedRates = {
  [key in Currency]: {
    [key in Currency]: number;
  };
};

const currencies: Currency[] = ['EUR', 'XAF', 'XOF', 'NGN'];

// Fixed exchange rates
const fixedRates: FixedRates = {
  EUR: { XAF: 655.957, XOF: 655.957, NGN: 1050.0, EUR: 1 },
  XAF: { EUR: 0.00152452, XOF: 1, NGN: 1.6, XAF: 1 },
  XOF: { EUR: 0.00152452, XAF: 1, NGN: 1.6, XOF: 1 },
  NGN: { EUR: 0.00095238, XAF: 0.625, XOF: 0.625, NGN: 1 },
};

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

const calculateFees = (amount: number): number => amount * 0.0175; // 1.75% fee

const calculateReceiveAmount = (
  sendAmount: number,
  sendCurrency: Currency,
  receiveCurrency: Currency
): number => {
  if (!sendAmount) return 0;
  return sendAmount * fixedRates[sendCurrency][receiveCurrency];
};

const validationSchema = Yup.object().shape({
  sendAmount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1, 'Minimum amount is 1'),
  sendCurrency: Yup.string().required('Currency is required'),
  receiveCurrency: Yup.string().required('Currency is required'),
});

interface ExchangeFormProps {
  onSubmit: (details: TransactionDetails) => void;
}

const ExchangeForm = ({ onSubmit }: ExchangeFormProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{
        sendAmount: '',
        sendCurrency: 'EUR' as Currency,
        receiveCurrency: 'XAF' as Currency,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setLoading(true);
        const amount = Number(values.sendAmount);
        const fees = calculateFees(amount);
        const receiveAmount = calculateReceiveAmount(
          amount - fees,
          values.sendCurrency,
          values.receiveCurrency
        );

        onSubmit({
          sendAmount: amount,
          sendCurrency: values.sendCurrency,
          receiveAmount,
          receiveCurrency: values.receiveCurrency,
          fees,
          totalAmount: amount - fees,
        });
        setLoading(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => {
        const sendAmount = Number(values.sendAmount) || 0;
        const fees = calculateFees(sendAmount);
        const receiveAmount = calculateReceiveAmount(
          sendAmount - fees,
          values.sendCurrency,
          values.receiveCurrency
        );

        return (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                  You Send
                </Typography>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    name="sendAmount"
                    type="number"
                    placeholder="0.00"
                    value={values.sendAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sendAmount && Boolean(errors.sendAmount)}
                    helperText={touched.sendAmount && errors.sendAmount}
                    InputProps={{
                      sx: {
                        color: 'white',
                        '& input': {
                          color: 'white',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)',
                            opacity: 1
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#F3DB41' }
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                        margin: 0,
                        marginTop: 1
                      }
                    }}
                  />
                  <Select
                    name="sendCurrency"
                    value={values.sendCurrency}
                    onChange={handleChange}
                    sx={{
                      minWidth: 90,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F3DB41'
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#1A1A1A' }
                      }
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem 
                        key={currency} 
                        value={currency}
                        sx={{ 
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          '&.Mui-selected': { 
                            bgcolor: 'rgba(243, 219, 65, 0.2)',
                            '&:hover': { bgcolor: 'rgba(243, 219, 65, 0.3)' }
                          }
                        }}
                      >
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Paper>

              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                  Transaction Fee
                </Typography>
                <Typography variant="h6" sx={{ color: '#F3DB41' }}>
                  {fees.toFixed(2)} {values.sendCurrency}
                </Typography>
              </Paper>

              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                  Receiver Gets
                </Typography>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    disabled
                    value={receiveAmount.toFixed(2)}
                    InputProps={{
                      sx: {
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        bgcolor: 'rgba(19, 98, 159, 0.3)',
                        '& .Mui-disabled': {
                          WebkitTextFillColor: 'white !important'
                        }
                      }
                    }}
                  />
                  <Select
                    name="receiveCurrency"
                    value={values.receiveCurrency}
                    onChange={handleChange}
                    sx={{
                      minWidth: 90,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F3DB41'
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#1A1A1A' }
                      }
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem 
                        key={currency} 
                        value={currency}
                        sx={{ 
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          '&.Mui-selected': { 
                            bgcolor: 'rgba(243, 219, 65, 0.2)',
                            '&:hover': { bgcolor: 'rgba(243, 219, 65, 0.3)' }
                          }
                        }}
                      >
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Paper>

              {values.sendAmount && (
                <Typography 
                  variant="body1" 
                  textAlign="center"
                  sx={{ 
                    color: '#F3DB41',
                    fontWeight: 'bold',
                    my: 2
                  }}
                >
                  1 {values.sendCurrency} = {fixedRates[values.sendCurrency][values.receiveCurrency].toFixed(4)}{' '}
                  {values.receiveCurrency}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: '#13629F',
                  '&:hover': {
                    backgroundColor: '#0D4A7A'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(19, 98, 159, 0.5)'
                  }
                }}
              >
                {loading ? 'Processing...' : 'Continue'}
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
console.log("DEBUG: ExchangeForm Loaded ✅");
export default ExchangeForm;