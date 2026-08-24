(function () {
  var worker = localStorage.getItem('vibecode_worker') || 'https://vibecode.harisudahmalam.workers.dev';
  var ideUrl = window.VIBECODE_IDE_URL || 'index.html';
  var projects = VibeCodeProjectStore.readProjects();

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char];
    });
  }

  function dateLabel(value) {
    return value ? new Date(value).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' }) : 'Belum disimpan';
  }

  function restoreProject(project) {
    VibeCodeProjectStore.restore(project);
    window.location.href = ideUrl;
  }

  function renderProjects() {
    document.getElementById('projectCount').textContent = projects.length + ' project';
    document.getElementById('projects').innerHTML = projects.length ? projects.map(function (project) {
      var fileCount = Object.keys(project.files || {}).length;
      var repoName = project.repo && project.repo.name ? project.repo.name : 'Local workspace';
      return '<article class="project-card"><button class="project-open" data-id="' + escapeHtml(project.id) + '"><span class="project-icon">{ }</span><span class="project-copy"><strong>' + escapeHtml(project.name) + '</strong><span>' + escapeHtml(repoName) + '</span></span><span class="project-arrow">→</span></button><div class="project-meta"><span>' + fileCount + ' files</span><span>Updated ' + dateLabel(project.updatedAt) + '</span></div></article>';
    }).join('') : '<div class="empty empty-projects">Belum ada project tersimpan. Buka IDE dan mulai membuat sesuatu.</div>';
    document.querySelectorAll('.project-open').forEach(function (button) {
      button.addEventListener('click', function () {
        var project = projects.find(function (item) { return item.id === button.dataset.id; });
        if (project) restoreProject(project);
      });
    });
  }

  function createProject() {
    localStorage.removeItem('vibecode_active_project');
    ['vibecode_files', 'vibecode_folders', 'vibecode_repo'].forEach(function (key) { localStorage.removeItem(key); });
    window.location.href = ideUrl;
  }

  async function loadProfile() {
    try {
      var response = await fetch(worker + '/api/auth/me', { credentials:'include', cache:'no-store' });
      if (!response.ok) throw new Error('not logged in');
      var data = await response.json();
      document.getElementById('login').hidden = true;
      document.getElementById('logout').hidden = false;
      document.getElementById('profile').innerHTML = '<img class="avatar" src="' + escapeHtml(data.user.avatar_url) + '" alt=""><div><strong>' + escapeHtml(data.user.login) + '</strong><span> GitHub connected</span></div>';
    } catch (error) {
      document.getElementById('profile').innerHTML = '<div class="empty">Belum terhubung ke GitHub. Project lokal tetap tersedia.</div>';
    }
  }

  document.getElementById('newProject').addEventListener('click', createProject);
  document.getElementById('login').addEventListener('click', function () { window.location.href = worker + '/auth/github'; });
  document.getElementById('logout').addEventListener('click', async function () { await fetch(worker + '/api/auth/logout', { credentials:'include', cache:'no-store' }); loadProfile(); });
  renderProjects();
  loadProfile();
}());