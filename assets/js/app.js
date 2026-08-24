window.VibeCodeProjectStore = (function () {
	var projectsKey = 'vibecode_projects';

	function readProjects() {
		try { return JSON.parse(localStorage.getItem(projectsKey) || '[]'); }
		catch (error) { return []; }
	}

	function saveSnapshot(snapshot) {
		var projects = readProjects();
		var existing = projects.findIndex(function (project) { return project.id === snapshot.id; });
		if (existing === -1) projects.unshift(snapshot); else projects[existing] = snapshot;
		localStorage.setItem(projectsKey, JSON.stringify(projects.slice(0, 24)));
		localStorage.setItem('vibecode_active_project', snapshot.id);
	}

	function restore(snapshot) {
		localStorage.setItem('vibecode_files', JSON.stringify(snapshot.files || {}));
		localStorage.setItem('vibecode_folders', JSON.stringify(snapshot.folders || []));
		localStorage.setItem('vibecode_repo', JSON.stringify(snapshot.repo || null));
		if (snapshot.userId) localStorage.setItem('vibecode_userId', snapshot.userId);
		localStorage.setItem('vibecode_active_project', snapshot.id);
	}

	function deleteProject(projectId) {
		var projects = readProjects();
		var filtered = projects.filter(function(p) { return p.id !== projectId; });
		localStorage.setItem(projectsKey, JSON.stringify(filtered));
		
		if (localStorage.getItem('vibecode_active_project') === projectId) {
			localStorage.removeItem('vibecode_active_project');
		}
	}

	function getActiveProject() {
		var activeId = localStorage.getItem('vibecode_active_project');
		if (!activeId) return null;
		
		var projects = readProjects();
		return projects.find(function(p) { return p.id === activeId; }) || null;
	}

	return {
		readProjects: readProjects,
		saveSnapshot: saveSnapshot,
		restore: restore,
		deleteProject: deleteProject,
		getActiveProject: getActiveProject
	};
}());
