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
  const [balance, setBalanceState] = useState<number | null>(null);

  const getBalance = async (userId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await FinanceService.getBalance(userId);
      setBalanceState(response.balance);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
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
    setBalance: setBalanceState 
  };
};