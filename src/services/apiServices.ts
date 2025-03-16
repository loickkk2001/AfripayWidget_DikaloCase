import { login, getBalance, processTransaction } from './apiClient';
import type { UserInfo, ReceiverInfo, TransactionDetails, PaymentInfo } from '@/types';

interface TransactionResponse {
  success: boolean;
  data: any;
  message: string;
}

export const authService = {
  login: async (email: string, password: string) => {
    return login(email, password);
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export const financeService = {
  getBalance: async () => {
    try {
      const response = await getBalance();
      return response;
    } catch (error: any) {
      console.error('Balance fetch error:', error);
      throw new Error(error.message || 'Failed to fetch balance');
    }
  },

  processTransaction: async (
    transaction: TransactionDetails,
    sender: UserInfo,
    payment: PaymentInfo,
    receiver: ReceiverInfo
  ): Promise<TransactionResponse> => {
    try {
      const response = await processTransaction({
        sendAmount: transaction.sendAmount,
        sendCurrency: transaction.sendCurrency,
        receiver: {
          phone: receiver.phone,
          name: receiver.name,
          email: receiver.email,
          destination_country: 'Cameroon'
        }
      });

      return {
        success: true,
        data: response,
        message: 'Transaction processed successfully'
      };
    } catch (error: any) {
      console.error('Transaction processing error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to process transaction'
      };
    }
  }
};

export default {
  auth: authService,
  finance: financeService
}; 