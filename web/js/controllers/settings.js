// Settings Controller

export function init(appState) {
  // Load saved settings
  const settings = JSON.parse(localStorage.getItem('atm_settings') || '{}');
  
  // Theme toggle
  const themeOptions = document.querySelectorAll('.theme-option');
  const currentTheme = settings.theme || 'light';
  
  themeOptions.forEach(option => {
    if (option.dataset.theme === currentTheme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
    
    option.addEventListener('click', () => {
      themeOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      
      settings.theme = option.dataset.theme;
      saveSettings(settings);
      
      // Apply theme (would need CSS for dark mode)
      document.body.dataset.theme = option.dataset.theme;
    });
  });
  
  // Toggle switches
  const reminderToggle = document.getElementById('toggle-reminders');
  const progressToggle = document.getElementById('toggle-progress');
  
  reminderToggle.checked = settings.reminders || false;
  progressToggle.checked = settings.progressUpdates !== false;
  
  reminderToggle.addEventListener('change', () => {
    settings.reminders = reminderToggle.checked;
    saveSettings(settings);
  });
  
  progressToggle.addEventListener('change', () => {
    settings.progressUpdates = progressToggle.checked;
    saveSettings(settings);
  });
  
  // Default selects
  const difficultySelect = document.getElementById('default-difficulty');
  const countSelect = document.getElementById('default-count');
  const formatSelect = document.getElementById('default-format');
  
  difficultySelect.value = settings.defaultDifficulty || 'medium';
  countSelect.value = settings.defaultCount || '10';
  formatSelect.value = settings.defaultFormat || 'digital';
  
  difficultySelect.addEventListener('change', () => {
    settings.defaultDifficulty = difficultySelect.value;
    saveSettings(settings);
    
    // Update appState config
    appState.config.difficulty = difficultySelect.value.charAt(0).toUpperCase() + 
                                  difficultySelect.value.slice(1);
  });
  
  countSelect.addEventListener('change', () => {
    settings.defaultCount = countSelect.value;
    saveSettings(settings);
    appState.config.questionCount = parseInt(countSelect.value);
  });
  
  formatSelect.addEventListener('change', () => {
    settings.defaultFormat = formatSelect.value;
    saveSettings(settings);
    appState.config.format = formatSelect.value;
  });
  
  // Export button
  document.getElementById('btn-export').addEventListener('click', () => {
    const data = {
      studentContext: appState.studentContext,
      history: JSON.parse(localStorage.getItem('atm_history') || '[]'),
      settings: settings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atm-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!');
  });
  
  // Clear button
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('atm_history');
      localStorage.removeItem('atm_settings');
      window.resetAppState();
      navigate('S0');
    }
  });
}

function saveSettings(settings) {
  localStorage.setItem('atm_settings', JSON.stringify(settings));
}

function showToast(message) {
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
