// ============ VIBECODE IDE - MAIN ENTRY POINT ============
// This file initializes the IDE and sets up all event listeners

// Initialize the IDE when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM cache and state
  initDOM();
  initState();
  
  // Save project snapshot on changes
  function saveProjectSnapshot() {
    if (!VibeCodeState.projectId) {
      VibeCodeState.projectId = 'project_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    }
    VibeCodeProjectStore.saveSnapshot({
      id: VibeCodeState.projectId,
      name: VibeCodeState.repo && VibeCodeState.repo.name ? VibeCodeState.repo.name : (VibeCodeState.projectName || 'Untitled project'),
      files: VibeCodeState.files,
      folders: VibeCodeState.folders,
      repo: VibeCodeState.repo,
      userId: VibeCodeState.userId,
      updatedAt: new Date().toISOString()
    });
  }
  
  // Override saveState to include project snapshot
  const originalSaveState = saveState;
  saveState = function() {
    originalSaveState();
    saveProjectSnapshot();
  };
  
  // Initial render
  renderTree();
  renderChanges();
  if (VibeCodeState.repo && DOM.repoName) {
    DOM.repoName.textContent = '◆ ' + VibeCodeState.repo.name;
  }
  
  // Check token balance and capture pending PayPal order
  checkTokenBalance();
  updateBalanceUI();
  capturePendingPayPalOrder();
  
  // ============ EVENT LISTENERS ============
  
  // Activity bar buttons
  const actBtns = document.querySelectorAll('.act-btn');
  actBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const panel = this.getAttribute('data-panel');
      if (panel === 'chat') {
        toggleChat();
      } else if (panel) {
        switchPanel(panel);
      } else if (this.title === 'Settings') {
        showSettings();
      } else if (this.title === 'AI Chat') {
        toggleChat();
      }
    });
  });
  
  // Menu buttons
  const menuButtons = document.querySelectorAll('#mainMenu button');
  if (menuButtons.length >= 8) {
    menuButtons[0].addEventListener('click', function() { newFile(); closeMenu(); });
    menuButtons[1].addEventListener('click', function() { toast('Edit menu coming soon'); closeMenu(); });
    menuButtons[2].addEventListener('click', function() { toast('View menu coming soon'); closeMenu(); });
    menuButtons[3].addEventListener('click', function() { switchPanel('git'); closeMenu(); });
    menuButtons[4].addEventListener('click', function() { toast('Terminal coming soon'); closeMenu(); });
    menuButtons[5].addEventListener('click', function() { showTopUpModal(); closeMenu(); });
    menuButtons[6].addEventListener('click', function() { 
      window.location.href = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'dashboard'; 
      closeMenu(); 
    });
    menuButtons[7].addEventListener('click', function() { showAbout(); closeMenu(); });
  }
  
  // Sidebar action buttons
  const sidebarActions = document.querySelectorAll('#panel-files .icon-btn');
  if (sidebarActions.length >= 3) {
    sidebarActions[0].addEventListener('click', newFile);
    sidebarActions[1].addEventListener('click', newFolder);
    sidebarActions[2].addEventListener('click', refreshTree);
  }
  
  // Git buttons
  const cloneRepoBtn = document.getElementById('cloneRepoBtn');
  if (cloneRepoBtn) cloneRepoBtn.addEventListener('click', cloneRepo);
  
  const stageAllBtn = document.getElementById('stageAllBtn');
  if (stageAllBtn) stageAllBtn.addEventListener('click', stageAll);
  
  const unstageAllBtn = document.getElementById('unstageAllBtn');
  if (unstageAllBtn) unstageAllBtn.addEventListener('click', unstageAll);
  
  const commitBtn = document.getElementById('commitBtn');
  if (commitBtn) commitBtn.addEventListener('click', commitChanges);
  
  const pushBtn = document.getElementById('pushBtn');
  if (pushBtn) pushBtn.addEventListener('click', pushRepo);
  
  const pullBtn = document.getElementById('pullBtn');
  if (pullBtn) pullBtn.addEventListener('click', pullRepo);
  
  // Chat buttons
  const sendChatBtn = document.getElementById('sendChatBtn');
  if (sendChatBtn) sendChatBtn.addEventListener('click', sendChat);
  
  const editFileBtn = document.getElementById('editFileBtn');
  if (editFileBtn) editFileBtn.addEventListener('click', editActiveFileWithAI);
  
  // Chat input enter key
  if (DOM.chatInput) {
    DOM.chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChat();
      }
    });
  }
  
  // Backdrop click
  if (DOM.backdrop) {
    DOM.backdrop.addEventListener('click', closeDrawers);
  }
  
  // Modal backdrop click
  if (DOM.modalBg) {
    DOM.modalBg.onclick = function(e) {
      if (e.target.id === 'modalBg') hideModal();
    };
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (DOM.mainMenu && DOM.hamburger) {
      if (!DOM.mainMenu.contains(e.target) && !DOM.hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    const modifier = e.ctrlKey || e.metaKey;
    
    if (modifier && key === 'n') { 
      e.preventDefault(); 
      e.stopPropagation(); 
      newFile(); 
      return; 
    }
    if (modifier && key === 's') { 
      e.preventDefault(); 
      e.stopPropagation(); 
      saveState(); 
      toast('Saved', 'success'); 
      return; 
    }
    if (modifier && key === 'l') { 
      e.preventDefault(); 
      e.stopPropagation(); 
      toggleChat(); 
      return; 
    }
    if (e.key === 'Escape') {
      closeDrawers();
      closeMenu();
      hideModal();
    }
  });
  
  // Responsive handling
  window.addEventListener('resize', function() {
    if (!isMobile()) {
      closeDrawers();
      closeMenu();
    }
    syncChatLayout();
  });
  
  // Initial sync
  syncChatLayout();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init: function() {
      document.addEventListener('DOMContentLoaded', arguments.callee);
    }
  };
}
