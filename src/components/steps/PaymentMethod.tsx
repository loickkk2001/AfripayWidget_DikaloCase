import React from 'react';
import { Formik, Form } from 'formik';
import { TextField, Box, Button, Typography, RadioGroup, FormControlLabel, Radio, Paper, Grid } from '@mui/material';
import * as Yup from 'yup';
import type { PaymentInfo } from '@/types';

interface PaymentMethodProps {
  onSubmit: (info: PaymentInfo) => void;
}

const PaymentMethod = ({ onSubmit }: PaymentMethodProps) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'card' | 'orange' | 'mtn'>('card');

  const validationSchema = Yup.object().shape({
    paymentMethod: Yup.string().required('Payment method is required'),
    ...(selectedMethod === 'card' && {
      cardNumber: Yup.string()
        .required('Card number is required')
        .matches(/^\d{16}$/, 'Card number must be 16 digits'),
      expiryDate: Yup.string()
        .required('Expiry date is required')
        .matches(/^\d{2}\/\d{2}$/, 'Format must be MM/YY'),
      cvv: Yup.string()
        .required('CVV is required')
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    }),
    ...(selectedMethod === 'orange' && {
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .min(8, 'Phone number is too short'),
    }),
    ...(selectedMethod === 'mtn' && {
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .min(8, 'Phone number is too short'),
    }),
  });

  return (
    <Formik
      initialValues={{
        paymentMethod: 'card' as 'card' | 'orange' | 'mtn', // Explicitly cast to the correct type
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        phoneNumber: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          paymentMethod: values.paymentMethod as 'card' | 'orange' | 'mtn', // Explicitly cast to the correct type
          details:
            selectedMethod === 'card'
              ? {
                  cardNumber: values.cardNumber,
                  expiryDate: values.expiryDate,
                  cvv: values.cvv,
                }
              : { phoneNumber: values.phoneNumber },
        });
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Box className="form-container">
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Payment Method
            </Typography>

            <RadioGroup
              name="paymentMethod"
              value={values.paymentMethod}
              onChange={(e) => {
                setFieldValue('paymentMethod', e.target.value);
                setSelectedMethod(e.target.value as 'card' | 'orange' | 'mtn');
              }}
            >
              <Paper elevation={3} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <FormControlLabel
                  value="card"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#F3DB41' } }} />}
                  label="Credit Card / Carte Bancaire"
                  sx={{ color: 'white' }}
                />

                {values.paymentMethod === 'card' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      name="cardNumber"
                      label="Card Number"
                      value={values.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cardNumber && Boolean(errors.cardNumber)}
                      helperText={touched.cardNumber && errors.cardNumber}
                      margin="normal"
                      InputLabelProps={{ style: { color: 'white' } }}
                      InputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&:hover fieldset': { borderColor: 'white' },
                        },
                      }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          name="expiryDate"
                          label="Expiry Date (MM/YY)"
                          value={values.expiryDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.expiryDate && Boolean(errors.expiryDate)}
                          helperText={touched.expiryDate && errors.expiryDate}
                          margin="normal"
                          InputLabelProps={{ style: { color: 'white' } }}
                          InputProps={{ style: { color: 'white' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                              '&:hover fieldset': { borderColor: 'white' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          name="cvv"
                          label="CVV"
                          value={values.cvv}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.cvv && Boolean(errors.cvv)}
                          helperText={touched.cvv && errors.cvv}
                          margin="normal"
                          InputLabelProps={{ style: { color: 'white' } }}
                          InputProps={{ style: { color: 'white' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                              '&:hover fieldset': { borderColor: 'white' },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>

              <Paper elevation={3} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <FormControlLabel
                  value="orange"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#F3DB41' } }} />}
                  label="Orange Money"
                  sx={{ color: 'white' }}
                />

                {values.paymentMethod === 'orange' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      label="Orange Money Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      margin="normal"
                      InputLabelProps={{ style: { color: 'white' } }}
                      InputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&:hover fieldset': { borderColor: 'white' },
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>

              <Paper elevation={3} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <FormControlLabel
                  value="mtn"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#F3DB41' } }} />}
                  label="MTN Mobile Money"
                  sx={{ color: 'white' }}
                />

                {values.paymentMethod === 'mtn' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      label="MTN Mobile Money Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      margin="normal"
                      InputLabelProps={{ style: { color: 'white' } }}
                      InputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&:hover fieldset': { borderColor: 'white' },
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </RadioGroup>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="send-button"
              sx={{
                backgroundColor: '#13629F !important',
                '&:hover': {
                  backgroundColor: '#0D4A7A !important',
                },
              }}
            >
              Continue
            </Button>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="back-button"
              sx={{
                backgroundColor: '#13629F !important',
                '&:hover': {
                  backgroundColor: '#0D4A7A !important',
                },
              }}
            >
              Retourne
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
console.log("DEBUG: PaymentMethod Loaded ✅");
export default PaymentMethod;