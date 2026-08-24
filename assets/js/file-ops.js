// ============ FILE OPERATIONS ============

// Open a file
function openFile(name) {
  // Check if file already in tabs
  let found = false;
  for (let i = 0; i < VibeCodeState.openTabs.length; i++) {
    if (VibeCodeState.openTabs[i] === name) {
      found = true;
      break;
    }
  }
  
  // Add to tabs if not found
  if (!found) VibeCodeState.openTabs.push(name);
  VibeCodeState.activeFile = name;
  
  // Auto-expand parent folders
  if (name.includes('/')) {
    const parts = name.split('/');
    for (let i = 1; i < parts.length; i++) {
      const folderPath = parts.slice(0, i).join('/');
      VibeCodeState.expandedFolders[folderPath] = true;
    }
    saveState();
  }
  
  renderTabs();
  renderTree();
  renderEditor();
  
  if (isMobile()) closeSidebar();
}

// Close a tab
function closeTab(name, e) {
  if (e) e.stopPropagation();
  
  const newTabs = [];
  for (let i = 0; i < VibeCodeState.openTabs.length; i++) {
    if (VibeCodeState.openTabs[i] !== name) {
      newTabs.push(VibeCodeState.openTabs[i]);
    }
  }
  VibeCodeState.openTabs = newTabs;
  
  if (VibeCodeState.activeFile === name) {
    VibeCodeState.activeFile = VibeCodeState.openTabs[VibeCodeState.openTabs.length - 1] || null;
  }
  
  // Auto-collapse folders that have no open files
  if (name.includes('/')) {
    const parts = name.split('/');
    for (let i = 1; i < parts.length; i++) {
      const folderPath = parts.slice(0, i).join('/');
      const hasOpenFiles = VibeCodeState.openTabs.some(function(tabName) {
        return tabName.startsWith(folderPath + '/');
      });
      if (!hasOpenFiles) {
        delete VibeCodeState.expandedFolders[folderPath];
      }
    }
    saveState();
  }
  
  renderTabs();
  renderTree();
  renderEditor();
}

// Create new file
function newFile() {
  const name = prompt('Nama file:', 'untitled.js');
  if (!name) return;
  if (VibeCodeState.files[name]) {
    toast('File sudah ada', 'error');
    return;
  }
  VibeCodeState.files[name] = '';
  VibeCodeState.gitChanges.push({ name: name, status: 'A', staged: false });
  saveState();
  renderTree();
  renderChanges();
  openFile(name);
  closeMenu();
}

// Create new folder
function newFolder() {
  const name = prompt('Nama folder:');
  if (!name) return;
  if (VibeCodeState.folders.includes(name)) {
    toast('Folder sudah ada', 'error');
    return;
  }
  VibeCodeState.folders.push(name);
  saveState();
  renderTree();
  closeMenu();
}

// Delete file or folder
function deleteItem(type, name) {
  if (!confirm('Hapus ' + type + ' "' + name + '"?')) return;
  
  if (type === 'file') {
    delete VibeCodeState.files[name];
    VibeCodeState.openTabs = VibeCodeState.openTabs.filter(function(t) { 
      return t !== name; 
    });
    if (VibeCodeState.activeFile === name) VibeCodeState.activeFile = null;
    
    // Auto-collapse parent folders if no open files
    if (name.includes('/')) {
      const parts = name.split('/');
      for (let i = 1; i < parts.length; i++) {
        const folderPath = parts.slice(0, i).join('/');
        const hasOpenFiles = VibeCodeState.openTabs.some(function(tabName) {
          return tabName.startsWith(folderPath + '/');
        });
        const hasFiles = Object.keys(VibeCodeState.files).some(function(fileName) {
          return fileName.startsWith(folderPath + '/');
        });
        const hasFolders = VibeCodeState.folders.some(function(f) {
          return f.startsWith(folderPath + '/');
        });
        if (!hasOpenFiles && !hasFiles && !hasFolders) {
          delete VibeCodeState.expandedFolders[folderPath];
        }
      }
      saveState();
    }
  } else {
    VibeCodeState.folders = VibeCodeState.folders.filter(function(f) { 
      return f !== name; 
    });
    
    // Auto-collapse if deleted folder has no files
    const hasFiles = Object.keys(VibeCodeState.files).some(function(fileName) {
      return fileName.startsWith(name + '/');
    });
    const hasFolders = VibeCodeState.folders.some(function(f) {
      return f.startsWith(name + '/');
    });
    if (!hasFiles && !hasFolders) {
      delete VibeCodeState.expandedFolders[name];
      
      // Also check parent folders
      if (name.includes('/')) {
        const parts = name.split('/');
        for (let i = 1; i < parts.length; i++) {
          const folderPath = parts.slice(0, i).join('/');
          const hasOpenFiles = VibeCodeState.openTabs.some(function(tabName) {
            return tabName.startsWith(folderPath + '/');
          });
          const hasFiles = Object.keys(VibeCodeState.files).some(function(fileName) {
            return fileName.startsWith(folderPath + '/');
          });
          const hasFolders = VibeCodeState.folders.some(function(f) {
            return f.startsWith(folderPath + '/');
          });
          if (!hasOpenFiles && !hasFiles && !hasFolders) {
            delete VibeCodeState.expandedFolders[folderPath];
          }
        }
      }
    }
  }
  saveState();
  renderTree();
  renderTabs();
  renderEditor();
}

// Refresh file tree
function refreshTree() {
  renderTree();
  toast('Refreshed');
}

// Toggle folder expand/collapse
function toggleFolder(folderPath) {
  if (VibeCodeState.expandedFolders[folderPath]) {
    delete VibeCodeState.expandedFolders[folderPath];
  } else {
    VibeCodeState.expandedFolders[folderPath] = true;
  }
  saveState();
  renderTree();
}

// Check if folder is expanded
function isFolderExpanded(folderPath) {
  return VibeCodeState.expandedFolders[folderPath];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openFile,
    closeTab,
    newFile,
    newFolder,
    deleteItem,
    refreshTree,
    toggleFolder,
    isFolderExpanded
  };
}
