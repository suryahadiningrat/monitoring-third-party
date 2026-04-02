import { useServices } from './useServices';

export function useServicesByProject(projectId?: string) {
  const { services, isLoading } = useServices();

  const projectServices = projectId
    ? services.filter((s) => s.projectId === projectId)
    : services;

  return {
    services: projectServices,
    isLoading,
  };
}
