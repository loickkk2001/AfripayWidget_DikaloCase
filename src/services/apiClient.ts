import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://66.29.131.68:8101/api';
const PARTNER_ID = 'aL4oN7o9uu';
const PARTNER_SECRET = 'PN67b5e7151c71a1.337460399FSYZ2MMAQZMNNAUGD32QVI95GL';

// Create Axios instance
const apiClient = axios.create({
<<<<<<< Updated upstream
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API base URL from .env
=======
  baseURL: BASE_URL,
>>>>>>> Stashed changes
  headers: {
    'Content-Type': 'application/json',
    'X-PARTNER-ID': PARTNER_ID,
    'X-PARTNER-SECRET': PARTNER_SECRET,
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use(
<<<<<<< Updated upstream
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
=======
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
>>>>>>> Stashed changes
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface LoginResponse {
  success: boolean;
  message: string;
  response: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      // Add other user fields as needed
    };
  };
}

interface TransactionData {
  sendAmount: number;
  sendCurrency: string;
  receiver: {
    phone: string;
    name: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post<LoginResponse>('/user/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.response.token);
      return response.data.response;
    }
    throw new Error(response.data.message);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getBalance = async () => {
  try {
    const response = await apiClient.get('/partner/balance');
    return response.data.balances;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch balance');
  }
};

export const processTransaction = async (transactionData: TransactionData) => {
  try {
    const response = await apiClient.post('/partner/withdraw', {
      amount: transactionData.sendAmount,
      currency: transactionData.sendCurrency,
      phone_number: transactionData.receiver.phone
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Transaction failed');
  }
};

export default apiClient;
