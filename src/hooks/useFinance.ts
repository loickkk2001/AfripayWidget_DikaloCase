import { useState } from 'react';
import { FinanceService } from '../services/apiServices';

// Définition des interfaces pour vos types
interface TransactionData {
  amount: number;
  currency: string;
  phoneNumber: string;
  paymentMethod: string;
  reference?: string;
  userId?: string; // ✅ Added userId to TransactionData
}

interface CashInResponse {
  transactionId: string;
  status: string;
  amount: number; // ✅ Added amount to CashInResponse
}

interface BalanceResponse {
  balance: number; // ✅ Ensure balance is included
  currency: string;
  lastUpdated: string;
}

// Hook pour le cash-in
export function useCashIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transaction, setTransaction] = useState<CashInResponse | null>(null);

  const processCashIn = async (data: TransactionData): Promise<CashInResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await FinanceService.processCashIn(data);
      setTransaction(result); // ✅ Set transaction with CashInResponse
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (transactionId: string): Promise<CashInResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await FinanceService.checkTransactionStatus(transactionId);
      setTransaction((prev) => (prev ? { ...prev, status: result.status } : result));
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
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
    checkStatus,
  };
}

// Hook pour obtenir le solde
export const useBalance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);

  const getBalance = async (userId: string): Promise<BalanceResponse> => {
    setLoading(true);
    setError(null);

    try {
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
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, balance, getBalance };
};