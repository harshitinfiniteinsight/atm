// Header Component

export function initHeader(config = {}) {
  const { showBack = true, title = 'ATM', onBack } = config;
  
  const header = document.getElementById('app-header');
  const backBtn = document.getElementById('btn-back');
  const titleEl = header.querySelector('.header-title');
  
  // Update title
  if (titleEl) {
    titleEl.textContent = title;
  }
  
  // Show/hide back button
  if (backBtn) {
    backBtn.style.display = showBack ? 'block' : 'none';
    
    if (onBack) {
      backBtn.onclick = onBack;
    }
  }
}
