// ============ UTILITY FUNCTIONS ============

// Check if running on mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Escape HTML to prevent XSS
function escapeHtml(s) {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Unescape HTML
function unescapeHtml(s) {
  if (!s) return '';
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

// Get file icon based on extension
function getFileIcon(name) {
  if (name.endsWith('.html')) return '<i class="fas fa-file-code" style="color:#e44d26"></i>';
  if (name.endsWith('.css')) return '<i class="fas fa-file-alt" style="color:#264de4"></i>';
  if (name.endsWith('.js')) return '<i class="fas fa-file-code" style="color:#f7df1e"></i>';
  if (name.endsWith('.json')) return '<i class="fas fa-file-code" style="color:#888"></i>';
  if (name.endsWith('.md')) return '<i class="fas fa-file-alt" style="color:#888"></i>';
  return '<i class="fas fa-file" style="color:#888"></i>';
}

// Get file language based on extension
function getLang(name) {
  if (name.endsWith('.html')) return 'HTML';
  if (name.endsWith('.css')) return 'CSS';
  if (name.endsWith('.js')) return 'JavaScript';
  if (name.endsWith('.json')) return 'JSON';
  if (name.endsWith('.md')) return 'Markdown';
  return 'Plain Text';
}

// Get file extension
function getFileExtension(name) {
  return name.split('.').pop();
}

// Get file name without extension
function getFileNameWithoutExtension(name) {
  const parts = name.split('/').pop().split('.');
  return parts.slice(0, -1).join('.');
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID');
}

// Format number with locale
function formatNumber(num) {
  return Number(num || 0).toLocaleString('id-ID');
}

// Generate unique ID
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// Debounce function
function debounce(func, wait) {
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

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Clone object
function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Merge objects
function mergeObjects(target, source) {
  return { ...target, ...source };
}

// Check if object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Get token plan based on balance
function getTokenPlan(balance) {
  const amount = Number(balance) || 0;
  if (amount >= 10000000) return 'Enterprise';
  if (amount >= 1500000) return 'Business';
  if (amount >= 300000) return 'Pro';
  if (amount >= 50000) return 'Starter';
  return 'Free';
}

// Get status color
function getStatusColor(status) {
  switch (status) {
    case 'M': return '#f39c12';
    case 'A': return '#2ecc71';
    case 'D': return '#e74c3c';
    default: return '#888';
  }
}

// Get status text
function getStatusText(status) {
  switch (status) {
    case 'M': return 'Modified';
    case 'A': return 'Added';
    case 'D': return 'Deleted';
    default: return status;
  }
}

// ============ UI UTILITY FUNCTIONS ============

// Toast notification
let toastTimer;
function toast(msg, type) {
  type = type || '';
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.className = 'toast show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { 
      if (t) t.classList.remove('show'); 
    }, 2500);
  }
}

// Modal functions
function showModal(html) {
  const modal = document.getElementById('modal');
  const modalBg = document.getElementById('modalBg');
  if (modal && modalBg) {
    modal.innerHTML = html;
    modalBg.classList.add('show');
  }
}

function hideModal() {
  const modalBg = document.getElementById('modalBg');
  if (modalBg) {
    modalBg.classList.remove('show');
  }
}

