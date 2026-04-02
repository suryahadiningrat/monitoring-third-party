import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '../types';
import appData from '../data/app-data.json';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  loadProjects: () => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: appData.projects as Project[],
      isLoading: false,

      loadProjects: () => {
        set({ isLoading: true });
        set({ isLoading: false });
      },

      addProject: (newProjectData) => {
        set((state) => {
          const newProject: Project = {
            ...newProjectData,
            id: crypto.randomUUID(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            projects: [...state.projects, newProject],
          };
        });
      },

      updateProject: (id, updatedFields) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updatedFields, updatedAt: new Date().toISOString() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, isActive: false, updatedAt: new Date().toISOString() }
              : project
          ),
        }));
      },
    }),
    {
      name: 'projects-storage',
    }
  )
);
