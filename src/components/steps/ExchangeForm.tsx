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
            <Box className="form-container">
              <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: COLORS.paperBackground, color: COLORS.text }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: COLORS.text }}>
                  You Send
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    name="sendAmount"
                    type="number"
                    value={values.sendAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sendAmount && Boolean(errors.sendAmount)}
                    helperText={touched.sendAmount && errors.sendAmount}
                    InputLabelProps={{ style: { color: COLORS.text } }}
                    InputProps={{ style: { color: COLORS.text } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: COLORS.divider },
                        '&:hover fieldset': { borderColor: COLORS.text },
                      },
                      '& .MuiFormHelperText-root': {
                        color: COLORS.error,
                      },
                    }}
                  />
                  <Select
                    name="sendCurrency"
                    value={values.sendCurrency}
                    onChange={handleChange}
                    sx={{
                      minWidth: 100,
                      color: COLORS.text,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.text,
                      },
                      '& .MuiSvgIcon-root': {
                        color: COLORS.text,
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#333' },
                      },
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency} sx={{ color: COLORS.text }}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: COLORS.paperBackground, color: COLORS.text }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: COLORS.text }}>
                  Transaction Fee
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.text }}>
                  {fees.toFixed(2)} {values.sendCurrency}
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: COLORS.paperBackground, color: COLORS.text }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: COLORS.text }}>
                  Receiver Gets
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    disabled
                    value={receiveAmount ? receiveAmount.toFixed(2) : '0.00'}
                    InputProps={{
                      style: {
                        color: COLORS.text,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: COLORS.divider },
                      },
                      backgroundColor: 'rgba(19, 98, 159, 0.3)',
                    }}
                  />
                  <Select
                    name="receiveCurrency"
                    value={values.receiveCurrency}
                    onChange={handleChange}
                    sx={{
                      minWidth: 100,
                      color: COLORS.text,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.text,
                      },
                      '& .MuiSvgIcon-root': {
                        color: COLORS.text,
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#333' },
                      },
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency} sx={{ color: COLORS.text }}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Paper>

              {loading && (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={20} />
                </Box>
              )}

              {values.sendAmount && (
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={2} sx={{ color: COLORS.success, fontWeight: 'bold' }}>
                  1 {values.sendCurrency} = {fixedRates[values.sendCurrency][values.receiveCurrency].toFixed(4)}{' '}
                  {values.receiveCurrency}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="send-button"
                disabled={loading}
                sx={{
                  backgroundColor: `${COLORS.primary} !important`,
                  '&:hover': {
                    backgroundColor: `${COLORS.hoverPrimary} !important`,
                  },
                }}
              >
                Continue
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