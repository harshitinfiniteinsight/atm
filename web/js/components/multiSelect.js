// Multi-Select Component

export function initMultiSelect(containerId, options, config = {}) {
  const container = document.getElementById(containerId);
  const { maxSelections, onError, onChange } = config;
  
  // Render options
  container.innerHTML = options.map(opt => `
    <label class="multi-select-option" data-id="${opt.id}">
      <input type="checkbox" data-id="${opt.id}">
      <span>${opt.name}</span>
    </label>
  `).join('');
  
  // Track selected items
  let selected = [];
  
  // Add event listeners
  container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const option = e.target.closest('.multi-select-option');
      const id = e.target.dataset.id;
      
      if (e.target.checked) {
        // Check max limit
        if (maxSelections && selected.length >= maxSelections) {
          e.target.checked = false;
          if (onError) onError(`Maximum ${maxSelections} items can be selected`);
          return;
        }
        
        selected.push(id);
        option.classList.add('selected');
      } else {
        selected = selected.filter(s => s !== id);
        option.classList.remove('selected');
      }
      
      if (onChange) onChange(selected);
    });
  });
  
  return {
    getSelected: () => selected,
    setSelected: (ids) => {
      selected = [];
      container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const id = checkbox.dataset.id;
        if (ids.includes(id)) {
          checkbox.checked = true;
          checkbox.closest('.multi-select-option').classList.add('selected');
          selected.push(id);
        } else {
          checkbox.checked = false;
          checkbox.closest('.multi-select-option').classList.remove('selected');
        }
      });
    },
    clear: () => {
      selected = [];
      container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.multi-select-option').classList.remove('selected');
      });
    }
  };
}
