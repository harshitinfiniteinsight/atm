// History Controller

export function init(appState) {
  const historyList = document.getElementById('history-items');
  const emptyState = document.getElementById('empty-state');
  const historySummary = document.getElementById('history-summary');
  
  // Get active profile
  const activeProfileId = localStorage.getItem('atm_active_profile');
  
  if (!activeProfileId) {
    navigate('profile-select');
    return;
  }
  
  // Load profile-specific history
  const history = JSON.parse(localStorage.getItem(`atm_history_${activeProfileId}`) || '[]');
  
  // Store history in appState for access when viewing results
  appState.historyData = history;
  
  if (history.length === 0) {
    emptyState.style.display = 'block';
    historyList.style.display = 'none';
    historySummary.style.display = 'none';
    
    // Start new button
    document.getElementById('btn-start-new').addEventListener('click', () => {
      navigate('S0');
    });
  } else {
    emptyState.style.display = 'none';
    historyList.style.display = 'block';
    historySummary.style.display = 'block';
    
    // Render history items
    renderHistoryItems(history, appState);
    
    // Calculate and display summary stats
    updateSummaryStats(history);
  }
  
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.dataset.filter;
      filterHistory(history, filter, appState);
    });
  });
}

function renderHistoryItems(items, appState) {
  const container = document.getElementById('history-items');
  
  container.innerHTML = items.map(item => `
    <div class="history-item" data-id="${item.id}" role="button" tabindex="0">
      <div class="history-item-icon ${item.score >= 70 ? 'success' : item.score >= 40 ? 'warning' : 'error'}">
        ${item.score >= 70 ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ` : item.score >= 40 ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        ` : `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        `}
      </div>
      <div class="history-item-content">
        <div class="history-item-title">${item.subject || 'Assessment'}</div>
        <div class="history-item-meta">
          <span>${item.chapters?.join(', ') || 'Mixed'}</span>
          <span>•</span>
          <span>${formatDate(item.date)}</span>
        </div>
      </div>
      <div class="history-item-score ${item.score >= 70 ? 'good' : item.score >= 40 ? 'okay' : 'low'}">
        ${item.score}%
      </div>
      <div class="history-item-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  `).join('');
  
  // Add click handlers to view results
  container.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const itemId = el.dataset.id;
      viewHistoryResult(itemId, appState);
    });
  });
}

/**
 * Navigate to S7 report to view historical assessment results
 */
function viewHistoryResult(itemId, appState) {
  const history = appState.historyData || [];
  const item = history.find(h => h.id === itemId);
  
  if (!item) {
    console.error('History item not found:', itemId);
    return;
  }
  
  // Set up the report data for S7
  appState.report = {
    score: item.correctCount || Math.round(item.score * item.total / 100),
    total: item.total || item.questionResults?.length || 10,
    questionResults: item.questionResults || [],
    feedback: item.feedback || []
  };
  
  // Store assessment context for display
  appState.assessmentContext = {
    subject: item.subject,
    chapters: item.chapters,
    date: item.date,
    isHistorical: true
  };
  
  navigate('S7');
}

function filterHistory(history, filter, appState) {
  let filtered = history;
  
  if (filter === 'completed') {
    filtered = history.filter(item => item.status === 'completed');
  } else if (filter === 'in-progress') {
    filtered = history.filter(item => item.status === 'in-progress');
  }
  
  if (filtered.length === 0) {
    document.getElementById('history-items').innerHTML = `
      <div class="no-results">
        <p>No ${filter === 'all' ? '' : filter} assessments found</p>
      </div>
    `;
  } else {
    renderHistoryItems(filtered, appState);
  }
}

function updateSummaryStats(history) {
  const now = new Date();
  const thisMonth = history.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === now.getMonth() && 
           itemDate.getFullYear() === now.getFullYear();
  });
  
  document.getElementById('month-total').textContent = thisMonth.length;
  
  if (thisMonth.length > 0) {
    const avgScore = Math.round(thisMonth.reduce((sum, item) => sum + item.score, 0) / thisMonth.length);
    document.getElementById('month-avg').textContent = `${avgScore}%`;
    
    const totalTime = thisMonth.length * 15; // Assume 15 min per assessment
    document.getElementById('month-time').textContent = totalTime >= 60 ? 
      `${Math.floor(totalTime / 60)}h` : `${totalTime}m`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
