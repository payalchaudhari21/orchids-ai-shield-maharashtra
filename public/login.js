/**
 * LOGIN SYSTEM SCRIPT
 * Handles OTP generation via backend API and session management
 */

let userEmail = '';

/**
 * Move focus between OTP input boxes
 */
function moveFocus(current, nextIndex) {
    if (current.value.length >= 1 && nextIndex <= 6) {
        const nextInput = document.querySelectorAll('.otp-input')[nextIndex - 1];
        if (nextInput) nextInput.focus();
    }
    
    // Collect all inputs to hidden field
    const inputs = document.querySelectorAll('.otp-input');
    let fullOtp = '';
    inputs.forEach(input => fullOtp += input.value);
    document.getElementById('fullOtp').value = fullOtp;
}

/**
 * Send OTP to email via Backend API
 */
async function sendOTP() {
    const emailInput = document.getElementById('email');
    userEmail = emailInput.value.trim();

    if (!userEmail || !userEmail.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    // Show loading
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    overlay.classList.add('active');
    loadingText.innerText = 'Connecting to TrustNet.Ai Security Server...';

    try {
        const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (data.success) {
            loadingText.innerText = `OTP Sent to ${userEmail}`;
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Hide loading
            overlay.classList.remove('active');

            // Switch steps
            document.getElementById('emailStep').classList.remove('active');
            document.getElementById('otpStep').classList.add('active');

            // If it's a simulated success (no API key set), show debug OTP
            if (data.debugOtp) {
                showMockNotification(`[DEBUG MODE] OTP: ${data.debugOtp}`);
            } else {
                showMockNotification(`Email sent successfully to ${userEmail}`);
            }
        } else {
            overlay.classList.remove('active');
            alert('Error: ' + (data.error || 'Failed to send OTP'));
        }
    } catch (error) {
        overlay.classList.remove('active');
        console.error('Login Error:', error);
        alert('Connection failed. Please ensure the backend is running.');
    }
}

/**
 * Verify the entered OTP via Backend API
 */
async function verifyOTP() {
    const enteredOtp = document.getElementById('fullOtp').value;

    if (enteredOtp.length < 6) {
        alert('Please enter the complete 6-digit OTP');
        return;
    }

    // Show loading
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    overlay.classList.add('active');
    loadingText.innerText = 'Verifying with Security Hub...';

    try {
        const response = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp: enteredOtp })
        });

        const data = await response.json();

        if (data.success) {
            loadingText.innerText = 'Authentication Verified!';
            
            // Save session
            const session = {
                email: userEmail,
                loggedIn: true,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('ai_shield_session', JSON.stringify(session));
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Redirect to home
            window.location.href = 'index.html?login=success';
        } else {
            overlay.classList.remove('active');
            alert('Invalid OTP: ' + (data.error || 'Verification failed'));
            // Clear inputs
            document.querySelectorAll('.otp-input').forEach(input => input.value = '');
            document.querySelectorAll('.otp-input')[0].focus();
        }
    } catch (error) {
        overlay.classList.remove('active');
        alert('Connection error during verification.');
    }
}

/**
 * Resend OTP logic
 */
async function resendOTP() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');
    document.getElementById('loadingText').innerText = 'Requesting new OTP...';
    
    try {
        const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });
        const data = await response.json();
        overlay.classList.remove('active');
        
        if (data.success) {
            if (data.debugOtp) {
                showMockNotification(`[DEBUG MODE] New OTP: ${data.debugOtp}`);
            } else {
                showMockNotification(`New OTP sent to ${userEmail}`);
            }
        }
    } catch (error) {
        overlay.classList.remove('active');
        alert('Failed to resend OTP.');
    }
}

/**
 * Go back to email step
 */
function goBack() {
    document.getElementById('otpStep').classList.remove('active');
    document.getElementById('emailStep').classList.add('active');
}

/**
 * Show a notification
 */
function showMockNotification(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'rgba(0, 242, 255, 0.9)';
    toast.style.color = '#000';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 10px 30px rgba(0, 242, 255, 0.3)';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = '700';
    toast.style.fontFamily = 'Poppins, sans-serif';
    toast.style.animation = 'slideUp 0.5s ease-out';
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.5rem;">📧</span>
            <div>
                <div style="font-size: 0.7rem; opacity: 0.8; text-transform: uppercase;">System Update</div>
                <div>${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Keyframes for the toast
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 8000);
}

// Check if already logged in
window.onload = () => {
    const session = localStorage.getItem('ai_shield_session');
    if (session) {
        const data = JSON.parse(session);
        if (new Date().getTime() - data.timestamp < 24 * 60 * 60 * 1000) {
            // Optional: window.location.href = 'index.html';
        }
    }
};
