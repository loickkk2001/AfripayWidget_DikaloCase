import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// Define types for our transaction data
interface Transaction {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  completedAt?: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  fees: number;
  totalAmount: number;
  sender: {
    name: string;
    email: string;
    phone: string;
    country: string;
    idType?: string;
    idNumber?: string;
  };
  receiver: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    paymentMethod: 'card' | 'orange' | 'mtn';
    details: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      phoneNumber?: string;
    };
  };
}

// In-memory store for transactions (replace with database in production)
const transactions = new Map<string, Transaction>();

// Validation schema for transaction creation
const transactionSchema = z.object({
  sendAmount: z.number().positive(),
  sendCurrency: z.string().min(3),
  receiveAmount: z.number().positive(),
  receiveCurrency: z.string().min(3),
  fees: z.number().min(0),
  totalAmount: z.number().positive(),
  sender: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    country: z.string().min(2),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
  }),
  receiver: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
  }),
  payment: z.object({
    paymentMethod: z.enum(['card', 'orange', 'mtn']),
    details: z.object({
      cardNumber: z.string().optional(),
      expiryDate: z.string().optional(),
      cvv: z.string().optional(),
      phoneNumber: z.string().optional(),
    }),
  }),
});

// Helper function to generate transaction ID
function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
}

// Helper function to validate amount limits
function validateAmountLimits(amount: number, currency: string): boolean {
  const limits = {
    EUR: { min: 10, max: 10000 },
    XAF: { min: 5000, max: 5000000 },
    XOF: { min: 5000, max: 5000000 },
    NGN: { min: 5000, max: 5000000 },
  };
  
  const currencyLimits = limits[currency as keyof typeof limits];
  if (!currencyLimits) return false;
  
  return amount >= currencyLimits.min && amount <= currencyLimits.max;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validationResult = transactionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validate amount limits
    if (!validateAmountLimits(data.sendAmount, data.sendCurrency)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount exceeds limits for the selected currency' 
        },
        { status: 400 }
      );
    }

    // Validate payment method details
    if (data.payment.paymentMethod === 'card' && 
        (!data.payment.details.cardNumber || 
         !data.payment.details.expiryDate || 
         !data.payment.details.cvv)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing card payment details' 
        },
        { status: 400 }
      );
    }

    if ((data.payment.paymentMethod === 'orange' || data.payment.paymentMethod === 'mtn') && 
        !data.payment.details.phoneNumber) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing mobile money phone number' 
        },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction: Transaction = {
      id: generateTransactionId(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      ...data
    };

    // Store transaction
    transactions.set(transaction.id, transaction);

    // Process the transaction (simulate async processing)
    setTimeout(() => {
      const updatedTransaction = transactions.get(transaction.id);
      if (updatedTransaction) {
        updatedTransaction.status = 'completed';
        updatedTransaction.completedAt = new Date().toISOString();
        transactions.set(transaction.id, updatedTransaction);
      }
    }, 2000);

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        status: transaction.status,
        timestamp: transaction.timestamp
      }
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Transaction ID is required' 
        },
        { status: 400 }
      );
    }

    const transaction = transactions.get(transactionId);
    
    if (!transaction) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Transaction not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: transaction.id,
        status: transaction.status,
        timestamp: transaction.timestamp,
        completedAt: transaction.completedAt,
        sendAmount: transaction.sendAmount,
        sendCurrency: transaction.sendCurrency,
        receiveAmount: transaction.receiveAmount,
        receiveCurrency: transaction.receiveCurrency,
        fees: transaction.fees
      }
    });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 