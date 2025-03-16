import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://66.29.131.68:8101/api';
const PARTNER_ID = 'aL4oN7o9uu';
const PARTNER_SECRET = 'PN67b5e7151c71a1.337460399FSYZ2MMAQZMNNAUGD32QVI95GL';

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-PARTNER-ID': PARTNER_ID,
    'X-PARTNER-SECRET': PARTNER_SECRET,
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle API errors
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred. Please try again.';
    return Promise.reject(new Error(message));
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
    };
  };
}

interface TransactionData {
  sendAmount: number;
  sendCurrency: string;
  receiver: {
    phone: string;
    name: string;
    email: string;
    destination_country?: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/user/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.response.token);
      return response.data;
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
      phone_number: transactionData.receiver.phone,
      name: transactionData.receiver.name,
      email: transactionData.receiver.email,
      destination_country: transactionData.receiver.destination_country || 'Cameroon'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Transaction failed');
  }
};

export default apiClient;
