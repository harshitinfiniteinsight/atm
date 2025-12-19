// S6 Upload Controller

import { submitUploadedAnswers } from '../api.js';

export function init(appState) {
  const fileInput = document.getElementById('file-input');
  const cameraInput = document.getElementById('camera-input');
  const fileList = document.getElementById('file-list');
  const submitBtn = document.getElementById('btn-submit');
  const assessmentInfo = document.getElementById('assessment-info');
  const assessmentList = document.getElementById('assessment-list');
  
  // Upload option buttons
  const btnCamera = document.getElementById('btn-camera');
  const btnScan = document.getElementById('btn-scan');
  const btnUploadFile = document.getElementById('btn-upload-file');
  
  let files = [...appState.uploadedFiles];
  let selectedAssessmentId = appState.currentAssessmentId || null;
  
  // Add demo assessments if none exist
  if (!appState.history || appState.history.length === 0) {
    appState.history = getDemoAssessments();
  }
  
  // Populate assessment selector
  populateAssessmentSelector();
  
  // Auto-select first assessment if none selected
  if (!selectedAssessmentId && appState.history && appState.history.length > 0) {
    const firstAssessment = appState.history[0];
    selectedAssessmentId = firstAssessment.assessmentId || firstAssessment.id;
    appState.currentAssessmentId = selectedAssessmentId;
  }
  
  function getDemoAssessments() {
    return [
      {
        id: 'demo_1',
        assessmentId: 'demo_1',
        subject: 'Mathematics',
        chapters: ['Algebra', 'Geometry'],
        numQuestions: 20,
        type: 'practice',
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        score: 75
      },
      {
        id: 'demo_2',
        assessmentId: 'demo_2',
        subject: 'Science',
        chapters: ['Physics', 'Chemistry'],
        numQuestions: 15,
        type: 'test',
        completedAt: new Date(Date.now() - 172800000).toISOString(),
        score: 82
      },
      {
        id: 'demo_3',
        assessmentId: 'demo_3',
        subject: 'English',
        chapters: ['Grammar', 'Comprehension'],
        numQuestions: 25,
        type: 'practice',
        completedAt: new Date(Date.now() - 259200000).toISOString(),
        score: 68
      }
    ];
  }
  
  // Re-render with selected assessment highlighted
  if (selectedAssessmentId) {
    populateAssessmentSelector();
  }
  
  // Populate and show assessment info
  if (selectedAssessmentId) {
    populateAssessmentInfo(selectedAssessmentId);
  }
  
  // Render existing files if any
  if (files.length > 0) {
    renderFileList();
  }
  
  // Upload button handlers
  if (btnCamera) {
    btnCamera.addEventListener('click', () => {
      if (cameraInput) cameraInput.click();
    });
  }
  
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      if (cameraInput) cameraInput.click();
    });
  }
  
  if (btnUploadFile) {
    btnUploadFile.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }
  
  // Camera input change
  if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
      cameraInput.value = ''; // Reset input
    });
  }
  
  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
      fileInput.value = ''; // Reset input
    });
  }
  
  function populateAssessmentSelector() {
    const history = appState.history || [];
    
    if (history.length === 0) {
      assessmentList.innerHTML = `
        <div class="empty-state">
          <p>No assessments found. Complete an assessment first to upload answers.</p>
        </div>
      `;
      return;
    }
    
    // Group by assessment ID to get unique assessments
    const assessments = [];
    const seen = new Set();
    
    history.forEach(item => {
      const id = item.assessmentId || item.id;
      if (!seen.has(id)) {
        seen.add(id);
        assessments.push({
          id,
          subject: item.subject,
          type: item.type,
          chapters: item.chapters,
          questionCount: item.questionCount,
          difficulty: item.difficulty,
          date: item.date
        });
      }
    });
    
    // Sort by date (newest first)
    assessments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    assessmentList.innerHTML = assessments.map((assessment, idx) => `
      <button class="assessment-card ${selectedAssessmentId === assessment.id ? 'active' : ''}" data-assessment-id="${assessment.id}">
        <div class="assessment-card-content">
          <div class="assessment-card-header">
            <div class="assessment-card-title">${assessment.subject} • ${assessment.type}</div>
            <span class="assessment-badge">${assessment.difficulty}</span>
          </div>
          <div class="assessment-card-meta">
            <span>${assessment.chapters?.length || 'All'} chapters</span>
            <span class="dot">•</span>
            <span>${assessment.questionCount} Q</span>
          </div>
          <div class="assessment-card-date">Taken on ${new Date(assessment.date).toLocaleDateString()}</div>
        </div>
        <div class="assessment-card-check">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </button>
    `).join('');
    
    // Add click listeners
    assessmentList.querySelectorAll('.assessment-card').forEach(card => {
      card.addEventListener('click', () => {
        const assessmentId = card.dataset.assessmentId;
        selectedAssessmentId = assessmentId;
        appState.currentAssessmentId = assessmentId;
        
        // Update active state
        assessmentList.querySelectorAll('.assessment-card').forEach(c => {
          c.classList.remove('active');
        });
        card.classList.add('active');
        
        // Update assessment info
        populateAssessmentInfo(assessmentId);
        
        // Clear files on assessment change
        files = [];
        appState.uploadedFiles = files;
        renderFileList();
      });
    });
  }
  
  function populateAssessmentInfo(assessmentId) {
    const history = appState.history || [];
    const assessment = history.find(h => (h.assessmentId || h.id) === assessmentId);
    
    if (!assessment) return;
    
    const subject = assessment.subject || 'Mathematics';
    const chapters = assessment.chapters?.length > 0 
      ? assessment.chapters.join(', ') 
      : 'All Chapters';
    const questionCount = assessment.questionCount || 10;
    
    const subjectEl = document.getElementById('upload-subject');
    const chaptersEl = document.getElementById('upload-chapters');
    const questionsEl = document.getElementById('upload-questions');
    
    if (subjectEl) subjectEl.textContent = subject;
    if (chaptersEl) chaptersEl.textContent = chapters;
    if (questionsEl) questionsEl.textContent = `${questionCount} Questions`;
    
    // Show assessment info card
    if (assessmentInfo) {
      assessmentInfo.style.display = 'block';
    }
  }
  
  function addFiles(newFiles) {
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 10;
    
    newFiles.forEach(file => {
      // Check max files
      if (files.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      // Check file type
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(ext)) {
        alert(`File type not supported: ${file.name}\nAllowed: PDF, JPEG, PNG`);
        return;
      }
      
      // Check file size
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}\nMaximum size: 10MB`);
        return;
      }
      
      files.push(file);
    });
    
    appState.uploadedFiles = files;
    renderFileList();
  }
  
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>`;
  }
  
  function renderFileList() {
    if (files.length === 0) {
      fileList.innerHTML = '';
      submitBtn.disabled = true;
      return;
    }
    
    fileList.innerHTML = files.map((file, i) => `
      <div class="file-item">
        <div class="file-icon">
          ${getFileIcon(file.name)}
        </div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <button class="file-remove" data-index="${i}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('');
    
    // Add remove listeners
    fileList.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        files.splice(index, 1);
        appState.uploadedFiles = files;
        renderFileList();
      });
    });
    
    submitBtn.disabled = files.length === 0;
  }
  
  // Submit button
  submitBtn.addEventListener('click', async () => {
    if (files.length === 0) {
      alert('Please upload at least one file.');
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      Processing...
    `;
    
    try {
      const report = await submitUploadedAnswers(
        appState.generatedAssessment?.id,
        files
      );
      appState.report = report;
      navigate('S7');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to process. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Submit for Grading
      `;
    }
  });
}
