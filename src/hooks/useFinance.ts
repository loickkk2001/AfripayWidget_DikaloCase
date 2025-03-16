import { useState } from 'react';
import { financeService } from '../services/apiServices';
import type { TransactionDetails, UserInfo, PaymentInfo, ReceiverInfo } from '@/types';

interface TransactionResponse {
  success: boolean;
  data: any;
  message: string;
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
<<<<<<< Updated upstream
  const [balance, setBalance] = useState<BalanceResponse | null>(null);

  const getBalance = async (userId: string): Promise<BalanceResponse> => {
=======
  const [balance, setBalance] = useState<any[] | null>(null);

  const getBalance = async () => {
>>>>>>> Stashed changes
    setLoading(true);
    setError(null);

    try {
<<<<<<< Updated upstream
      // Check for authentication token
      const token = localStorage.getItem('authToken'); // or sessionStorage, or wherever you store it

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`/api/balance/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data: BalanceResponse = await response.json();
      setBalance(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
=======
      const response = await financeService.getBalance();
      setBalance(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
>>>>>>> Stashed changes
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
  return { loading, error, balance, getBalance };
=======
  return { 
    loading, 
    error, 
    balance, 
    getBalance,
    setBalance
  };
>>>>>>> Stashed changes
};