// Progress Bar Component

export function initProgressBar(containerId) {
  const container = document.getElementById(containerId);
  
  return {
    setProgress: (current, total) => {
      const percentage = Math.round((current / total) * 100);
      container.style.width = `${percentage}%`;
    },
    setPercentage: (percentage) => {
      container.style.width = `${percentage}%`;
    }
  };
}
