import { useState } from 'react';
import { financeService } from '../services/apiServices';
import type { TransactionDetails, UserInfo, PaymentInfo, ReceiverInfo } from '@/types';

interface TransactionResponse {
  success: boolean;
  data: {
    amount: number;
    transactionId: string;
    status: string;
  };
  message: string;
}

interface Balance {
  currency: string;
  amount: number;
}

interface CashInData {
  userId: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  paymentMethod: string;
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
      // First check balance
      const balance = await financeService.getBalance();
      const xafBalance = balance.find(b => b.currency === 'XAF');
      
      if (!xafBalance || xafBalance.amount < transactionDetails.sendAmount) {
        throw new Error('Insufficient balance');
      }

      // Process the transaction
      const result = await financeService.processTransaction(
        transactionDetails,
        sender,
        payment,
        receiver
      );

      if (!result.success) {
        throw new Error(result.message || 'Transaction failed');
      }

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

export function useCashIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

  const processCashIn = async (data: CashInData): Promise<TransactionResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await financeService.processCashIn(data);
      setTransaction(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Cash-in failed');
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
    processCashIn,
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
      return response;
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