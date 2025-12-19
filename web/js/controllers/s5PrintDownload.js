// S5 Print Download Controller

export function init(appState) {
  const downloadQuestionsBtn = document.getElementById('btn-download-questions');
  const downloadAnswerSheetBtn = document.getElementById('btn-download-answer-sheet');
  const continueBtn = document.getElementById('btn-continue-upload');
  const switchDigitalBtn = document.getElementById('btn-switch-digital');
  
  // Download question paper
  downloadQuestionsBtn.addEventListener('click', () => {
    // In production, this would download a real PDF
    // For now, simulate the download
    const pdfUrl = appState.generatedAssessment?.pdfUrl || '#';
    
    if (pdfUrl && pdfUrl !== '#') {
      window.open(pdfUrl, '_blank');
    } else {
      // Generate a simple text version for demo
      generateDemoPDF('questions');
    }
  });
  
  // Download answer sheet template
  downloadAnswerSheetBtn.addEventListener('click', () => {
    const answerSheetUrl = appState.generatedAssessment?.answerSheetUrl || '#';
    
    if (answerSheetUrl && answerSheetUrl !== '#') {
      window.open(answerSheetUrl, '_blank');
    } else {
      generateDemoPDF('answers');
    }
  });
  
  // Continue to upload
  continueBtn.addEventListener('click', () => {
    navigate('S6');
  });
  
  // Switch to digital mode
  switchDigitalBtn.addEventListener('click', () => {
    appState.config.format = 'digital';
    appState.answers = {};
    appState.currentQuestionIndex = 0;
    navigate('S4');
  });
  
  function generateDemoPDF(type) {
    const questions = appState.generatedAssessment?.questions || [];
    const student = appState.studentContext;
    
    let content = '';
    
    if (type === 'questions') {
      content = `ASSESSMENT - QUESTION PAPER
================================
Student: ${student.name}
Subject: ${student.subject}
Grade: ${student.grade}
Date: ${new Date().toLocaleDateString()}
================================

`;
      questions.forEach((q, i) => {
        content += `Q${i + 1}. ${q.text}\n`;
        if (q.type === 'MCQ' && q.options) {
          q.options.forEach((opt, j) => {
            content += `   ${String.fromCharCode(65 + j)}) ${opt}\n`;
          });
        }
        content += '\n';
      });
    } else {
      content = `ASSESSMENT - ANSWER SHEET
================================
Student: ${student.name}
Subject: ${student.subject}
Grade: ${student.grade}
Date: ${new Date().toLocaleDateString()}
================================

`;
      questions.forEach((q, i) => {
        content += `Q${i + 1}: ________________________________\n\n`;
        if (q.type === 'LONG') {
          content += `    ________________________________\n\n`;
          content += `    ________________________________\n\n`;
        }
      });
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'questions' ? 'question-paper.txt' : 'answer-sheet.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show message about demo
    setTimeout(() => {
      alert('Demo: In production, this will download a properly formatted PDF.');
    }, 500);
  }
}
