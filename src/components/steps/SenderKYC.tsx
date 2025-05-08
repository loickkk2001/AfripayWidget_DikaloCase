import React from 'react';
import { Formik, Form } from 'formik';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Button,
  Typography,
  Paper
} from '@mui/material';
import * as Yup from 'yup';
import type { UserInfo } from '@/types';

interface Props {
  onSubmit: (values: UserInfo) => void;
  requireFullKYC: boolean;
}

const countries = ["Cameroon", "Nigeria", "France", "Other"];

const SenderKYC: React.FC<Props> = ({ onSubmit, requireFullKYC }) => {
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
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              {requireFullKYC ? 'Enhanced Verification Required' : 'Basic Information'}
            </Typography>

            {requireFullKYC && (
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: 'rgba(243, 219, 65, 0.1)',
                  border: '1px solid rgba(243, 219, 65, 0.2)',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" sx={{ color: '#F3DB41' }}>
                  Additional verification required for amounts over 500 EUR
                </Typography>
              </Paper>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#F3DB41' }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main'
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#F3DB41' }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main'
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#F3DB41' }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main'
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Country</InputLabel>
              <Select
                name="country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.country && Boolean(errors.country)}
                sx={{
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
              >
                {countries.map(country => (
                  <MenuItem 
                    key={country} 
                    value={country}
                    sx={{
                      color: 'white',
                      bgcolor: '#1A1A1A',
                      '&:hover': {
                        bgcolor: 'rgba(243, 219, 65, 0.1)'
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(243, 219, 65, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(243, 219, 65, 0.3)'
                        }
                      }
                    }}
                  >
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {requireFullKYC && (
              <>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>ID Type</InputLabel>
                  <Select
                    name="idType"
                    value={values.idType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.idType && Boolean(errors.idType)}
                    sx={{
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
                  >
                    <MenuItem 
                      value="passport"
                      sx={{
                        color: 'white',
                        bgcolor: '#1A1A1A',
                        '&:hover': {
                          bgcolor: 'rgba(243, 219, 65, 0.1)'
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(243, 219, 65, 0.2)'
                        }
                      }}
                    >
                      Passport
                    </MenuItem>
                    <MenuItem 
                      value="idCard"
                      sx={{
                        color: 'white',
                        bgcolor: '#1A1A1A',
                        '&:hover': {
                          bgcolor: 'rgba(243, 219, 65, 0.1)'
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(243, 219, 65, 0.2)'
                        }
                      }}
                    >
                      National ID Card
                    </MenuItem>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#F3DB41' }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main'
                    }
                  }}
                />
              </>
            )}

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#13629F',
                '&:hover': {
                  backgroundColor: '#0D4A7A'
                }
              }}
            >
              Continue
            </Button>

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#13629F',
                '&:hover': {
                  backgroundColor: '#0D4A7A'
                }
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

console.log("DEBUG: SenderKYC Loaded ✅");
export default SenderKYC;
