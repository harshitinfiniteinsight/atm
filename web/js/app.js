// ATM - Main App (Router + State)

// Global State
window.appState = {
  // S1 data
  studentContext: {
    name: '',
    grade: null,
    age: null,
    country: '',
    state: '',
    board: 'CBSE',
    school: '',
    subject: ''
  },
  // S2 data
  assessmentType: null, // 'chapter-wise' | 'practice' | 'quick'
  // S3 data
  config: {
    chapters: [],
    difficulty: 'Medium',
    questionCount: 10,
    format: 'digital'
  },
  // S4/S5 data
  generatedAssessment: {
    id: null,
    questions: [],
    pdfUrl: null,
    answerSheetUrl: null
  },
  // S4 answers
  answers: {},
  currentQuestionIndex: 0,
  // S6 data
  uploadedFiles: [],
  // S7 data
  report: null,
  // Active profile
  activeProfile: null
};

// Route definitions
const routes = {
  'welcome': { template: 'templates/welcome.html', controller: 'welcome' },
  'profile-select': { template: 'templates/profile-select.html', controller: 'profileSelect' },
  'add-profile': { template: 'templates/add-profile.html', controller: 'addProfile' },
  'signup': { template: 'templates/signup.html', controller: 'signup' },
  'signin': { template: 'templates/signin.html', controller: 'signin' },
  'S0': { template: 'templates/s0-entry.html', controller: 's0Entry' },
  'S1': { template: 'templates/s1-student-context.html', controller: 's1StudentContext' },
  'S2': { template: 'templates/s2-assessment-type.html', controller: 's2AssessmentType' },
  'S3': { template: 'templates/s3-configure.html', controller: 's3Configure' },
  'S4': { template: 'templates/s4-digital-taking.html', controller: 's4DigitalTaking' },
  'S5': { template: 'templates/s5-print-download.html', controller: 's5PrintDownload' },
  'S6': { template: 'templates/s6-upload.html', controller: 's6Upload' },
  'S7': { template: 'templates/s7-report.html', controller: 's7Report' },
  'profile': { template: 'templates/profile.html', controller: 'profile' },
  'history': { template: 'templates/history.html', controller: 'history' },
  'settings': { template: 'templates/settings.html', controller: 'settings' }
};

// Navigation history for back button
let navigationHistory = [];

// Navigate to a screen
window.navigate = async function(screenId, addToHistory = true) {
  const route = routes[screenId];
  if (!route) {
    console.error(`Unknown route: ${screenId}`);
    return;
  }

  // Add current screen to history (if not going back)
  if (addToHistory && navigationHistory.length > 0) {
    // Don't add if it's the same screen
    if (navigationHistory[navigationHistory.length - 1] !== screenId) {
      navigationHistory.push(screenId);
    }
  } else if (addToHistory) {
    navigationHistory.push(screenId);
  }

  try {
    // Fetch template
    const response = await fetch(route.template);
    if (!response.ok) throw new Error(`Failed to load template: ${route.template}`);
    const templateHtml = await response.text();
    
    // Render template
    document.getElementById('main-content').innerHTML = templateHtml;
    
    // Load and initialize controller
    const controller = await import(`./controllers/${route.controller}.js`);
    if (controller.init) {
      controller.init(window.appState);
    }
    
    // Update back button visibility
    updateBackButton(screenId);
    
    // Update header title based on screen
    updateHeaderTitle(screenId);
    
    // Update header visibility (hide on auth screens)
    updateHeaderVisibility(screenId);
    
    // Update bottom nav visibility and state
    updateBottomNavVisibility(screenId);
    updateBottomNav(screenId);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
  } catch (error) {
    console.error('Navigation error:', error);
    console.error('Error stack:', error.stack);
    document.getElementById('main-content').innerHTML = `
      <div class="screen" style="text-align: center; padding: 48px;">
        <h2>Oops!</h2>
        <p>Something went wrong loading this page.</p>
        <p style="font-size: 12px; color: red; margin-top: 16px;">${error.message}</p>
        <button class="btn btn-primary" onclick="navigate('S0')">Go Home</button>
      </div>
    `;
  }
};

// Update header title based on current screen
function updateHeaderTitle(screenId) {
  const titleEl = document.querySelector('.header-title');
  if (!titleEl) return;
  
  const titles = {
    'welcome': 'ATM',
    'signup': 'Sign Up',
    'signin': 'Sign In',
    'S0': 'ATM',
    'S1': 'Student Details',
    'S2': 'Assessment Type',
    'S3': 'Configure',
    'S4': 'Assessment',
    'S5': 'Download',
    'S6': 'Upload',
    'S7': 'Results',
    'profile': 'Profile',
    'history': 'History',
    'settings': 'Settings',
    'profile-select': 'Select Learner',
    'add-profile': 'Add Learner'
  };
  
  titleEl.textContent = titles[screenId] || 'ATM';
}

