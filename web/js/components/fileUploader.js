// File Uploader Component

export function initFileUploader(config) {
  const { 
    uploadAreaId, 
    fileInputId, 
    fileListId, 
    allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'],
    maxFiles = 10,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    onChange 
  } = config;
  
  const uploadArea = document.getElementById(uploadAreaId);
  const fileInput = document.getElementById(fileInputId);
  const fileList = document.getElementById(fileListId);
  
  let files = [];
  
  // Click to upload
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    addFiles(Array.from(e.target.files));
    fileInput.value = '';
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    addFiles(Array.from(e.dataTransfer.files));
  });
  
  function addFiles(newFiles) {
    newFiles.forEach(file => {
      // Check file type
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(ext)) {
        alert(`File type not supported: ${file.name}`);
        return;
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File too large: ${file.name}`);
        return;
      }
      
      // Check max files
      if (files.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      files.push(file);
    });
    
    renderFiles();
    if (onChange) onChange(files);
  }
  
  function removeFile(index) {
    files.splice(index, 1);
    renderFiles();
    if (onChange) onChange(files);
  }
  
  function renderFiles() {
    if (files.length === 0) {
      fileList.innerHTML = '';
      return;
    }
    
    fileList.innerHTML = files.map((file, i) => `
      <div class="file-item">
        <span class="file-name">${file.name}</span>
        <button class="remove-file" data-index="${i}">✕</button>
      </div>
    `).join('');
    
    fileList.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFile(parseInt(btn.dataset.index));
      });
    });
  }
  
  return {
    getFiles: () => files,
    clear: () => {
      files = [];
      renderFiles();
      if (onChange) onChange(files);
    }
  };
}