// Menu functions
function toggleMenu() {
  const menu = document.getElementById('mainMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

function closeMenu() {
  const menu = document.getElementById('mainMenu');
  if (menu) {
    menu.classList.remove('open');
  }
}

// Drawer functions
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  if (sidebar && backdrop) {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  if (sidebar && backdrop) {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }
}

function openChat() {
  const chatPanel = document.getElementById('chatPanel');
  const backdrop = document.getElementById('backdrop');
  if (chatPanel && backdrop) {
    chatPanel.classList.add('open');
    backdrop.classList.add('show');
  }
}

function closeChat() {
  const chatPanel = document.getElementById('chatPanel');
  const backdrop = document.getElementById('backdrop');
  if (chatPanel && backdrop) {
    chatPanel.classList.remove('open');
    backdrop.classList.remove('show');
  }
}

function closeDrawers() {
  closeSidebar();
  closeChat();
}

function toggleChat() {
  const cp = document.getElementById('chatPanel');
  const main = document.querySelector('.main');
  if (isMobile()) {
    if (cp && cp.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
      setTimeout(function() { 
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus(); 
      }, 300);
    }
  } else {
    if (cp && cp.classList.contains('is-hidden')) {
      cp.classList.remove('is-hidden');
      if (main) main.classList.remove('chat-collapsed');
    } else {
      if (cp) cp.classList.add('is-hidden');
      if (main) main.classList.add('chat-collapsed');
    }
  }
}

function syncChatLayout() {
  const cp = document.getElementById('chatPanel');
  const main = document.querySelector('.main');
  if (!isMobile() && cp && cp.classList.contains('is-hidden')) {
    if (main) main.classList.add('chat-collapsed');
  } else {
    if (main) main.classList.remove('chat-collapsed');
  }
}

// Panel switching
function switchPanel(panel) {
  const buttons = document.querySelectorAll('.act-btn');
  buttons.forEach(function(b) { b.classList.remove('active'); });
  
  const btn = document.querySelector('.act-btn[data-panel="' + panel + '"]');
  if (btn) btn.classList.add('active');
  
  const panels = document.querySelectorAll('.panel-content');
  panels.forEach(function(p) { p.classList.remove('active'); });
  
  const p = document.getElementById('panel-' + panel);
  if (p) p.classList.add('active');
  
  if (isMobile() && (panel === 'files' || panel === 'git')) {
    openSidebar();
  }
}

// Show about modal
function showAbout() {
  const html = '<h3>VibeCode IDE</h3>' +
    '<p style="color:var(--text-dim);font-size:12px;line-height:1.6;">Flat minimal IDE dengan gaya modern.<br>' +
    'Fully responsive — mobile, tablet, desktop.<br>' +
    'Siap untuk Cloudflare Worker AI backend.<br><br>' +
    '<strong>Version:</strong> 1.1.0<br>' +
    '<strong>Build:</strong> 2026.08.23</p>' +
    '<div class="btn-row"><button class="btn" id="aboutOkBtn">OK</button></div>';
  showModal(html);
  
  const aboutOkBtn = document.getElementById('aboutOkBtn');
  if (aboutOkBtn) {
    aboutOkBtn.addEventListener('click', hideModal);
  }
}

// Show settings modal
function showSettings() {
  const html = '<h3>Settings</h3>' +
    '<label>Status Akun GitHub</label>' +
    '<div id="githubAccountStatus" style="padding:10px;background:var(--bg);border:1px solid var(--border);color:var(--text-dim);font-size:12px;">Checking GitHub session...</div>' +
    '<div class="btn-row">' +
      '<button class="btn btn-secondary" id="githubLoginBtn">Login with GitHub</button>' +
      '<button class="btn btn-secondary" id="githubLogoutBtn" style="display:none">Logout</button>' +
    '</div>' +
    '<div id="workspaceControls">' +
      '<label>Active Repository</label>' +
      '<select class="git-input" id="workspaceRepo"><option value="">Login to load repositories</option></select>' +
      '<label>Branch</label>' +
      '<select class="git-input" id="workspaceBranch"><option value="">Select a repository first</option></select>' +
      '<div id="workspaceStatus" style="margin-top:8px;color:var(--text-dim);font-size:11px;">Workspace files stay in the Explorer and editor.</div>' +
    '</div>' +
    '<label>AI Coder Model</label>' +
    '<select class="git-input" id="aiModel">' +
      '<option value="@cf/qwen/qwen2.5-coder-32b-instruct">Qwen 2.5 Coder 32B</option>' +
      '<option value="@cf/qwen/qwen3-30b-a3b-fp8">Qwen 3 30B</option>' +
      '<option value="@cf/moonshotai/kimi-k2.7-code">Kimi K2.7 Code</option>' +
      '<option value="@cf/openai/gpt-oss-120b">GPT OSS 120B</option>' +
      '<option value="@cf/deepseek-ai/deepseek-r1-distill-qwen-32b">DeepSeek R1 Coder</option>' +
    '</select>' +
    '<label>Project Instructions for AI</label>' +
    '<textarea class="git-textarea" id="projectInstruction" rows="5" placeholder="Contoh: gunakan JavaScript vanilla, API aman, dan pertahankan style flat minimal.">' + (projectInstruction || '') + '</textarea>' +
    '<div class="btn-row">' +
      '<button class="btn btn-secondary" id="settingsCancelBtn">Cancel</button>' +
      '<button class="btn btn-primary" id="settingsSaveBtn">Save</button>' +
    '</div>';
  showModal(html);
  
  const aiModelSelect = document.getElementById('aiModel');
  const projectInstructionTextarea = document.getElementById('projectInstruction');
  
  if (aiModelSelect) aiModelSelect.value = modelId;
  if (projectInstructionTextarea) projectInstructionTextarea.value = projectInstruction || '';
  
  const githubLoginBtn = document.getElementById('githubLoginBtn');
  const githubLogoutBtn = document.getElementById('githubLogoutBtn');
  const workspaceRepo = document.getElementById('workspaceRepo');
  const workspaceBranch = document.getElementById('workspaceBranch');
  const settingsCancelBtn = document.getElementById('settingsCancelBtn');
  const settingsSaveBtn = document.getElementById('settingsSaveBtn');
  
  if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', function() { 
      window.location.href = VibeCodeState.backendWorkerUrl + '/auth/github'; 
    });
  }
  
  if (githubLogoutBtn) {
    githubLogoutBtn.addEventListener('click', logoutGithub);
  }
  
  if (workspaceRepo) {
    workspaceRepo.addEventListener('change', loadWorkspaceBranches);
  }
  
  if (workspaceBranch) {
    workspaceBranch.addEventListener('change', loadWorkspaceFiles);
  }
  
  if (settingsCancelBtn) {
    settingsCancelBtn.addEventListener('click', hideModal);
  }
  
  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener('click', saveSettings);
  }
  
  loadGithubSettings();
}

