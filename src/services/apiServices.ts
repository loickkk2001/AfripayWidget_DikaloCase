import { getBalance, processTransaction } from './apiClient';
import type { UserInfo, ReceiverInfo, TransactionDetails, PaymentInfo } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class FinanceService {
  async getBalance(): Promise<{ currency: string; amount: number; }[]> {
    const response = await fetch(`${BASE_URL}/balance`);
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  }

  async processCashIn(data: { userId: string; amount: number; currency: string; phoneNumber: string; paymentMethod: string; }): Promise<{ success: boolean; data: { amount: number; transactionId: string; status: string; }; message: string; }> {
    const response = await fetch(`${BASE_URL}/transactions/cash-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Cash in failed');
    return result;
  }

  async verifyKYC(data: UserInfo): Promise<{ success: boolean; message?: string; data?: { verificationId: string; status: 'pending' | 'approved' | 'rejected'; riskLevel?: 'low' | 'medium' | 'high'; }; }> {
    const response = await fetch(`${BASE_URL}/kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message,
      data: result.data
    };
  }

  async processTransaction(
    transaction: TransactionDetails,
    sender: UserInfo,
    payment: PaymentInfo,
    receiver: ReceiverInfo
  ): Promise<{ success: boolean; data: { amount: number; transactionId: string; status: string; }; message: string; }> {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction,
        sender,
        payment,
        receiver
      }),
    });
    
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message,
      data: result.data
    };
  }
}

export const financeService = new FinanceService();

export default financeService; 