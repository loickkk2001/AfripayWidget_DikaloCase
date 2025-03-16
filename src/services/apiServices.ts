import { login, getBalance, processTransaction } from './apiClient';
import type { UserInfo, ReceiverInfo, TransactionDetails, PaymentInfo } from '@/types';

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
    return getBalance();
  },

  processTransaction: async (
    transaction: TransactionDetails,
    sender: UserInfo,
    payment: PaymentInfo,
    receiver: ReceiverInfo
  ) => {
    try {
      // Format the data according to the API's expectations
      const response = await processTransaction({
        sendAmount: transaction.sendAmount,
        sendCurrency: transaction.sendCurrency,
        receiver: {
          phone: receiver.phone,
          name: receiver.name
        }
      });

      return {
        success: true,
        data: response,
        message: 'Transaction processed successfully'
      };
    } catch (error: any) {
      console.error('Transaction processing error:', error);
      throw new Error(error.message || 'Failed to process transaction');
    }
  }
};

export default {
  auth: authService,
  finance: financeService
}; 