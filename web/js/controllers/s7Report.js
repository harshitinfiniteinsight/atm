// S7 Report Controller

export function init(appState) {
  const report = appState.report;
  
  if (!report) {
    // No report available, redirect to home
    navigate('S0');
    return;
  }
  
  const scoreValue = document.getElementById('score-value');
  const scoreTotal = document.getElementById('score-total');
  const scorePercentage = document.getElementById('score-percentage');
  const resultsList = document.getElementById('results-list');
  const feedbackContent = document.getElementById('feedback-content');
  const toggleBtn = document.getElementById('btn-toggle-results');
  const retakeBtn = document.getElementById('btn-retake');
  const newBtn = document.getElementById('btn-new');
  const exitBtn = document.getElementById('btn-exit');
  
  // Modal elements
  const modal = document.getElementById('question-modal');
  const modalClose = document.getElementById('modal-close');
  
  // Calculate score
  const score = report.score || 0;
  const total = report.total || appState.generatedAssessment?.questions?.length || 10;
  const percentage = Math.round((score / total) * 100);
  
  // Update score display
  scoreValue.textContent = score;
  scoreTotal.textContent = total;
  scorePercentage.textContent = `${percentage}%`;
  
  // Animate score ring
  animateScoreRing(percentage);
  
  // Update score card message based on percentage
  const scoreLabel = document.querySelector('.score-label');
  if (percentage >= 80) {
    scoreLabel.textContent = 'Excellent work! Keep it up! 🎉';
  } else if (percentage >= 60) {
    scoreLabel.textContent = 'Good job! Room to improve! 💪';
  } else if (percentage >= 40) {
    scoreLabel.textContent = 'Keep practicing! You can do better! 📚';
  } else {
    scoreLabel.textContent = "Don't give up! Try again! 🌟";
  }
  
  // Save to history if this is a new assessment (not historical view)
  if (!appState.assessmentContext?.isHistorical) {
    saveToHistory(appState, score, total, percentage, report);
  }
  
  // Render results list
  const questionResults = report.questionResults || [];
  renderResults(questionResults);
  
  // Render feedback
  renderFeedback(report.feedback);
  
  // Modal close handlers
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  function closeModal() {
    modal.style.display = 'none';
  }
  
  function openQuestionModal(result, index) {
    const modalStatus = document.getElementById('modal-status');
    const modalQuestionNum = document.getElementById('modal-question-num');
    const modalQuestionText = document.getElementById('modal-question-text');
    const modalCorrectAnswer = document.getElementById('modal-correct-answer');
    const modalStudentAnswer = document.getElementById('modal-student-answer');
    const modalStudentRow = document.getElementById('modal-student-row');
    const modalFeedbackContent = document.getElementById('modal-feedback-content');
    const modalFeedback = document.getElementById('modal-feedback');
    
    // Set status
    modalStatus.className = 'modal-status ' + (result.correct ? 'correct' : result.partial ? 'partial' : 'incorrect');
    modalStatus.innerHTML = result.correct ? `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ` : result.partial ? `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ` : `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    
    // Set question info
    modalQuestionNum.textContent = `Question ${index + 1}`;
    modalQuestionText.textContent = result.question || 'Question not available';
    modalCorrectAnswer.textContent = result.answer || 'N/A';
    
    // Show student answer if incorrect
    if (!result.correct) {
      modalStudentRow.style.display = 'flex';
      modalStudentAnswer.textContent = result.studentAnswer || 'No answer';
      modalStudentAnswer.className = 'answer-value incorrect';
    } else {
      modalStudentRow.style.display = 'none';
    }
    
    // Set feedback
    const feedbackText = result.correct 
      ? 'Great job! You got this one right.'
      : result.partial
      ? 'Partially correct. Review the complete answer above.'
      : getQuestionFeedback(result);
    
    modalFeedbackContent.textContent = feedbackText;
    
    modal.style.display = 'flex';
  }
  
  function getQuestionFeedback(result) {
    // Generate helpful feedback based on question type
    if (result.difficulty === 'easy') {
      return 'This was a basic question. Review the fundamentals of this topic.';
    } else if (result.difficulty === 'medium') {
      return 'This required intermediate understanding. Practice more similar problems.';
    } else if (result.difficulty === 'hard') {
      return 'This was a challenging question. Don\'t worry, keep practicing!';
    }
    return 'Review the correct answer and try to understand the concept better.';
  }
  
  function renderResults(results) {
    if (results.length === 0) {
      resultsList.innerHTML = '<p class="text-center text-muted">No detailed results available</p>';
      toggleBtn.style.display = 'none';
      return;
    }
    
    // Show only first 3 by default
    const showAll = false;
    const displayResults = showAll ? results : results.slice(0, 3);
    
    renderResultItems(displayResults, results);
    
    // Toggle button
    if (results.length > 3) {
      toggleBtn.style.display = 'block';
      toggleBtn.textContent = showAll ? 'Show less' : `Show all (${results.length})`;
      
      // Remove old listener and add new one
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
      
      newToggleBtn.addEventListener('click', () => {
        const currentlyShowingAll = newToggleBtn.textContent.includes('less');
        if (currentlyShowingAll) {
          renderResultItems(results.slice(0, 3), results);
          newToggleBtn.textContent = `Show all (${results.length})`;
        } else {
          renderResultItems(results, results);
          newToggleBtn.textContent = 'Show less';
        }
      });
    } else {
      toggleBtn.style.display = 'none';
    }
  }
  
  function renderResultItems(displayResults, allResults) {
    resultsList.innerHTML = displayResults.map((r, i) => `
      <div class="result-item" data-index="${i}">
        <div class="result-status ${r.correct ? 'correct' : r.partial ? 'partial' : 'incorrect'}">
          ${r.correct ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ` : r.partial ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          ` : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          `}
        </div>
        <div class="result-content">
          <div class="result-question">Q${i + 1}: ${truncateText(r.question, 30)}</div>
          <div class="result-detail">${r.correct ? 'Correct' : r.partial ? 'Partially correct' : 'Incorrect'} · Tap for details</div>
        </div>
        <div class="result-score">${r.score || 0}/${r.maxScore || 1}</div>
      </div>
    `).join('');
    
    // Add click handlers
    resultsList.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        openQuestionModal(allResults[index], index);
      });
    });
  }
  
  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  function renderFeedback(feedback) {
    if (!feedback) {
      feedbackContent.innerHTML = `
        <p>Review your incorrect answers and focus on understanding the concepts behind them.</p>
        <p>Practice similar questions to strengthen your understanding.</p>
      `;
      return;
    }
    
    if (typeof feedback === 'string') {
      feedbackContent.innerHTML = `<p>${feedback}</p>`;
    } else if (Array.isArray(feedback)) {
      feedbackContent.innerHTML = feedback.map(f => `<p>${f}</p>`).join('');
    } else {
      feedbackContent.innerHTML = `<p>${feedback.summary || 'Keep practicing!'}</p>`;
    }
  }
  
  // Check if this is a historical view
  const isHistorical = appState.assessmentContext?.isHistorical === true;
  const backHistoryBtn = document.getElementById('btn-back-history');
  const contextSection = document.getElementById('assessment-context');
  
  if (isHistorical) {
    // Show context badge
    contextSection.style.display = 'block';
    document.getElementById('context-subject').textContent = appState.assessmentContext.subject || 'Assessment';
    
    // Format date
    const date = new Date(appState.assessmentContext.date);
    document.getElementById('context-date').textContent = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Hide retake, show back to history
    retakeBtn.style.display = 'none';
    backHistoryBtn.style.display = 'flex';
    
    backHistoryBtn.addEventListener('click', () => {
      appState.assessmentContext = null;
      navigate('history');
    });
  } else {
    // Normal assessment view
    contextSection.style.display = 'none';
    retakeBtn.style.display = 'flex';
    backHistoryBtn.style.display = 'none';
  }
  
  // Retake button - same questions
  retakeBtn.addEventListener('click', () => {
    appState.answers = {};
    appState.currentQuestionIndex = 0;
    appState.report = null;
    
    if (appState.config.format === 'digital') {
      navigate('S4');
    } else {
      navigate('S5');
    }
  });
  
  // New assessment button
  newBtn.addEventListener('click', () => {
    resetAppState();
    navigate('S1');
  });
  
  // Exit button
  exitBtn.addEventListener('click', () => {
    resetAppState();
    navigate('S0');
  });
}

