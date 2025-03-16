import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, country, idType, idNumber } = body;

    // Basic validation
    if (!name || !email || !phone || !country) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // For demo purposes, we'll auto-approve all KYC requests
    // In production, you would integrate with a real KYC service
    const kycResponse = {
      success: true,
      data: {
        verificationId: Math.random().toString(36).substring(7),
        status: 'approved',
        timestamp: new Date().toISOString(),
        user: {
          name,
          email,
          phone,
          country,
          ...(idType && { idType }),
          ...(idNumber && { idNumber })
        }
      }
    };

    return NextResponse.json(kycResponse, { status: 200 });
  } catch (error) {
    console.error('KYC verification error:', error);
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
  return NextResponse.json({}, { status: 200 });
} 