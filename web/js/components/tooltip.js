// Tooltip Component

export function initTooltips() {
  // Tooltips are handled via CSS :hover
  // This function can be extended for more complex tooltip behavior
  
  document.querySelectorAll('.info-icon').forEach(icon => {
    // Make tooltips keyboard accessible
    icon.addEventListener('focus', () => {
      const tooltip = icon.querySelector('.tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      }
    });
    
    icon.addEventListener('blur', () => {
      const tooltip = icon.querySelector('.tooltip');
      if (tooltip) {
        tooltip.style.opacity = '';
        tooltip.style.visibility = '';
      }
    });
  });
}