// Save settings
function saveSettings() {
  const aiModelSelect = document.getElementById('aiModel');
  const projectInstructionTextarea = document.getElementById('projectInstruction');
  
  if (aiModelSelect) {
    modelId = aiModelSelect.value;
    localStorage.setItem('vibecode_model', modelId);
  }
  
  if (projectInstructionTextarea) {
    projectInstruction = projectInstructionTextarea.value.trim();
    localStorage.setItem('vibecode_project_instruction', projectInstruction);
  }
  
  hideModal();
  toast('Settings saved!', 'success');
  checkTokenBalance();
}

// Load GitHub settings
async function loadGithubSettings() {
  const status = document.getElementById('githubAccountStatus');
  const workspaceControls = document.getElementById('workspaceControls');
  
  try {
    const meResponse = await fetch(VibeCodeState.backendWorkerUrl + '/api/auth/me', { credentials: 'include' });
    if (!meResponse.ok) {
      if (status) status.textContent = 'Belum login GitHub';
      if (workspaceControls) workspaceControls.style.display = 'none';
      return;
    }
    
    const me = await meResponse.json();
    if (workspaceControls) workspaceControls.style.display = 'block';
    
    VibeCodeState.userId = String(me.user.id);
    localStorage.setItem('vibecode_userId', VibeCodeState.userId);
    
    const balance = await checkTokenBalance();
    if (status) {
      status.innerHTML = '<strong>' + escapeHtml(me.user.login) + '</strong> · ' + getTokenPlan(balance) + ' · ' + Number(balance || 0).toLocaleString() + ' tokens';
    }
    
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    const githubLogoutBtn = document.getElementById('githubLogoutBtn');
    if (githubLoginBtn) githubLoginBtn.style.display = 'none';
    if (githubLogoutBtn) githubLogoutBtn.style.display = 'inline-flex';
    
    const repoResponse = await fetch(VibeCodeState.backendWorkerUrl + '/api/github/repos', { credentials: 'include' });
    const repos = await repoResponse.json();
    
    const workspaceRepo = document.getElementById('workspaceRepo');
    if (workspaceRepo) {
      workspaceRepo.innerHTML = '<option value="">Select repository</option>' + 
        repos.map(function(repo) { 
          return '<option value="' + escapeHtml(repo.owner.login + '/' + repo.name) + '">' + escapeHtml(repo.full_name) + '</option>'; 
        }).join('');
      
      if (VibeCodeState.repo && VibeCodeState.repo.owner && VibeCodeState.repo.name) {
        workspaceRepo.value = VibeCodeState.repo.owner + '/' + VibeCodeState.repo.name;
        await loadWorkspaceBranches();
        const branchSelect = document.getElementById('workspaceBranch');
        if (branchSelect && VibeCodeState.repo.branch) {
          branchSelect.value = VibeCodeState.repo.branch;
          // Trigger change event manually to load files
          branchSelect.dispatchEvent(new Event('change'));
        }
      }
    }
  } catch (error) {
    if (status) status.textContent = 'Silahkan login terlebih dahulu';
    if (workspaceControls) workspaceControls.style.display = 'none';
  }
}

