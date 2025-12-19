// Profile Select Controller

// Avatar color options
const AVATAR_COLORS = [
  { id: 'blue', bg: '#DBEAFE', color: '#2563EB' },
  { id: 'green', bg: '#DCFCE7', color: '#16A34A' },
  { id: 'yellow', bg: '#FEF3C7', color: '#D97706' },
  { id: 'pink', bg: '#FCE7F3', color: '#DB2777' },
  { id: 'purple', bg: '#EDE9FE', color: '#7C3AED' },
  { id: 'orange', bg: '#FFEDD5', color: '#EA580C' }
];

export function init(appState) {
  const profileGrid = document.getElementById('profile-grid');
  const addProfileBtn = document.getElementById('btn-add-profile');
  const manageBtn = document.getElementById('btn-manage-profiles');
  
  // Load profiles from localStorage
  const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
  
  // Render profiles
  renderProfiles(profiles);
  
  function renderProfiles(profiles) {
    profileGrid.innerHTML = '';
    
    if (profiles.length === 0) {
      // No profiles yet - show empty state
      profileGrid.innerHTML = `
        <div class="empty-profiles">
          <p>No learner profiles yet</p>
          <p class="subtitle">Add your first learner to get started!</p>
        </div>
      `;
      return;
    }
    
    profiles.forEach((profile, index) => {
      const avatarColor = AVATAR_COLORS.find(c => c.id === profile.avatar) || AVATAR_COLORS[index % AVATAR_COLORS.length];
      const initials = getInitials(profile.name);
      
      const card = document.createElement('button');
      card.className = 'profile-card';
      card.dataset.profileId = profile.id;
      card.innerHTML = `
        <div class="profile-avatar" style="background: ${avatarColor.bg}; color: ${avatarColor.color}">
          ${initials}
        </div>
        <div class="profile-info">
          <span class="profile-name">${profile.name}</span>
          <span class="profile-grade">Class ${profile.grade || '?'}</span>
        </div>
      `;
      
      card.addEventListener('click', () => selectProfile(profile));
      profileGrid.appendChild(card);
    });
  }
  
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  
  function selectProfile(profile) {
    // Set active profile
    localStorage.setItem('atm_active_profile', profile.id);
    
    // Update app state
    appState.activeProfile = profile;
    appState.studentContext.name = profile.name;
    appState.studentContext.grade = profile.grade;
    appState.studentContext.school = profile.school;
    
    // Update last active timestamp
    const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
    const updated = profiles.map(p => {
      if (p.id === profile.id) {
        return { ...p, lastActiveAt: new Date().toISOString() };
      }
      return p;
    });
    localStorage.setItem('atm_profiles', JSON.stringify(updated));
    
    // Navigate to home
    navigate('S0');
  }
  
  // Add new profile
  addProfileBtn.addEventListener('click', () => {
    navigate('add-profile');
  });
  
  // Manage profiles
  manageBtn.addEventListener('click', () => {
    navigate('manage-profiles');
  });
}
