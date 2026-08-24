// ============ GIT OPERATIONS ============

// Render changes list
function renderChanges() {
  const list = document.getElementById('changesList');
  if (!list) return;
  
  if (!VibeCodeState.gitChanges.length) {
    list.innerHTML = '<div style="padding:8px;color:var(--text-dim);font-size:12px;">No changes</div>';
    return;
  }
  
  const items = [];
  for (let i = 0; i < VibeCodeState.gitChanges.length; i++) {
    const c = VibeCodeState.gitChanges[i];
    items.push('<div class="change-item"><span class="status ' + c.status + '">' + c.status + '</span><span style="flex:1">' + c.name + '</span><span style="color:var(--text-dim);font-size:10px;">' + (c.staged ? 'staged' : '') + '</span></div>');
  }
  list.innerHTML = items.join('');
}

// Stage all changes
function stageAll() {
  for (let i = 0; i < VibeCodeState.gitChanges.length; i++) {
    VibeCodeState.gitChanges[i].staged = true;
  }
  renderChanges();
  toast('All changes staged');
}

// Unstage all changes
function unstageAll() {
  for (let i = 0; i < VibeCodeState.gitChanges.length; i++) {
    VibeCodeState.gitChanges[i].staged = false;
  }
  renderChanges();
  toast('Unstaged all');
}