// Hide workspace controls
function hideWorkspaceControls() {
  const controls = document.getElementById('workspaceControls');
  if (controls) controls.style.display = 'none';
}

// Show workspace controls
function showWorkspaceControls() {
  const controls = document.getElementById('workspaceControls');
  if (controls) controls.style.display = 'block';
}

// Get token plan
function getTokenPlan(balance) {
  const amount = Number(balance) || 0;
  if (amount >= 10000000) return 'Enterprise';
  if (amount >= 1500000) return 'Business';
  if (amount >= 300000) return 'Pro';
  if (amount >= 50000) return 'Starter';
  return 'Free';
}

// Load workspace branches
async function loadWorkspaceBranches() {
  const repoValue = document.getElementById('workspaceRepo')?.value;
  const branchSelect = document.getElementById('workspaceBranch');
  
  if (!repoValue || !branchSelect) {
    if (branchSelect) branchSelect.innerHTML = '<option value="">Select a repository first</option>';
    return;
  }
  
  const parts = repoValue.split('/');
  try {
    const response = await fetch(VibeCodeState.backendWorkerUrl + '/api/github/branches?owner=' + encodeURIComponent(parts[0]) + '&repo=' + encodeURIComponent(parts[1]), { credentials: 'include' });
    const branches = await response.json();
    branchSelect.innerHTML = branches.map(function(branch) { 
      return '<option value="' + escapeHtml(branch.name) + '">' + escapeHtml(branch.name) + '</option>'; 
    }).join('');
    
    // Set default branch if available in state
    if (VibeCodeState.repo?.branch) {
      const defaultBranch = VibeCodeState.repo.branch;
      const option = branchSelect.querySelector(`option[value="${defaultBranch}"]`);
      if (option) {
        branchSelect.value = defaultBranch;
      }
    }
    
    // Don't auto-load files here - let the change event handle it
  } catch (error) {
    console.error('Error loading branches:', error);
    toast('Error loading branches: ' + error.message, 'error');
  }
}

// Load workspace files
async function loadWorkspaceFiles() {
  const repoValue = document.getElementById('workspaceRepo')?.value;
  const branch = document.getElementById('workspaceBranch')?.value;
  
  if (!repoValue || !branch) return;
  
  const parts = repoValue.split('/');
  try {
    const response = await fetch(VibeCodeState.backendWorkerUrl + '/api/github/contents?owner=' + encodeURIComponent(parts[0]) + '&repo=' + encodeURIComponent(parts[1]) + '&branch=' + encodeURIComponent(branch), { credentials: 'include' });
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || 'Repository gagal dimuat');
    
    VibeCodeState.files = {};
    data.files?.forEach(function(file) { VibeCodeState.files[file.name] = file.content; });
    VibeCodeState.folders = data.folders && data.folders.length ? data.folders : foldersFromFiles(VibeCodeState.files);
    VibeCodeState.openTabs = [];
    VibeCodeState.activeFile = null;
    VibeCodeState.repo = { name: parts[1], owner: parts[0], branch: branch, url: 'https://github.com/' + repoValue + '.git' };
    saveState();
    
    if (typeof renderTree === 'function') renderTree();
    if (typeof renderTabs === 'function') renderTabs();
    if (typeof renderEditor === 'function') renderEditor();
    
    const workspaceStatus = document.getElementById('workspaceStatus');
    if (workspaceStatus) {
      workspaceStatus.textContent = data.files?.length + ' file loaded from ' + repoValue + ' @ ' + branch;
    }
    
    hideModal();
  } catch (error) {
    toast(error.message || 'Error loading workspace files', 'error');
  }
}

