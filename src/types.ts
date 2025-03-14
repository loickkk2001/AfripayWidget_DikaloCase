// src/types.ts
export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  idType?: string;
  idNumber?: string;
}

export interface ReceiverInfo {
  name: string;
  email: string;
  phone: string;
}

export interface TransactionDetails {
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  fees: number;
  totalAmount: number;
}

export interface PaymentInfo {
  paymentMethod: 'card' | 'orange' | 'mtn';
  details: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    phoneNumber?: string;
  };
}