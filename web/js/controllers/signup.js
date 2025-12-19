// Sign Up Controller

export function init(appState) {
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('input-name');
  const phoneInput = document.getElementById('input-phone');
  const gradeSelect = document.getElementById('select-grade');
  const schoolInput = document.getElementById('input-school');
  
  // Back button
  document.getElementById('btn-auth-back').addEventListener('click', () => {
    navigate('welcome');
  });
  
  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate
    if (!nameInput.value.trim() || !phoneInput.value || phoneInput.value.length !== 10) {
      return;
    }
    
    // Save user data
    const userData = {
      name: nameInput.value.trim(),
      phone: '+91' + phoneInput.value,
      grade: gradeSelect.value,
      school: schoolInput.value.trim(),
      isGuest: false,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('atm_user', JSON.stringify(userData));
    
    // Update app state
    appState.studentContext.name = userData.name;
    appState.studentContext.grade = userData.grade;
    appState.studentContext.school = userData.school;
    
    // Navigate to home
    navigate('S0');
  });
  
  // Phone input - only allow numbers
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
  
  // Google sign in
  document.getElementById('btn-google').addEventListener('click', () => {
    // Mock Google sign in
    const userData = {
      name: 'Google User',
      email: 'user@gmail.com',
      isGuest: false,
      authProvider: 'google',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('atm_user', JSON.stringify(userData));
    appState.studentContext.name = userData.name;
    
    navigate('S0');
  });
  
  // Switch to sign in
  document.getElementById('link-signin').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('signin');
  });
}