// Folders from files utility
function foldersFromFiles(files) {
  const folders = {};
  Object.keys(files).forEach(function(name) {
    const parts = name.split('/');
    for (let i = 1; i < parts.length; i++) {
      folders[parts.slice(0, i).join('/')] = true;
    }
  });
  return Object.keys(folders).sort();
}

// Logout GitHub
async function logoutGithub() {
  try {
    await fetch(VibeCodeState.backendWorkerUrl + '/api/auth/logout', { credentials: 'include' });
    localStorage.removeItem('vibecode_files');
    localStorage.removeItem('vibecode_folders');
    localStorage.removeItem('vibecode_repo');
    localStorage.removeItem('vibecode_userId');
    
    VibeCodeState.files = { ...VibeCodeConfig.DEFAULT_FILES };
    VibeCodeState.folders = [];
    VibeCodeState.openTabs = [];
    VibeCodeState.activeFile = null;
    VibeCodeState.repo = null;
    VibeCodeState.gitChanges = [];
    VibeCodeState.tokenBalance = 0;
    VibeCodeState.userId = 'user_' + Math.random().toString(36).substring(2, 9);
    
    if (typeof updateBalanceUI === 'function') updateBalanceUI();
    if (typeof renderTree === 'function') renderTree();
    if (typeof renderChanges === 'function') renderChanges();
    if (typeof renderTabs === 'function') renderTabs();
    if (typeof renderEditor === 'function') renderEditor();
    
    hideModal();
    toast('GitHub logout berhasil', 'success');
  } catch (error) {
    toast('Logout error: ' + error.message, 'error');
  }
}

// Extract folders from files
function foldersFromFiles(files) {
  const folders = {};
  Object.keys(files).forEach(function(name) {
    const parts = name.split('/');
    for (let i = 1; i < parts.length; i++) {
      folders[parts.slice(0, i).join('/')] = true;
    }
  });
  return Object.keys(folders).sort();
}

// Check if folder has children
function hasChildren(folderPath, files, folders) {
  const hasFiles = Object.keys(files).some(function(name) {
    return name.startsWith(folderPath + '/');
  });
  const hasFolders = folders.some(function(f) {
    return f.startsWith(folderPath + '/');
  });
  return hasFiles || hasFolders;
}

// Get child items for a folder
function getChildItems(folderPath, files, folders) {
  const children = [];
  
  Object.keys(files).forEach(function(name) {
    if (name.startsWith(folderPath + '/')) {
      const childPath = name.substring(folderPath.length + 1);
      const childParts = childPath.split('/');
      if (childParts.length === 1) {
        children.push({ type: 'file', path: name, name: childParts[0] });
      } else {
        const childFolder = folderPath + '/' + childParts[0];
        if (!children.some(c => c.type === 'folder' && c.path === childFolder)) {
          children.push({ type: 'folder', path: childFolder, name: childParts[0] });
        }
      }
    }
  });
  
  folders.forEach(function(f) {
    if (f.startsWith(folderPath + '/')) {
      const childParts = f.substring(folderPath.length + 1).split('/');
      if (childParts.length === 1) {
        const childFolder = folderPath + '/' + childParts[0];
        if (!children.some(c => c.path === childFolder)) {
          children.push({ type: 'folder', path: childFolder, name: childParts[0] });
        }
      }
    }
  });
  
  return children.sort(function(a, b) {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'folder' ? -1 : 1;
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isMobile,
    escapeHtml,
    unescapeHtml,
    getFileIcon,
    getLang,
    getFileExtension,
    getFileNameWithoutExtension,
    formatDate,
    formatNumber,
    generateId,
    debounce,
    throttle,
    cloneObject,
    mergeObjects,
    isEmpty,
    getTokenPlan,
    getStatusColor,
    getStatusText,
    foldersFromFiles,
    hasChildren,
    getChildItems
  };
}
