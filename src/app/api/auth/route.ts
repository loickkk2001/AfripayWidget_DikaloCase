import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '206|I8j7AhZ0wRazJNUlUYgbov9sIz9vQgj0dipyXKAt42a06ba4n';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Simple authentication check
    if (email === process.env.API_AUTH_EMAIL && password === process.env.API_AUTH_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          email,
          userId: '1', // You can add more user data here
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        success: true,
        data: { token }
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid credentials'
    }, { status: 401 });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication failed'
    }, { status: 500 });
  }
}

// Helper function to verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
