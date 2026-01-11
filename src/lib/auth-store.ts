import { supabase } from './supabase';

export const storeOtp = async (email: string, otp: string) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  
  // Clean up old OTPs for this email
  await supabase
    .from('otps')
    .delete()
    .eq('email', email.toLowerCase());

  const { error } = await supabase
    .from('otps')
    .insert([
      { 
        email: email.toLowerCase(), 
        otp, 
        expires_at: expiresAt 
      }
    ]);

  if (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) {
    return false;
  }

  if (new Date() > new Date(data.expires_at)) {
    await supabase.from('otps').delete().eq('email', email.toLowerCase());
    return false;
  }

  const isValid = data.otp === otp;
  if (isValid) {
    await supabase.from('otps').delete().eq('email', email.toLowerCase());
    
    // Create user if not exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (!user && !userError) {
      await supabase.from('users').insert([{ email: email.toLowerCase() }]);
    }
  }
  
  return isValid;
};
