import { useState } from 'react';
import { financeService } from '../services/apiServices';
import type { TransactionDetails, UserInfo, PaymentInfo, ReceiverInfo } from '@/types';

interface TransactionResponse {
  success: boolean;
  data: any;
  message: string;
}

interface Balance {
  currency: string;
  amount: number;
}

export function useTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

  const processTransaction = async (
    transactionDetails: TransactionDetails,
    sender: UserInfo,
    payment: PaymentInfo,
    receiver: ReceiverInfo
  ): Promise<TransactionResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await financeService.processTransaction(
        transactionDetails,
        sender,
        payment,
        receiver
      );
      setTransaction(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    transaction,
    processTransaction,
  };
}

export const useBalance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [balance, setBalance] = useState<Balance[] | null>(null);

  const getBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await financeService.getBalance();
      setBalance(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    balance, 
    getBalance,
    setBalance
  };
};