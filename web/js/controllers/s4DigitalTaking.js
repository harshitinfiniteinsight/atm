// S4 Digital Taking Controller

import { submitDigitalAnswers } from '../api.js';

export function init(appState) {
  const questions = appState.generatedAssessment.questions;
  let currentIndex = appState.currentQuestionIndex || 0;
  
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const progressPercent = document.getElementById('progress-percent');
  const progressBar = document.getElementById('progress-bar');
  const questionNumber = document.getElementById('question-number');
  const questionType = document.getElementById('question-type');
  const questionText = document.getElementById('question-text');
  const answerArea = document.getElementById('answer-area');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  
  function render() {
    const question = questions[currentIndex];
    const savedAnswer = appState.answers[question.id] || '';
    const percent = Math.round(((currentIndex + 1) / questions.length) * 100);
    
    // Update progress
    currentQuestionEl.textContent = currentIndex + 1;
    totalQuestionsEl.textContent = questions.length;
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    
    // Update question info
    questionNumber.textContent = currentIndex + 1;
    questionType.textContent = getTypeLabel(question.type);
    questionText.textContent = question.text;
    
    // Render answer input based on type
    answerArea.innerHTML = renderAnswerInput(question, savedAnswer);
    
    // Attach event listeners
    attachAnswerListeners(question);
    
    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    
    if (currentIndex === questions.length - 1) {
      nextBtn.innerHTML = `
        Submit
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
      nextBtn.classList.add('btn-success');
    } else {
      nextBtn.innerHTML = `
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      `;
      nextBtn.classList.remove('btn-success');
    }
  }
  
  function getTypeLabel(type) {
    const labels = {
      'MCQ': 'Multiple Choice',
      'FIB': 'Fill in the Blank',
      'SHORT': 'Short Answer',
      'LONG': 'Long Answer'
    };
    return labels[type] || type;
  }
  
  function renderAnswerInput(question, savedAnswer) {
    switch (question.type) {
      case 'MCQ':
        return renderMCQ(question.options, savedAnswer);
      case 'FIB':
        return `<input type="text" class="answer-input" placeholder="Type your answer..." value="${escapeHtml(savedAnswer)}">`;
      case 'SHORT':
        return `<textarea class="answer-input" rows="3" placeholder="Write your answer (1-2 sentences)...">${escapeHtml(savedAnswer)}</textarea>`;
      case 'LONG':
        return `<textarea class="answer-input long" rows="6" placeholder="Write your detailed answer...">${escapeHtml(savedAnswer)}</textarea>`;
      default:
        return `<input type="text" class="answer-input" placeholder="Type your answer..." value="${escapeHtml(savedAnswer)}">`;
    }
  }
  
  function renderMCQ(options, savedAnswer) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    return `
      <div class="mcq-options">
        ${options.map((opt, i) => `
          <label class="mcq-option ${savedAnswer === opt ? 'selected' : ''}">
            <input type="radio" name="mcq-answer" value="${escapeHtml(opt)}" ${savedAnswer === opt ? 'checked' : ''}>
            <span class="option-indicator">${letters[i]}</span>
            <span class="option-text">${escapeHtml(opt)}</span>
          </label>
        `).join('')}
      </div>
    `;
  }
  
  function attachAnswerListeners(question) {
    const voiceContainer = document.getElementById('voice-input-container');
    const voiceBtn = document.getElementById('voice-input-btn');
    const voiceFeedback = document.getElementById('voice-feedback');
    const voiceStopBtn = document.getElementById('voice-stop-btn');
    const voiceCancelBtn = document.getElementById('voice-cancel-btn');
    const voiceTranscript = document.getElementById('voice-transcript');
    
    if (question.type === 'MCQ') {
      answerArea.querySelectorAll('.mcq-option').forEach(option => {
        option.addEventListener('click', () => {
          answerArea.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          const radio = option.querySelector('input');
          radio.checked = true;
          appState.answers[question.id] = radio.value;
        });
      });
      // Hide voice button for MCQ
      if (voiceContainer) voiceContainer.style.display = 'none';
    } else {
      const input = answerArea.querySelector('.answer-input');
      if (input) {
        input.addEventListener('input', () => {
          appState.answers[question.id] = input.value;
        });
        
        // Show voice button for text inputs
        if (voiceContainer) voiceContainer.style.display = 'block';
      }
    }
    
    // Voice button click handler (UI only for now)
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.add('recording');
        if (voiceFeedback) voiceFeedback.style.display = 'block';
        if (voiceTranscript) voiceTranscript.textContent = 'Speak your answer...';
        // Voice recognition would be implemented here
      });
    }
    
    // Stop/Done button handler
    if (voiceStopBtn) {
      voiceStopBtn.addEventListener('click', () => {
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (voiceFeedback) voiceFeedback.style.display = 'none';
        // Apply transcribed text to input would be implemented here
      });
    }
    
    // Cancel button handler
    if (voiceCancelBtn) {
      voiceCancelBtn.addEventListener('click', () => {
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (voiceFeedback) voiceFeedback.style.display = 'none';
        if (voiceTranscript) voiceTranscript.textContent = 'Speak your answer...';
        // Cancel voice recognition would be implemented here
      });
    }
  }
  
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Previous button
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      appState.currentQuestionIndex = currentIndex;
      render();
    }
  });
  
  // Next/Submit button
  nextBtn.addEventListener('click', async () => {
    if (currentIndex < questions.length - 1) {
      // Go to next question
      currentIndex++;
      appState.currentQuestionIndex = currentIndex;
      render();
    } else {
      // Submit assessment
      nextBtn.disabled = true;
      nextBtn.innerHTML = `
        <span class="spinner"></span>
        Submitting...
      `;
      
      try {
        const report = await submitDigitalAnswers(
          appState.generatedAssessment.id,
          appState.answers,
          questions
        );
        appState.report = report;
        navigate('S7');
      } catch (error) {
        console.error('Submit error:', error);
        alert('Failed to submit. Please try again.');
        nextBtn.disabled = false;
        nextBtn.innerHTML = `
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
      }
    }
  });
  
  // Initial render
  render();
}
