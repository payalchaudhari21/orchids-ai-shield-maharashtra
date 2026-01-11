import { verifyOtp } from '@/lib/auth-store';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const isValid = await verifyOtp(email, otp);

    if (isValid) {
      // In a real app, you would create a session/JWT here
      return Response.json({ 
        success: true, 
        message: 'Authentication successful',
        user: { email } 
      });
    } else {
      return Response.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
