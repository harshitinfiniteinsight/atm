// S0 Entry Controller

const AVATAR_COLORS = {
  blue: { bg: '#DBEAFE', color: '#2563EB' },
  green: { bg: '#DCFCE7', color: '#16A34A' },
  yellow: { bg: '#FEF3C7', color: '#D97706' },
  pink: { bg: '#FCE7F3', color: '#DB2777' },
  purple: { bg: '#EDE9FE', color: '#7C3AED' },
  orange: { bg: '#FFEDD5', color: '#EA580C' }
};

export function init(appState) {
  // Load active profile
  const activeProfileId = localStorage.getItem('atm_active_profile');
  const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
  const profile = profiles.find(p => p.id === activeProfileId);
  
  if (profile) {
    appState.activeProfile = profile;
    appState.studentContext.name = profile.name;
    appState.studentContext.grade = profile.grade;
    appState.studentContext.school = profile.school;
    
    // Update profile banner
    const nameEl = document.getElementById('active-profile-name');
    if (nameEl) {
      nameEl.textContent = profile.name;
    }
    
    // Update avatar
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) {
      const avatarColor = AVATAR_COLORS[profile.avatar] || AVATAR_COLORS.blue;
      const initials = getInitials(profile.name);
      avatarEl.style.background = avatarColor.bg;
      avatarEl.style.color = avatarColor.color;
      avatarEl.textContent = initials;
    }
    
    // Load and display journey stats
    loadJourneyStats(activeProfileId);
  }
  
  // Switch profile button
  document.getElementById('btn-switch-profile').addEventListener('click', () => {
    navigate('profile-select');
  });
  
  // Create new assessment button - go to S2 (subject selection)
  document.getElementById('btn-create').addEventListener('click', () => {
    navigate('S2');
  });
  
  // Upload answer sheet button
  document.getElementById('btn-upload').addEventListener('click', () => {
    navigate('S6');
  });
  
  // Learning journey button
  document.getElementById('btn-journey').addEventListener('click', () => {
    navigate('history');
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

function loadJourneyStats(profileId) {
  const history = JSON.parse(localStorage.getItem(`atm_history_${profileId}`) || '[]');
  const statsEl = document.getElementById('journey-stats');
  const subtitleEl = document.getElementById('journey-subtitle');
  
  if (history.length > 0) {
    // Show stats, hide subtitle
    statsEl.style.display = 'flex';
    subtitleEl.style.display = 'none';
    
    // Calculate stats
    const completedCount = history.filter(h => h.status === 'completed').length;
    const avgScore = history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : 0;
    
    document.getElementById('stat-total').textContent = completedCount;
    document.getElementById('stat-avg').textContent = `${avgScore}%`;
  } else {
    // No history, show subtitle
    statsEl.style.display = 'none';
    subtitleEl.style.display = 'block';
  }
}
