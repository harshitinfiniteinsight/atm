// ATM - Utility Functions

// Form validation helpers
export function isRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

export function isInRange(value, min, max) {
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Format helpers
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatPercentage(value, total) {
  return Math.round((value / total) * 100);
}

// DOM helpers
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function createElement(tag, className, innerHTML) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

// Event helpers
export function on(selector, event, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.addEventListener(event, handler));
}

export function delegate(parent, selector, event, handler) {
  document.querySelector(parent).addEventListener(event, (e) => {
    if (e.target.matches(selector)) {
      handler(e);
    }
  });
}

// Storage helpers (for persistence if needed)
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(`atm_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage not available');
  }
}

export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(`atm_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Storage not available');
    return null;
  }
}

export function clearStorage(key) {
  try {
    if (key) {
      localStorage.removeItem(`atm_${key}`);
    } else {
      // Clear all ATM keys
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('atm_')) localStorage.removeItem(k);
      });
    }
  } catch (e) {
    console.warn('Storage not available');
  }
}

// File helpers
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

export function isValidFileType(filename, allowedTypes) {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Debounce helper
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Shuffle array (for question randomization)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
