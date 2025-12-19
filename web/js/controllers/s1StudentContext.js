// S1 Student Context Controller

import { getIndianStates } from '../api.js';

export function init(appState) {
  const nameInput = document.getElementById('input-name');
  const gradeSelect = document.getElementById('select-grade');
  const ageInput = document.getElementById('input-age');
  const countrySelect = document.getElementById('select-country');
  const stateGroup = document.getElementById('state-group');
  const stateSelect = document.getElementById('select-state');
  const schoolInput = document.getElementById('input-school');
  const subjectSelect = document.getElementById('select-subject');
  const continueBtn = document.getElementById('btn-continue');
  
  // Pre-fill form if data exists
  if (appState.studentContext.name) {
    nameInput.value = appState.studentContext.name;
    gradeSelect.value = appState.studentContext.grade || '';
    ageInput.value = appState.studentContext.age || '';
    countrySelect.value = appState.studentContext.country || '';
    schoolInput.value = appState.studentContext.school || '';
    subjectSelect.value = appState.studentContext.subject || '';
    
    if (appState.studentContext.country === 'India') {
      stateGroup.style.display = 'block';
      populateStates();
      stateSelect.value = appState.studentContext.state || '';
    }
    
    validateForm();
  }
  
  // Show/hide state based on country
  countrySelect.addEventListener('change', () => {
    if (countrySelect.value === 'India') {
      stateGroup.style.display = 'block';
      populateStates();
    } else {
      stateGroup.style.display = 'none';
      stateSelect.value = '';
    }
    validateForm();
  });
  
  function populateStates() {
    const states = getIndianStates();
    stateSelect.innerHTML = '<option value="">Select state</option>' +
      states.map(s => `<option value="${s}">${s}</option>`).join('');
  }
  
  // Validate on any input change
  const allInputs = [nameInput, gradeSelect, ageInput, countrySelect, stateSelect, schoolInput, subjectSelect];
  allInputs.forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('change', validateForm);
  });
  
  function validateForm() {
    const isValid = 
      nameInput.value.trim() !== '' &&
      gradeSelect.value !== '' &&
      ageInput.value !== '' &&
      countrySelect.value !== '' &&
      (countrySelect.value !== 'India' || stateSelect.value !== '') &&
      schoolInput.value.trim() !== '' &&
      subjectSelect.value !== '';
    
    continueBtn.disabled = !isValid;
  }
  
  // Continue button
  continueBtn.addEventListener('click', () => {
    // Save to state
    appState.studentContext = {
      name: nameInput.value.trim(),
      grade: gradeSelect.value,
      age: ageInput.value,
      country: countrySelect.value,
      state: stateSelect.value || '',
      board: 'CBSE',
      school: schoolInput.value.trim(),
      subject: subjectSelect.value
    };
    
    navigate('S2');
  });
}
