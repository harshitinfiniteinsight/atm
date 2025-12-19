// Profile Controller

const AVATAR_COLORS = {
  blue: { bg: '#DBEAFE', color: '#2563EB' },
  green: { bg: '#DCFCE7', color: '#16A34A' },
  yellow: { bg: '#FEF3C7', color: '#D97706' },
  pink: { bg: '#FCE7F3', color: '#DB2777' },
  purple: { bg: '#EDE9FE', color: '#7C3AED' },
  orange: { bg: '#FFEDD5', color: '#EA580C' }
};

export function init(appState) {
  // Get active profile
  const activeProfileId = localStorage.getItem('atm_active_profile');
  const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
  const profile = profiles.find(p => p.id === activeProfileId);
  
  if (!profile) {
    navigate('profile-select');
    return;
  }
  
  // Populate profile data
  document.getElementById('profile-name').textContent = profile.name;
  document.getElementById('info-name').textContent = profile.name;
  
  if (profile.grade) {
    document.getElementById('profile-details').textContent = `Class ${profile.grade}`;
  }
  
  if (profile.school) {
    document.getElementById('info-school').textContent = profile.school;
  }
  
  // Update avatar color
  const avatarEl = document.querySelector('.avatar');
  if (avatarEl && profile.avatar) {
    const avatarColor = AVATAR_COLORS[profile.avatar] || AVATAR_COLORS.blue;
    avatarEl.style.background = avatarColor.bg;
    avatarEl.style.color = avatarColor.color;
  }
  
  // Load profile-specific history
  const history = JSON.parse(localStorage.getItem(`atm_history_${profile.id}`) || '[]');
  
  document.getElementById('stat-assessments').textContent = history.length;
  
  if (history.length > 0) {
    // Calculate average score
    const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
    const avgScore = Math.round(totalScore / history.length);
    document.getElementById('stat-accuracy').textContent = `${avgScore}%`;
    
    // Calculate total time (mock)
    const totalTime = history.length * 15;
    document.getElementById('stat-time').textContent = totalTime >= 60 ? 
      `${Math.floor(totalTime / 60)}h` : `${totalTime}m`;
  }
  
  // Edit profile button - for now go to add-profile style edit
  document.getElementById('btn-edit-profile').addEventListener('click', () => {
    // TODO: Create edit profile screen
    alert('Edit profile coming soon!');
  });
  
  // Export data button
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const data = {
      profile: profile,
      history: history,
      settings: JSON.parse(localStorage.getItem(`atm_settings_${profile.id}`) || '{}'),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atm-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Clear data button - clear this profile's history
  document.getElementById('btn-clear-data').addEventListener('click', () => {
    if (confirm(`Clear all assessment history for ${profile.name}? This cannot be undone.`)) {
      localStorage.removeItem(`atm_history_${profile.id}`);
      localStorage.removeItem(`atm_settings_${profile.id}`);
      navigate('profile');
    }
  });
  
  // Logout button - switch to profile selector
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Switch to a different learner?')) {
      localStorage.removeItem('atm_active_profile');
      window.resetAppState();
      navigate('profile-select');
    }
  });
}
