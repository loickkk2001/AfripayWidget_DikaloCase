import React from 'react';
import { Formik, Form } from 'formik';
import { TextField, Box, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import type { ReceiverInfo as ReceiverInfoType } from '@/types';

interface Props {
  onSubmit: (values: ReceiverInfoType) => void;
}

const ReceiverInfo: React.FC<Props> = ({ onSubmit }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name is too short'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .min(8, 'Phone number is too short')
  });

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: ''
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Receiver's Information
            </Typography>

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

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              className="send-button"
            >
              Continue
            </Button>

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              className="back-button"
            >
              Retourne
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
console.log("DEBUG: ReceiverInfo Loaded ✅");
export default ReceiverInfo;
