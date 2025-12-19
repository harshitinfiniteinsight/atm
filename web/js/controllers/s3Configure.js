// S3 Configure Controller

import { generateAssessment, getChaptersForSubject } from '../api.js';

export function init(appState) {
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersContainer = document.getElementById('chapters-container');
  const chaptersCount = document.getElementById('chapters-count');
  const chaptersError = document.getElementById('chapters-error');
  const countValue = document.getElementById('count-value');
  const btnDecrease = document.getElementById('btn-decrease');
  const btnIncrease = document.getElementById('btn-increase');
  const generateBtn = document.getElementById('btn-generate');
  
  let selectedChapters = [...appState.config.chapters];
  let difficulty = appState.config.difficulty;
  let questionCount = appState.config.questionCount;
  let format = appState.config.format;
  
  // Hide chapters for Quick mode
  if (appState.assessmentType === 'quick') {
    chaptersSection.style.display = 'none';
    questionCount = 10; // Fixed for quick
  } else {
    // Populate chapters
    const chapters = getChaptersForSubject(appState.studentContext.subject);
    renderChapters(chapters);
  }
  
  // Set initial count
  countValue.textContent = questionCount;
  updateStepperButtons();
  
  // Difficulty pills
  document.querySelectorAll('.difficulty-pill').forEach(pill => {
    if (pill.dataset.difficulty.toLowerCase() === difficulty.toLowerCase()) {
      pill.classList.add('selected');
    }
    
    pill.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      difficulty = pill.dataset.difficulty;
    });
  });
  
  // Format toggle
  document.querySelectorAll('.format-option').forEach(option => {
    if (option.dataset.format === format) {
      option.classList.add('active');
    }
    
    option.addEventListener('click', () => {
      document.querySelectorAll('.format-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      format = option.dataset.format;
    });
  });
  
  // Stepper buttons
  btnDecrease.addEventListener('click', () => {
    if (questionCount > 5) {
      questionCount -= 5;
      countValue.textContent = questionCount;
      updateStepperButtons();
    }
  });
  
  btnIncrease.addEventListener('click', () => {
    if (questionCount < 30) {
      questionCount += 5;
      countValue.textContent = questionCount;
      updateStepperButtons();
    }
  });
  
  function updateStepperButtons() {
    btnDecrease.disabled = questionCount <= 5;
    btnIncrease.disabled = questionCount >= 30;
  }
  
  function renderChapters(chapters) {
    chaptersContainer.innerHTML = chapters.map(ch => `
      <label class="multi-select-option ${selectedChapters.includes(ch.id) ? 'selected' : ''}" data-id="${ch.id}">
        <input type="checkbox" data-chapter-id="${ch.id}" ${selectedChapters.includes(ch.id) ? 'checked' : ''}>
        <span class="check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        <span>${ch.name}</span>
      </label>
    `).join('');
    
    updateChapterCount();
    
    // Add change listeners
    chaptersContainer.querySelectorAll('.multi-select-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const checkbox = option.querySelector('input');
        const chapterId = checkbox.dataset.chapterId;
        
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
          checkbox.checked = false;
          selectedChapters = selectedChapters.filter(c => c !== chapterId);
        } else {
          // Check max limit for chapter-wise
          if (appState.assessmentType === 'chapter-wise' && selectedChapters.length >= 5) {
            chaptersError.classList.remove('hidden');
            chaptersError.textContent = 'Maximum 5 chapters allowed';
            setTimeout(() => chaptersError.classList.add('hidden'), 3000);
            return;
          }
          option.classList.add('selected');
          checkbox.checked = true;
          selectedChapters.push(chapterId);
        }
        
        updateChapterCount();
      });
    });
  }
  
  function updateChapterCount() {
    chaptersCount.textContent = `${selectedChapters.length} selected`;
  }
  
  function validateForm() {
    if (appState.assessmentType !== 'quick' && selectedChapters.length === 0) {
      chaptersError.classList.remove('hidden');
      chaptersError.textContent = 'Please select at least 1 chapter';
      return false;
    }
    chaptersError.classList.add('hidden');
    return true;
  }
  
  // Generate button
  generateBtn.addEventListener('click', async () => {
    if (!validateForm()) return;
    
    // Save config
    appState.config = {
      chapters: selectedChapters,
      difficulty: difficulty,
      questionCount: questionCount,
      format: format
    };
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
      <span class="spinner"></span>
      Generating...
    `;
    
    try {
      // Generate assessment
      const result = await generateAssessment(appState.config);
      appState.generatedAssessment = result;
      
      // Reset answers
      appState.answers = {};
      appState.currentQuestionIndex = 0;
      
      // Navigate based on format
      if (format === 'digital') {
        navigate('S4');
      } else {
        navigate('S5');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate assessment. Please try again.');
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Generate Assessment
      `;
    }
  });
}
