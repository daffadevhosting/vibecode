// ============ GLOBAL VARIABLES ============

// State management
const VibeCodeState = {
  files: {},
  folders: [],
  openTabs: [],
  activeFile: null,
  repo: null,
  gitChanges: [],
  chatHistory: [],
  projectId: null,
  userId: null,
  tokenBalance: 0,
  backendWorkerUrl: null,
  expandedFolders: {},
  projectName: null
};

// Configuration
const VibeCodeConfig = {
  DEFAULT_FILES: {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>Hello VibeCode!</h1>
</body>
</html>`,
    'style.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 20px;
  background: #fafafa;
}`,
    'script.js': `// Main script
console.log("Hello from VibeCode!");`,
    'README.md': `# My Project

Dibuat dengan VibeCode IDE.`
  },
  DEFAULT_WORKER_URL: 'https://vibecode.harisudahmalam.workers.dev',
  DEFAULT_MODEL: '@cf/qwen/qwen2.5-coder-32b-instruct',
  BILLING_WORKER_URL: 'https://ai-token-billing.mvstream.workers.dev'
};

// DOM Elements cache
const DOM = {
  app: null,
  titlebar: null,
  main: null,
  sidebar: null,
  editorArea: null,
  chatPanel: null,
  statusbar: null,
  fileTree: null,
  tabs: null,
  editorWrap: null,
  welcome: null,
  chatMessages: null,
  chatInput: null,
  modalBg: null,
  modal: null,
  toast: null,
  backdrop: null,
  mainMenu: null,
  repoName: null,
  statusFile: null,
  statusLang: null,
  statusSync: null,
  tokenBalance: null
};

// Initialize DOM cache
function initDOM() {
  DOM.app = document.querySelector('.app');
  DOM.titlebar = document.querySelector('.titlebar');
  DOM.main = document.querySelector('.main');
  DOM.sidebar = document.querySelector('.sidebar');
  DOM.editorArea = document.querySelector('.editor-area');
  DOM.chatPanel = document.querySelector('.chat-panel');
  DOM.statusbar = document.querySelector('.statusbar');
  DOM.fileTree = document.getElementById('fileTree');
  DOM.tabs = document.getElementById('tabs');
  DOM.editorWrap = document.getElementById('editorWrap');
  DOM.welcome = document.getElementById('welcome');
  DOM.chatMessages = document.getElementById('chatMessages');
  DOM.chatInput = document.getElementById('chatInput');
  DOM.modalBg = document.getElementById('modalBg');
  DOM.modal = document.getElementById('modal');
  DOM.toast = document.getElementById('toast');
  DOM.backdrop = document.getElementById('backdrop');
  DOM.mainMenu = document.getElementById('mainMenu');
  DOM.repoName = document.getElementById('repoName');
  DOM.statusFile = document.getElementById('statusFile');
  DOM.statusLang = document.getElementById('statusLang');
  DOM.statusSync = document.getElementById('statusSync');
  DOM.tokenBalance = document.getElementById('tokenBalance');
}

// Initialize state from localStorage
function initState() {
  const savedFiles = localStorage.getItem('vibecode_files');
  const savedFolders = localStorage.getItem('vibecode_folders');
  const savedRepo = localStorage.getItem('vibecode_repo');
  const savedUserId = localStorage.getItem('vibecode_userId');
  const savedWorkerUrl = localStorage.getItem('vibecode_worker');
  const savedExpandedFolders = localStorage.getItem('vibecode_expandedFolders');
  const savedProjectId = localStorage.getItem('vibecode_active_project');

  VibeCodeState.files = savedFiles ? JSON.parse(savedFiles) : { ...VibeCodeConfig.DEFAULT_FILES };
  VibeCodeState.folders = savedFolders ? JSON.parse(savedFolders) : [];
  VibeCodeState.repo = savedRepo ? JSON.parse(savedRepo) : null;
  VibeCodeState.userId = savedUserId || `user_${Math.random().toString(36).substring(2, 9)}`;
  VibeCodeState.backendWorkerUrl = savedWorkerUrl || VibeCodeConfig.DEFAULT_WORKER_URL;
  VibeCodeState.expandedFolders = savedExpandedFolders ? JSON.parse(savedExpandedFolders) : {};
  VibeCodeState.projectId = savedProjectId;
  VibeCodeState.openTabs = [];
  VibeCodeState.activeFile = null;
  VibeCodeState.gitChanges = [];
  VibeCodeState.chatHistory = [];
  VibeCodeState.tokenBalance = 0;
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('vibecode_files', JSON.stringify(VibeCodeState.files));
  localStorage.setItem('vibecode_folders', JSON.stringify(VibeCodeState.folders));
  if (VibeCodeState.repo) {
    localStorage.setItem('vibecode_repo', JSON.stringify(VibeCodeState.repo));
  }
  localStorage.setItem('vibecode_userId', VibeCodeState.userId);
  localStorage.setItem('vibecode_worker', VibeCodeState.backendWorkerUrl);
  localStorage.setItem('vibecode_expandedFolders', JSON.stringify(VibeCodeState.expandedFolders));
  if (VibeCodeState.projectId) {
    localStorage.setItem('vibecode_active_project', VibeCodeState.projectId);
  }
}

// Global model and project instruction
let modelId = localStorage.getItem('vibecode_model') || VibeCodeConfig.DEFAULT_MODEL;
let projectInstruction = localStorage.getItem('vibecode_project_instruction') || '';

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VibeCodeState,
    VibeCodeConfig,
    DOM,
    initDOM,
    initState,
    saveState,
    modelId,
    projectInstruction
  };
}
