import axios from 'axios';

const BASE_URL = 'http://66.29.131.68:8101/api';
const PARTNER_ID = 'aL4oN7o9uu';
const PARTNER_SECRET = 'PN67b5e7151c71a1.337460399FSYZ2MMAQZMNNAUGD32QVI95GL';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-PARTNER-ID': PARTNER_ID,
    'X-PARTNER-SECRET': PARTNER_SECRET,
  }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/user/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.response.token);
      return response.data.response;
    }
    throw new Error(response.data.message);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getBalance = async () => {
  try {
    const response = await apiClient.get('/partner/balance');
    const xafBalance = response.data.balances.find((b: any) => b.str_value.includes('XAF'));
    return [{
      currency: 'XAF',
      amount: parseFloat(xafBalance?.value || '0')
    }];
  } catch (error) {
    console.error('Balance fetch error:', error);
    throw error;
  }
};

export const processTransaction = async (data: any) => {
  try {
    const response = await apiClient.post('/partner/withdraw', {
      amount: data.sendAmount,
      currency: data.sendCurrency,
      phone_number: data.receiver.phone
    });
    
    return {
      success: response.data.success,
      data: {
        amount: data.sendAmount,
        transactionId: response.data.response?.id || '',
        status: response.data.success ? 'completed' : 'failed'
      },
      message: response.data.message
    };
  } catch (error: any) {
    console.error('Transaction error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Transaction failed',
      data: {
        amount: data.sendAmount,
        transactionId: '',
        status: 'failed'
      }
    };
  }
};

export default apiClient;
