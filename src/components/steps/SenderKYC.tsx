import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Button,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import type { UserInfo } from '@/types';
import apiClient from '@/services/apiClient'; // Import API client

interface Props {
  onSubmit: (values: UserInfo) => void;
  requireFullKYC: boolean;
}

const countries = ["Cameroon", "Nigeria", "France", "Other"];

const SenderKYC: React.FC<Props> = ({ onSubmit, requireFullKYC }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name is too short'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required').min(8, 'Phone number is too short'),
    country: Yup.string().required('Country is required'),
    ...(requireFullKYC && {
      idType: Yup.string().required('ID type is required'),
      idNumber: Yup.string().required('ID number is required'),
    }),
  });

  const handleFormSubmit = async (values: UserInfo) => {
    setApiError(null); // Reset error message before submission
    try {
      const response = await apiClient.post('/kyc/verify', values); // API Call
      if (response.status === 200) {
        console.log("DEBUG: KYC Submission Successful ✅", response.data);
        onSubmit(values); // Proceed if successful
      } else {
        throw new Error(response.data?.message || "Unknown API error");
      }
    } catch (error: any) {
      console.error("DEBUG: KYC API Error ❌", error);
      setApiError(error.message || "Failed to verify KYC");
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '',
        country: '',
        idType: '',
        idNumber: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit} // Use the new submit handler
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {requireFullKYC ? 'Enhanced Verification Required' : 'Basic Information'}
            </Typography>

            {apiError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {apiError}
              </Typography>
            )}

            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              margin="normal"
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: "5px" }}
            />

            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              margin="normal"
            />

            <TextField
              fullWidth
              name="phone"
              label="Phone Number"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.country && Boolean(errors.country)}
              >
                {countries.map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {requireFullKYC && (
              <>
                <Typography variant="subtitle2" color="primary" mt={2} mb={1}>
                  Additional verification required for amounts over 500 EUR
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    name="idType"
                    value={values.idType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.idType && Boolean(errors.idType)}
                  >
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="idCard">National ID Card</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  name="idNumber"
                  label="ID Number"
                  value={values.idNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.idNumber && Boolean(errors.idNumber)}
                  helperText={touched.idNumber && errors.idNumber}
                  margin="normal"
                />
              </>
            )}

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              className="send-button"
            >
              Continue
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

console.log("DEBUG: SenderKYC Loaded ✅");
export default SenderKYC;