/**
 * Save assessment result to profile history
 */
function saveToHistory(appState, score, total, percentage, report) {
  const activeProfileId = localStorage.getItem('atm_active_profile');
  if (!activeProfileId) return;
  
  // Check if this assessment was already saved (prevent duplicates on page refresh)
  const savedId = appState.savedAssessmentId;
  if (savedId) return;
  
  // Create history entry
  const historyEntry = {
    id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    subject: appState.config?.subject || 'Assessment',
    chapters: appState.config?.chapters || [],
    date: new Date().toISOString(),
    score: percentage,
    total: total,
    correctCount: score,
    status: 'completed',
    difficulty: appState.config?.difficulty || 'medium',
    questionResults: report.questionResults || [],
    feedback: report.feedback || []
  };
  
  // Load existing history
  const historyKey = `atm_history_${activeProfileId}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  
  // Add new entry at the beginning
  history.unshift(historyEntry);
  
  // Save back to localStorage
  localStorage.setItem(historyKey, JSON.stringify(history));
  
  // Mark as saved to prevent duplicates
  appState.savedAssessmentId = historyEntry.id;
}

/**
 * Animate the score ring progress
 */
function animateScoreRing(percentage) {
  const ring = document.getElementById('score-ring-progress');
  if (!ring) return;
  
  // Circle circumference: 2 * PI * r = 2 * 3.14159 * 52 ≈ 327
  const circumference = 327;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Delay animation slightly for visual effect
  setTimeout(() => {
    ring.style.strokeDashoffset = offset;
  }, 100);
}
