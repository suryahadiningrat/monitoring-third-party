import { useProjectsStore } from '../store/projects.store';

export function useProjects() {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjectsStore();

  const activeProjects = projects.filter((p) => p.isActive);

  return {
    projects: activeProjects,
    allProjects: projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
  };
}
