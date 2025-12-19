// Welcome Controller

export function init(appState) {
  // Get Started button - go to add first profile
  document.getElementById('btn-signup').addEventListener('click', () => {
    navigate('add-profile');
  });
  
  // Sign In button - for now just go to add profile
  // (In future, this could sync profiles from cloud)
  document.getElementById('btn-signin').addEventListener('click', () => {
    navigate('add-profile');
  });
  
  // Skip / Continue as Guest
  document.getElementById('btn-skip').addEventListener('click', () => {
    // Create a guest profile
    const guestProfile = {
      id: 'guest_' + Date.now(),
      name: 'Guest Learner',
      grade: null,
      avatar: 'yellow',
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    
    const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
    profiles.push(guestProfile);
    localStorage.setItem('atm_profiles', JSON.stringify(profiles));
    localStorage.setItem('atm_active_profile', guestProfile.id);
    
    appState.activeProfile = guestProfile;
    navigate('S0');
  });
}
