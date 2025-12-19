// S2 Assessment Type Controller

export function init(appState) {
  const subjectChips = document.querySelectorAll('.subject-chip');
  const cards = document.querySelectorAll('.type-card');
  const continueBtn = document.getElementById('btn-continue');
  let selectedSubject = appState.studentContext.subject;
  let selectedType = appState.assessmentType;
  
  // Restore previous subject selection if any
  if (selectedSubject) {
    updateSubjectSelection(selectedSubject);
  }
  
  // Restore previous type selection if any
  if (selectedType) {
    updateTypeSelection(selectedType);
  }
  
  // Handle subject chip selection
  subjectChips.forEach(chip => {
    chip.addEventListener('click', () => {
      selectedSubject = chip.dataset.subject;
      updateSubjectSelection(selectedSubject);
      updateContinueButton();
    });
  });
  
  function updateSubjectSelection(subject) {
    subjectChips.forEach(c => c.classList.remove('selected'));
    const selected = document.querySelector(`.subject-chip[data-subject="${subject}"]`);
    if (selected) {
      selected.classList.add('selected');
    }
  }
  
  // Handle card selection
  cards.forEach(card => {
    card.addEventListener('click', () => {
      selectedType = card.dataset.type;
      updateTypeSelection(selectedType);
      updateContinueButton();
    });
  });
  
  function updateTypeSelection(type) {
    cards.forEach(c => c.classList.remove('selected'));
    const selected = document.querySelector(`.type-card[data-type="${type}"]`);
    if (selected) {
      selected.classList.add('selected');
    }
  }
  
  function updateContinueButton() {
    continueBtn.disabled = !(selectedSubject && selectedType);
  }
  
  // Continue button
  continueBtn.addEventListener('click', () => {
    if (!selectedSubject || !selectedType) return;
    
    appState.studentContext.subject = selectedSubject;
    appState.assessmentType = selectedType;
    
    // Set defaults based on type
    switch (selectedType) {
      case 'quick':
        appState.config.questionCount = 10;
        appState.config.difficulty = 'Medium';
        break;
      case 'practice':
        appState.config.questionCount = 20;
        appState.config.difficulty = 'Medium';
        break;
      case 'chapter-wise':
        appState.config.questionCount = 15;
        appState.config.difficulty = 'Medium';
        break;
    }
    
    navigate('S3');
  });
}