// Update header visibility based on screen
function updateHeaderVisibility(screenId) {
  const header = document.getElementById('app-header');
  if (!header) return;
  
  // Hide header on welcome/auth/profile-select screens
  const hideOnScreens = ['welcome', 'signup', 'signin', 'profile-select', 'add-profile'];
  header.style.display = hideOnScreens.includes(screenId) ? 'none' : 'flex';
}

// Go back in navigation
window.goBack = function() {
  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // Remove current
    const previousScreen = navigationHistory.pop(); // Get previous
    navigate(previousScreen, false);
  } else {
    navigate('S0', false);
  }
};

// Update back button visibility
function updateBackButton(screenId) {
  const backBtn = document.getElementById('btn-back');
  if (backBtn) {
    // Show back button on all screens except S0 and main nav screens
    const hideOnScreens = ['S0', 'profile', 'history'];
    backBtn.style.display = hideOnScreens.includes(screenId) ? 'none' : 'flex';
  }
}

// Reset app state
window.resetAppState = function() {
  window.appState = {
    studentContext: {
      name: '',
      grade: null,
      age: null,
      country: '',
      state: '',
      board: 'CBSE',
      school: '',
      subject: ''
    },
    assessmentType: null,
    config: {
      chapters: [],
      difficulty: 'Medium',
      questionCount: 10,
      format: 'digital'
    },
    generatedAssessment: {
      id: null,
      questions: [],
      pdfUrl: null,
      answerSheetUrl: null
    },
    answers: {},
    currentQuestionIndex: 0,
    uploadedFiles: [],
    report: null
  };
  navigationHistory = [];
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Set up back button
  const backBtn = document.getElementById('btn-back');
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }
  
  // Set up menu button
  const menuBtn = document.getElementById('btn-menu');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', () => {
      dropdownMenu.classList.add('hidden');
    });
    
    // Menu item actions
    dropdownMenu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        dropdownMenu.classList.add('hidden');
        
        switch(action) {
          case 'profile':
            navigate('profile');
            break;
          case 'history':
            navigate('history');
            break;
          case 'settings':
            navigate('settings');
            break;
          case 'about':
            showAboutModal();
            break;
        }
      });
    });
  }
  
  // Set up bottom navigation
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    bottomNav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const screen = item.dataset.screen;
        navigate(screen);
        updateBottomNav(screen);
      });
    });
  }
  
  // Check for profiles and active profile
  const profiles = JSON.parse(localStorage.getItem('atm_profiles') || '[]');
  const activeProfileId = localStorage.getItem('atm_active_profile');
  
  if (profiles.length === 0) {
    // No profiles yet, show welcome/onboarding
    navigate('welcome');
  } else if (activeProfileId) {
    // Has active profile, load it and go to home
    const activeProfile = profiles.find(p => p.id === activeProfileId);
    if (activeProfile) {
      window.appState.activeProfile = activeProfile;
      window.appState.studentContext.name = activeProfile.name;
      window.appState.studentContext.grade = activeProfile.grade;
      window.appState.studentContext.school = activeProfile.school;
      navigate('S0');
    } else {
      // Active profile not found, show profile selector
      navigate('profile-select');
    }
  } else {
    // Has profiles but none active, show profile selector
    navigate('profile-select');
  }
});

// Update bottom nav active state
function updateBottomNav(screenId) {
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav) return;
  
  bottomNav.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.screen === screenId || 
        (screenId === 'S0' && item.dataset.screen === 'S0')) {
      item.classList.add('active');
    }
  });
}

// Show/hide bottom nav based on screen
function updateBottomNavVisibility(screenId) {
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav) return;
  
  // Hide bottom nav during auth, profile selection, and assessment flow
  const hideOnScreens = ['welcome', 'signup', 'signin', 'profile-select', 'add-profile', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  if (hideOnScreens.includes(screenId)) {
    bottomNav.style.display = 'none';
  } else {
    bottomNav.style.display = 'flex';
  }
}

// Show about modal
function showAboutModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>About ATM</h2>
        <p>Assessment Tool for Me</p>
        <p style="margin-top: 12px; font-size: 14px; color: var(--color-text-secondary);">
          Version 1.0.0<br>
          Create personalized assessments and track your learning progress.
        </p>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="this.closest('.modal-overlay').remove()">
          Got it
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
