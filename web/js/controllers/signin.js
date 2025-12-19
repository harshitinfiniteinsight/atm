// Sign In Controller

export function init(appState) {
  const form = document.getElementById('signin-form');
  const phoneInput = document.getElementById('input-phone');
  const otpSection = document.getElementById('otp-section');
  const otpInputs = document.querySelectorAll('.otp-input');
  
  // Back button
  document.getElementById('btn-auth-back').addEventListener('click', () => {
    navigate('welcome');
  });
  
  // Phone input - only allow numbers
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
  
  // Form submit - Send OTP
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!phoneInput.value || phoneInput.value.length !== 10) {
      return;
    }
    
    // Show OTP section
    document.getElementById('otp-phone').textContent = '+91 ' + phoneInput.value;
    form.style.display = 'none';
    otpSection.classList.remove('hidden');
    
    // Focus first OTP input
    otpInputs[0].focus();
  });
  
  // OTP inputs - auto focus next
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value.replace(/\D/g, '');
      e.target.value = value;
      
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
  
  // Verify OTP
  document.getElementById('btn-verify').addEventListener('click', () => {
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    
    if (otp.length !== 4) {
      return;
    }
    
    // Mock verification - accept any 4-digit OTP
    const userData = {
      phone: '+91' + phoneInput.value,
      isGuest: false,
      lastLogin: new Date().toISOString()
    };
    
    // Check if user exists (mock)
    const existingUser = localStorage.getItem('atm_user');
    if (existingUser) {
      const existing = JSON.parse(existingUser);
      userData.name = existing.name || 'User';
      userData.grade = existing.grade;
      userData.school = existing.school;
    }
    
    localStorage.setItem('atm_user', JSON.stringify(userData));
    
    if (userData.name) {
      appState.studentContext.name = userData.name;
    }
    if (userData.grade) {
      appState.studentContext.grade = userData.grade;
    }
    if (userData.school) {
      appState.studentContext.school = userData.school;
    }
    
    navigate('S0');
  });
  
  // Resend OTP
  document.getElementById('btn-resend').addEventListener('click', () => {
    // Clear OTP inputs
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
    
    // Show toast
    showToast('OTP sent again!');
  });
  
  // Google sign in
  document.getElementById('btn-google').addEventListener('click', () => {
    const userData = {
      name: 'Google User',
      email: 'user@gmail.com',
      isGuest: false,
      authProvider: 'google',
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('atm_user', JSON.stringify(userData));
    appState.studentContext.name = userData.name;
    
    navigate('S0');
  });
  
  // Switch to sign up
  document.getElementById('link-signup').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('signup');
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
