'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const sendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);
    setLoadingText('Connecting to TrustNet Security Server...');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setLoadingText(`OTP Sent to ${email}`);
        if (data.debugOtp) setDebugOtp(data.debugOtp);
        
        setTimeout(() => {
          setIsLoading(false);
          setStep(2);
        }, 800);
      } else {
        setIsLoading(false);
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection failed. Please try again.');
    }
  };

  const verifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError('');
    setIsLoading(true);
    setLoadingText('Verifying with Security Hub...');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp })
      });

      const data = await response.json();

      if (data.success) {
        setLoadingText('Authentication Verified!');
        
        // Save session
        const session = {
          email: email,
          loggedIn: true,
          timestamp: new Date().getTime()
        };
        localStorage.setItem('trustnet_session', JSON.stringify(session));
        
        setTimeout(() => {
          window.location.href = '/index.html?login=success';
        }, 800);
      } else {
        setIsLoading(false);
        setError(data.error || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error during verification.');
    }
  };

  return (
    <div className="login-page-container">
      <style jsx global>{`
        .login-page-container {
          --login-bg: #05070a;
          --card-bg: rgba(13, 18, 26, 0.8);
          --input-bg: rgba(20, 27, 38, 0.9);
          --border-color: rgba(0, 242, 255, 0.2);
          --primary-color: #00f2fe;
          background: var(--login-bg);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          color: white;
          font-family: 'Poppins', sans-serif;
        }

        .login-bg-effects {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .grid-bg {
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .glow-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 242, 255, 0.15) 0%, transparent 70%);
          filter: blur(50px);
        }

        .login-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 450px;
          animation: fadeIn 0.8s ease-out;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          text-decoration: none;
          margin-bottom: 1.5rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
        }

        .logo-highlight {
          color: var(--primary-color);
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.8rem;
          color: #8892b0;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.2rem;
          font-size: 1.2rem;
        }

        input[type="email"] {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1rem 1rem 3.2rem;
          color: #fff;
          font-size: 1rem;
        }

        .otp-inputs {
          display: flex;
          gap: 0.8rem;
          justify-content: space-between;
        }

        .otp-input {
          width: 100%;
          height: 3.5rem;
          background: var(--input-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
          border: none;
          border-radius: 12px;
          padding: 1.2rem;
          color: #0a0a0f;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .error-message {
          color: #ff4d4d;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          text-align: center;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 242, 255, 0.1);
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .debug-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 242, 255, 0.9);
          color: #000;
          padding: 15px 25px;
          border-radius: 10px;
          z-index: 9999;
          font-weight: 700;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      <div className="login-bg-effects">
        <div className="grid-bg"></div>
        <div className="glow-effect"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">TrustNet.Ai</span>
          </Link>
          <h1>Citizen Login</h1>
          <p>Secure access to the cyber safety platform</p>
        </div>

        {step === 1 ? (
          <form onSubmit={sendOTP}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
            <button type="submit" className="btn-primary">
              Send OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <div className="form-group">
              <label>Enter 6-Digit OTP</label>
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpInputs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ))}
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
            <button type="submit" className="btn-primary">
              Verify & Login
            </button>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{ background: 'none', border: 'none', color: '#00f2fe', cursor: 'pointer' }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loader"></div>
            <p>{loadingText}</p>
          </div>
        )}
      </div>

      {debugOtp && (
        <div className="debug-toast">
          📧 [DEBUG MODE] OTP: {debugOtp}
        </div>
      )}
    </div>
  );
}
