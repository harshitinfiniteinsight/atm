// Question Renderer Component

export function renderQuestion(container, question, savedAnswer, onAnswerChange) {
  let html = `
    <div class="question">
      <p class="question-text">${question.number}. ${question.text}</p>
      <div class="answer-area">
  `;
  
  switch (question.type) {
    case 'MCQ':
      html += renderMCQ(question, savedAnswer);
      break;
    case 'FIB':
      html += renderFIB(question, savedAnswer);
      break;
    case 'SHORT':
      html += renderShortAnswer(question, savedAnswer);
      break;
    case 'LONG':
      html += renderLongAnswer(question, savedAnswer);
      break;
    default:
      html += `<p>Unknown question type: ${question.type}</p>`;
  }
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach event listeners
  attachListeners(container, question.type, onAnswerChange);
}

function renderMCQ(question, savedAnswer) {
  if (!question.options || question.options.length === 0) {
    return '<p>No options available</p>';
  }
  
  return question.options.map((opt, i) => {
    const isChecked = savedAnswer === opt ? 'checked' : '';
    const optionLabel = String.fromCharCode(65 + i); // A, B, C, D...
    
    return `
      <label class="mcq-option">
        <input type="radio" name="mcq-answer" value="${escapeHtml(opt)}" ${isChecked}>
        <span class="option-label">${optionLabel}</span>
        <span class="option-text">${escapeHtml(opt)}</span>
      </label>
    `;
  }).join('');
}

function renderFIB(question, savedAnswer) {
  return `
    <input 
      type="text" 
      class="fib-input" 
      placeholder="Type your answer here..." 
      value="${escapeHtml(savedAnswer || '')}"
    >
  `;
}

function renderShortAnswer(question, savedAnswer) {
  return `
    <textarea 
      class="short-answer" 
      rows="3" 
      placeholder="Type your answer here (1-2 sentences)..."
    >${escapeHtml(savedAnswer || '')}</textarea>
  `;
}

function renderLongAnswer(question, savedAnswer) {
  return `
    <textarea 
      class="long-answer" 
      rows="6" 
      placeholder="Type your detailed answer here..."
    >${escapeHtml(savedAnswer || '')}</textarea>
  `;
}

function attachListeners(container, type, onAnswerChange) {
  if (type === 'MCQ') {
    container.querySelectorAll('input[name="mcq-answer"]').forEach(input => {
      input.addEventListener('change', () => {
        onAnswerChange(input.value);
      });
    });
  } else {
    const input = container.querySelector('input, textarea');
    if (input) {
      input.addEventListener('input', () => {
        onAnswerChange(input.value);
      });
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
