// Add Profile Controller
import { generateDemoHistory } from '../utils/demoData.js';

export function init(appState) {
  const form = document.getElementById('add-profile-form');
  const nameInput = document.getElementById('input-name');
  const gradeSelect = document.getElementById('select-grade');
  const ageInput = document.getElementById('input-age');
  const schoolInput = document.getElementById('input-school');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  
  let selectedAvatar = 'blue';
  
  // Back button
  document.getElementById('btn-back').addEventListener('click', () => {
    navigate('profile-select');
  });
  
  // Avatar selection
  avatarOptions.forEach(option => {
    option.addEventListener('click', () => {
      avatarOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      selectedAvatar = option.dataset.avatar;
    });
  });
  
  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const grade = gradeSelect.value;
    
    if (!name || !grade) {
      return;
    }
    
    // Generate unique ID
    const id = 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Create new profile
    const newProfile = {
      id,
      name,
      grade,
      age: ageInput.value || null,
      school: schoolInput.value.trim() || null,
      avatar: selectedAvatar,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    
    // Save to profiles list
    const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
    profiles.push(newProfile);
    localStorage.setItem('atm_profiles', JSON.stringify(profiles));
    
    // Set as active profile
    localStorage.setItem('atm_active_profile', id);
    
    // Update app state
    appState.activeProfile = newProfile;
    appState.studentContext.name = name;
    appState.studentContext.grade = grade;
    appState.studentContext.school = newProfile.school;
    
    // Initialize empty history for this profile
    localStorage.setItem(`atm_history_${id}`, JSON.stringify([]));
    
    // Generate demo history for demonstration purposes
    const demoHistory = generateDemoHistory(id, 6); // 6 sample assessments
    localStorage.setItem(`atm_history_${id}`, JSON.stringify(demoHistory));
    
    // Navigate to home
    navigate('S0');
  });
}