// Clone repository
async function cloneRepo() {
  const urlInput = document.getElementById('repoUrl');
  if (!urlInput) return;
  
  const url = urlInput.value.trim();
  if (!url) { 
    toast('Masukkan URL repo', 'error'); 
    return; 
  }
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  if (!backendUrl) { 
    toast('Backend Worker URL belum diatur', 'error'); 
    return; 
  }
  
  try {
    const html = `
      <h3>Cloning Repository</h3>
      <p style="color:var(--text-dim);font-size:12px;margin-bottom:12px;">Cloning dari: ${url}</p>
      <div style="background:var(--bg);padding:10px;border-radius:3px;font-family:monospace;font-size:11px;min-height:80px;">
        <div>$ git clone ${url}</div>
        <div style="color:var(--text-dim)">Connecting to backend...</div>
      </div>
    `;
    showModal(html);
    
    const response = await fetch(backendUrl + '/api/git/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });
    
    if (response.status === 401) {
      window.location.href = backendUrl + '/auth/github';
      return;
    }
    
    if (!response.ok) throw new Error('Git Error: ' + response.statusText);
    
    const data = await response.json();
    VibeCodeState.repo = { 
      url: url, 
      name: data.repo || url.split('/').pop().replace('.git', '') 
    };
    saveState();
    
    if (DOM.repoName) {
      DOM.repoName.textContent = '◆ ' + VibeCodeState.repo.name;
    }
    
    hideModal();
    toast('Repository cloned: ' + data.repo, 'success');
  } catch (error) {
    hideModal();
    toast('Error cloning: ' + error.message, 'error');
  }
}

// Commit changes
async function commitChanges() {
  const msgInput = document.getElementById('commitMsg');
  if (!msgInput) return;
  
  const msg = msgInput.value.trim();
  if (!msg) { 
    toast('Commit message kosong', 'error'); 
    return; 
  }
  if (!VibeCodeState.gitChanges.length) { 
    toast('Tidak ada perubahan', 'error'); 
    return; 
  }
  if (!VibeCodeState.repo) { 
    toast('Belum ada repo aktif', 'error'); 
    return; 
  }
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  try {
    const files = [];
    for (let i = 0; i < VibeCodeState.gitChanges.length; i++) {
      files.push(VibeCodeState.gitChanges[i].name);
    }
    
    const response = await fetch(backendUrl + '/api/git/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo: VibeCodeState.repo.name,
        message: msg,
        files: files
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Commit failed');
    
    VibeCodeState.gitChanges = [];
    if (msgInput) msgInput.value = '';
    renderChanges();
    toast('Committed: "' + msg + '"', 'success');
  } catch (error) {
    toast('Commit error: ' + error.message, 'error');
  }
}

// Push to remote
async function pushRepo() {
  if (!VibeCodeState.repo) { 
    toast('Belum ada repo. Clone dulu!', 'error'); 
    return; 
  }
  
  if (DOM.statusSync) {
    DOM.statusSync.textContent = '⟳ pushing...';
  }
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  try {
    const response = await fetch(backendUrl + '/api/git/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo: VibeCodeState.repo.name, branch: 'main' })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Push failed');
    
    if (DOM.statusSync) {
      DOM.statusSync.textContent = '⟳ synced';
    }
    toast('Pushed to ' + VibeCodeState.repo.name, 'success');
  } catch (error) {
    if (DOM.statusSync) {
      DOM.statusSync.textContent = '⚠ sync error';
    }
    toast('Push error: ' + error.message, 'error');
  }
}

// Pull from remote
async function pullRepo() {
  if (!VibeCodeState.repo) { 
    toast('Belum ada repo', 'error'); 
    return; 
  }
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  try {
    const response = await fetch(backendUrl + '/api/git/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo: VibeCodeState.repo.name })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Pull failed');
    
    // Refresh file list
    await loadFiles();
    toast('Pulled ' + (data.files?.length || 0) + ' files', 'success');
  } catch (error) {
    toast('Pull error: ' + error.message, 'error');
  }
}

// Load files from workspace
async function loadFiles() {
  if (!VibeCodeState.repo || !VibeCodeState.repo.owner || !VibeCodeState.repo.name || !VibeCodeState.repo.branch) {
    return;
  }
  
  const backendUrl = VibeCodeState.backendWorkerUrl;
  try {
    const response = await fetch(
      backendUrl + '/api/github/contents?owner=' + 
      encodeURIComponent(VibeCodeState.repo.owner) + 
      '&repo=' + encodeURIComponent(VibeCodeState.repo.name) + 
      '&branch=' + encodeURIComponent(VibeCodeState.repo.branch),
      { credentials: 'include' }
    );
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Repository gagal dimuat');
    
    VibeCodeState.files = {};
    data.files.forEach(function(file) { 
      VibeCodeState.files[file.name] = file.content; 
    });
    VibeCodeState.folders = data.folders && data.folders.length ? data.folders : foldersFromFiles(VibeCodeState.files);
    VibeCodeState.openTabs = [];
    VibeCodeState.activeFile = null;
    
    saveState();
    renderTree();
    renderTabs();
    renderEditor();
  } catch (error) {
    toast(error.message, 'error');
  }
}

// Load workspace branches
async function loadWorkspaceBranches() {
  const repoSelect = document.getElementById('workspaceRepo');
  const branchSelect = document.getElementById('workspaceBranch');
  
  if (!repoSelect || !branchSelect) return;
  
  const value = repoSelect.value;
  if (!value) {
    branchSelect.innerHTML = '<option value="">Select a repository first</option>';
    return;
  }
  
  const parts = value.split('/');
  const backendUrl = VibeCodeState.backendWorkerUrl;
  
  try {
    const response = await fetch(
      backendUrl + '/api/github/branches?owner=' + 
      encodeURIComponent(parts[0]) + 
      '&repo=' + encodeURIComponent(parts[1]),
      { credentials: 'include' }
    );
    
    const branches = await response.json();
    branchSelect.innerHTML = branches.map(function(branch) {
      return '<option value="' + escapeHtml(branch.name) + '">' + escapeHtml(branch.name) + '</option>';
    }).join('');
    
    await loadWorkspaceFiles();
  } catch (error) {
    toast('Failed to load branches: ' + error.message, 'error');
  }
}

// Load workspace files
async function loadWorkspaceFiles() {
  const repoSelect = document.getElementById('workspaceRepo');
  const branchSelect = document.getElementById('workspaceBranch');
  const statusEl = document.getElementById('workspaceStatus');
  
  if (!repoSelect || !branchSelect) return;
  
  const repoValue = repoSelect.value;
  const branch = branchSelect.value;
  
  if (!repoValue || !branch) return;
  
  const parts = repoValue.split('/');
  const backendUrl = VibeCodeState.backendWorkerUrl;
  
  try {
    const response = await fetch(
      backendUrl + '/api/github/contents?owner=' + 
      encodeURIComponent(parts[0]) + 
      '&repo=' + encodeURIComponent(parts[1]) + 
      '&branch=' + encodeURIComponent(branch),
      { credentials: 'include' }
    );
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Repository gagal dimuat');
    
    VibeCodeState.files = {};
    data.files.forEach(function(file) { 
      VibeCodeState.files[file.name] = file.content; 
    });
    VibeCodeState.folders = data.folders && data.folders.length ? data.folders : foldersFromFiles(VibeCodeState.files);
    VibeCodeState.openTabs = [];
    VibeCodeState.activeFile = null;
    VibeCodeState.repo = { 
      name: parts[1], 
      owner: parts[0], 
      branch: branch, 
      url: 'https://github.com/' + repoValue + '.git' 
    };
    
    saveState();
    renderTree();
    renderTabs();
    renderEditor();
    
    if (statusEl) {
      statusEl.textContent = data.files.length + ' file loaded from ' + repoValue + ' @ ' + branch;
    }
    
    hideModal();
  } catch (error) {
    toast('Failed to load files: ' + error.message, 'error');
  }
}

// Load GitHub settings
async function loadGithubSettings() {
  const statusEl = document.getElementById('githubAccountStatus');
  if (!statusEl) return;
  
  try {
    const backendUrl = VibeCodeState.backendWorkerUrl;
    const meResponse = await fetch(backendUrl + '/api/auth/me', { credentials: 'include' });
    
    if (!meResponse.ok) {
      statusEl.textContent = 'Belum login GitHub';
      hideWorkspaceControls();
      return;
    }
    
    const me = await meResponse.json();
    showWorkspaceControls();
    VibeCodeState.userId = String(me.user.id);
    localStorage.setItem('vibecode_userId', VibeCodeState.userId);
    
    const balance = await checkTokenBalance();
    statusEl.innerHTML = '<strong>' + escapeHtml(me.user.login) + '</strong> · ' + getTokenPlan(balance) + ' · ' + formatNumber(balance) + ' tokens';
    
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    const githubLogoutBtn = document.getElementById('githubLogoutBtn');
    
    if (githubLoginBtn) githubLoginBtn.style.display = 'none';
    if (githubLogoutBtn) githubLogoutBtn.style.display = 'inline-flex';
    
    // Load repositories
    const repoResponse = await fetch(backendUrl + '/api/github/repos', { credentials: 'include' });
    const repos = await repoResponse.json();
    
    const workspaceRepoSelect = document.getElementById('workspaceRepo');
    if (workspaceRepoSelect) {
      workspaceRepoSelect.innerHTML = '<option value="">Select repository</option>' + 
        repos.map(function(repo) { 
          return '<option value="' + escapeHtml(repo.owner.login + '/' + repo.name) + '">' + escapeHtml(repo.full_name) + '</option>';
        }).join('');
      
      if (VibeCodeState.repo && VibeCodeState.repo.owner && VibeCodeState.repo.name) {
        workspaceRepoSelect.value = VibeCodeState.repo.owner + '/' + VibeCodeState.repo.name;
        await loadWorkspaceBranches();
        
        const workspaceBranchSelect = document.getElementById('workspaceBranch');
        if (workspaceBranchSelect) {
          workspaceBranchSelect.value = VibeCodeState.repo.branch || workspaceBranchSelect.value;
          await loadWorkspaceFiles();
        }
      }
    }
  } catch (error) {
    if (statusEl) statusEl.textContent = 'Silahkan login terlebih dahulu';
    hideWorkspaceControls();
  }
}

// Logout from GitHub
async function logoutGithub() {
  const backendUrl = VibeCodeState.backendWorkerUrl;
  
  try {
    await fetch(backendUrl + '/api/auth/logout', { credentials: 'include' });
    
    // Reset state
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
    
    updateBalanceUI();
    renderTree();
    renderChanges();
    renderTabs();
    renderEditor();
    
    hideModal();
    toast('GitHub logout berhasil', 'success');
  } catch (error) {
    toast('Logout error: ' + error.message, 'error');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderChanges,
    stageAll,
    unstageAll,
    cloneRepo,
    commitChanges,
    pushRepo,
    pullRepo,
    loadFiles,
    loadWorkspaceBranches,
    loadWorkspaceFiles,
    loadGithubSettings,
    logoutGithub
  };
}
