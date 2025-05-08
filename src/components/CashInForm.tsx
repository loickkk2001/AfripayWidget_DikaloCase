'use client';

import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCashIn } from '../hooks/useFinance';
import { 
  TextField, 
  Button, 
  MenuItem, 
  CircularProgress, 
  Alert, 
  Paper, 
  Typography, 
  Box
} from '@mui/material';

// The validation schema
const CashInSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Le montant est requis')
    .positive('Le montant doit être positif'),
  currency: Yup.string().required('La devise est requise'),
  phoneNumber: Yup.string()
    .required('Le numéro de téléphone est requis')
    .matches(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
  paymentMethod: Yup.string().required('La méthode de paiement est requise'),
});

// Available options
const currencies = ['XOF', 'USD', 'EUR', 'GHS'];
const paymentMethods = ['Mobile Money', 'Carte Bancaire', 'Bank Transfer'];

interface CashInFormProps {
  userId: string;
  setBalance: React.Dispatch<React.SetStateAction<number | null>>;
  onSuccess?: (transaction: any) => void;
}

const CashInForm: React.FC<CashInFormProps> = ({ userId, setBalance, onSuccess }) => {
  const { loading, error, transaction, processCashIn } = useCashIn();
  const [submitted, setSubmitted] = useState(false);

  const initialValues = {
    amount: '',
    currency: 'XOF',
    phoneNumber: '',
    paymentMethod: '',
    reference: '',
  };

  const handleSubmit = async (values: any) => {
    try {
      const result = await processCashIn({
        ...values,
        userId,
        amount: Number(values.amount),
      });

      setSubmitted(true);
      setBalance((prevBalance) => (prevBalance !== null ? prevBalance + result.data.amount : result.data.amount));
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Error processing cash-in:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom> Dépôt d'argent </Typography>
      {submitted && transaction ? (
        <Box textAlign="center">
          <Alert severity="success">Transaction initiée avec succès!</Alert>
          <Typography>ID de transaction: {transaction.data.transactionId}</Typography>
          <Typography>Statut: {transaction.data.status || 'En attente'}</Typography>
          <Button variant="contained" onClick={() => setSubmitted(false)}>Nouvelle transaction</Button>
        </Box>
      ) : (
        <Formik initialValues={initialValues} validationSchema={CashInSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Field name="amount">{({ field, meta }: any) => (
                <TextField {...field} label="Montant" type="number" fullWidth margin="normal" error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} />
              )}</Field>
              <Field name="currency">{({ field, meta }: any) => (
                <TextField {...field} select label="Devise" fullWidth margin="normal" error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error}>
                  {currencies.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                </TextField>
              )}</Field>
              <Field name="phoneNumber">{({ field, meta }: any) => (
                <TextField {...field} label="Numéro de téléphone" fullWidth margin="normal" error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} />
              )}</Field>
              <Field name="paymentMethod">{({ field, meta }: any) => (
                <TextField {...field} select label="Méthode de paiement" fullWidth margin="normal" error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error}>
                  {paymentMethods.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                </TextField>
              )}</Field>
              {error && (<Alert severity="error">{error.message}</Alert>)}
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || isSubmitting} sx={{ mt: 2 }} startIcon={loading && <CircularProgress size={20} color="inherit" />}>
                {loading ? 'Traitement en cours...' : 'Effectuer le dépôt'}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Paper>
  );
};

export default CashInForm;
