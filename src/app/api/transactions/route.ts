import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock database for transactions
let transactions = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sendAmount, sendCurrency, receiveAmount, receiveCurrency, fees, totalAmount, sender, receiver, payment } = body;

    // Validate required fields
    if (!sendAmount || !sendCurrency || !receiveAmount || !receiveCurrency || !sender || !receiver || !payment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate transaction ID
    const transactionId = Math.random().toString(36).substring(7).toUpperCase();

    // Create transaction record
    const transaction = {
      id: transactionId,
      status: 'completed', // Mark as completed immediately for one-time payments
      timestamp: new Date().toISOString(),
      sendAmount,
      sendCurrency,
      receiveAmount,
      receiveCurrency,
      fees,
      totalAmount,
      sender,
      receiver,
      payment
    };

    // Store transaction
    transactions.set(transactionId, transaction);

    return NextResponse.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get transaction status
export async function GET(request: NextRequest) {
  const transactionId = request.nextUrl.searchParams.get('id');
  
  if (!transactionId) {
    return NextResponse.json(
      { success: false, message: 'Transaction ID is required' },
      { status: 400 }
    );
  }

  const transaction = transactions.get(transactionId);
  
  if (!transaction) {
    return NextResponse.json(
      { success: false, message: 'Transaction not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: transaction
  });
}

// Endpoint to confirm/process transaction
export async function PUT(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const transaction = transactions.get(transactionId);
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date().toISOString();
    transactions.set(transactionId, transaction);

    return NextResponse.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Transaction confirmation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 