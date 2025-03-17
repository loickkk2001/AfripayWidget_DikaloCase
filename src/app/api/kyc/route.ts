import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { NextRequest } from 'next/server';

// Define types for KYC verification
interface KYCVerification {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  completedAt?: string;
  user: {
    name: string;
    email: string;
    phone: string;
    country: string;
    idType?: string;
    idNumber?: string;
  };
  riskLevel?: 'low' | 'medium' | 'high';
}

// In-memory store for KYC verifications (replace with database in production)
const kycVerifications = new Map<string, KYCVerification>();

// Validation schema for KYC submission
const kycSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  country: z.string().min(2),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
});

// Helper function to generate verification ID
function generateVerificationId(): string {
  return `KYC${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
}

// Helper function to assess risk level
function assessRiskLevel(user: KYCVerification['user']): 'low' | 'medium' | 'high' {
  // Simple risk assessment based on country and ID verification
  const highRiskCountries = ['Nigeria', 'Cameroon'];
  const hasIdVerification = user.idType && user.idNumber;

  if (highRiskCountries.includes(user.country) && !hasIdVerification) {
    return 'high';
  } else if (highRiskCountries.includes(user.country) && hasIdVerification) {
    return 'medium';
  } else if (!hasIdVerification) {
    return 'medium';
  }
  return 'low';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validationResult = kycSchema.safeParse(body);
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

    // Create verification record
    const verification: KYCVerification = {
      id: generateVerificationId(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      user: data,
      riskLevel: assessRiskLevel(data)
    };

    // Store verification
    kycVerifications.set(verification.id, verification);

    // Process the verification (simulate async processing)
    setTimeout(() => {
      const updatedVerification = kycVerifications.get(verification.id);
      if (updatedVerification) {
        updatedVerification.status = updatedVerification.riskLevel === 'high' ? 'rejected' : 'approved';
        updatedVerification.completedAt = new Date().toISOString();
        kycVerifications.set(verification.id, updatedVerification);
      }
    }, 2000);

    return NextResponse.json({
      success: true,
      data: {
        verificationId: verification.id,
        status: verification.status,
        riskLevel: verification.riskLevel,
        timestamp: verification.timestamp
      }
    });
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

export async function GET(request: NextRequest) {
  try {
    const verificationId = request.nextUrl.searchParams.get('id');
    
    if (!verificationId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Verification ID is required' 
        },
        { status: 400 }
      );
    }

    const verification = kycVerifications.get(verificationId);
    
    if (!verification) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Verification not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: verification.id,
        status: verification.status,
        riskLevel: verification.riskLevel,
        timestamp: verification.timestamp,
        completedAt: verification.completedAt
      }
    });
  } catch (error) {
    console.error('KYC verification fetch error:', error);
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
    },
  });
} 