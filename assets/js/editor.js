// ============ EDITOR FUNCTIONS ============

// Render tabs
function renderTabs() {
  if (!DOM.tabs) return;
  
  DOM.tabs.innerHTML = '';
  VibeCodeState.openTabs.forEach(function(name) {
    const tab = document.createElement('div');
    tab.className = 'tab' + (VibeCodeState.activeFile === name ? ' active' : '');
    tab.innerHTML = '<span>' + getFileIcon(name) + ' ' + name + '</span><span class="close" id="closeTab_' + name + '">×</span>';
    tab.onclick = function() { 
      VibeCodeState.activeFile = name; 
      renderTabs(); 
      renderTree(); 
      renderEditor(); 
    };
    DOM.tabs.appendChild(tab);
    
    const closeBtn = document.getElementById('closeTab_' + name);
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeTab(name, e);
      });
    }
  });
}

// Render file tree
function renderTree() {
  if (!DOM.fileTree) return;
  
  DOM.fileTree.innerHTML = '';
  
  const rootItems = [];
  
  // Add root level files
  Object.keys(VibeCodeState.files).forEach(function(name) {
    if (!name.includes('/')) {
      rootItems.push({ type: 'file', path: name, name: name });
    }
  });
  
  // Add root level folders
  VibeCodeState.folders.forEach(function(f) {
    if (!f.includes('/')) {
      rootItems.push({ type: 'folder', path: f, name: f });
    }
  });
  
  // Sort: folders first, then files, both alphabetically
  rootItems.sort(function(a, b) {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'folder' ? -1 : 1;
  });
  
  rootItems.forEach(function(item) {
    renderTreeItem(item, 1, '');
  });
}

// Render a single tree item
function renderTreeItem(item, depth, parentPath) {
  if (!DOM.fileTree) return;
  
  const element = document.createElement('div');
  element.className = 'tree-item' + (VibeCodeState.activeFile === item.path ? ' active' : '');
  element.style.paddingLeft = (depth * 12) + 'px';
  
  if (item.type === 'folder') {
    const isExpanded = isFolderExpanded(item.path);
    const hasChild = hasChildren(item.path, VibeCodeState.files, VibeCodeState.folders);
    const chevIcon = hasChild ? (isExpanded ? '▼' : '▾') : ' ';
    element.className = 'tree-item folder' + (VibeCodeState.activeFile === item.path ? ' active' : '');
    
    if (hasChild) {
      element.innerHTML = '<span class="chev" onclick="event.stopPropagation(); toggleFolder(\'' + item.path + '\')">' + chevIcon + '</span><span class="icon"><i class="fas fa-folder"></i></span><span class="name">' + escapeHtml(item.name) + '</span>';
      element.onclick = function(e) {
        if (e.target.className === 'chev' || e.target.className === 'name' || e.target.parentElement.className === 'icon') {
          toggleFolder(item.path);
        }
      };
    } else {
      element.innerHTML = '<span class="chev"></span><span class="icon"><i class="fas fa-folder"></i></span><span class="name">' + escapeHtml(item.name) + '</span>';
    }
    
    element.oncontextmenu = function(e) { 
      e.preventDefault(); 
      deleteItem('folder', item.path); 
    };
    DOM.fileTree.appendChild(element);
    
    if (isExpanded && hasChild) {
      const children = getChildItems(item.path, VibeCodeState.files, VibeCodeState.folders);
      children.forEach(function(child) {
        renderTreeItem(child, depth + 1, item.path);
      });
    }
  } else {
    element.innerHTML = '<span class="indent"></span><span class="chev"></span><span class="icon">' + getFileIcon(item.path) + '</span><span class="name">' + escapeHtml(item.name) + '</span>';
    element.onclick = function() { openFile(item.path); };
    element.oncontextmenu = function(e) { 
      e.preventDefault(); 
      deleteItem('file', item.path); 
    };
    DOM.fileTree.appendChild(element);
  }
}

// Render editor
function renderEditor() {
  if (!DOM.editorWrap) return;
  
  if (!VibeCodeState.activeFile) {
    DOM.editorWrap.innerHTML = `
      <div class="welcome" id="welcome">
        <h1>VibeCode</h1>
        <p>Ship reliable software from idea to production, powered by Cloudflare Worker AI.</p>
        <div class="shortcuts">
          <div><span>Ctrl+N</span> New File</div>
          <div><span>Ctrl+S</span> Save File</div>
          <div><span>Ctrl+L</span> Focus AI Chat</div>
        </div>
      </div>
    `;
    if (DOM.statusFile) DOM.statusFile.textContent = 'No file';
    if (DOM.statusLang) DOM.statusLang.textContent = 'Plain Text';
    return;
  }
  
  const content = VibeCodeState.files[VibeCodeState.activeFile] || '';
  const lines = content.split('\n').length;
  let lineNums = '';
  for (let i = 1; i <= lines; i++) {
    lineNums += i + '\n';
  }
  
  DOM.editorWrap.innerHTML = '<div class="line-numbers">' + lineNums + '</div><textarea class="editor" id="editor" spellcheck="false">' + escapeHtml(content) + '</textarea>';
  
  const editor = document.getElementById('editor');
  if (!editor) return;
  
  // Handle editor input
  editor.oninput = function() {
    VibeCodeState.files[VibeCodeState.activeFile] = editor.value;
    saveState();
    const ln = editor.value.split('\n').length;
    let newLineNums = '';
    for (let j = 1; j <= ln; j++) {
      newLineNums += j + '\n';
    }
    const lineNumbersEl = DOM.editorWrap.querySelector('.line-numbers');
    if (lineNumbersEl) {
      lineNumbersEl.textContent = newLineNums;
    }
    markChanged(VibeCodeState.activeFile);
  };
  
  // Sync scroll between editor and line numbers
  editor.onscroll = function() {
    const lineNumbersEl = DOM.editorWrap.querySelector('.line-numbers');
    if (lineNumbersEl) {
      lineNumbersEl.scrollTop = editor.scrollTop;
    }
  };
  
  // Handle tab key
  editor.onkeydown = function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      editor.dispatchEvent(new Event('input'));
    }
  };
  
  // Update status bar
  if (DOM.statusFile) DOM.statusFile.textContent = VibeCodeState.activeFile;
  if (DOM.statusLang) DOM.statusLang.textContent = getLang(VibeCodeState.activeFile);
}

// Mark file as changed in git
function markChanged(name) {
  let found = false;
  for (let i = 0; i < VibeCodeState.gitChanges.length; i++) {
    if (VibeCodeState.gitChanges[i].name === name) {
      found = true;
      break;
    }
  }
  if (!found) {
    VibeCodeState.gitChanges.push({ name: name, status: 'M', staged: false });
    renderChanges();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderTabs,
    renderTree,
    renderTreeItem,
    renderEditor,
    markChanged
  };
}
