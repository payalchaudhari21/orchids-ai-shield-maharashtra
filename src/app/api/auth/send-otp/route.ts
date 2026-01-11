import { Resend } from 'resend';
import { storeOtp } from '@/lib/auth-store';

let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (e) {
  console.error('Failed to initialize Resend:', e);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database
    await storeOtp(email, otp);

    // Send email using Resend
    // Note: If no API key or initialization failed, we simulate success for hackathon demo
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('Resend not configured. Simulating success...');
      return Response.json({ 
        success: true, 
        message: 'OTP sent (Simulated)', 
        debugOtp: otp // Included for easy testing when no API key
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'TrustNet.Ai <onboarding@resend.dev>',
      to: [email],
      subject: 'Your TrustNet.Ai Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #0a0a0a; color: #ffffff;">
          <h2 style="color: #00f2fe; text-align: center;">TrustNet.Ai</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for logging into the Cyber Safety Platform is:</p>
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #00f2fe; border: 1px solid #333; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">Secure Maharashtra, Secure India.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
