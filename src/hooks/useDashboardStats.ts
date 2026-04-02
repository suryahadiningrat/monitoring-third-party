import { useMemo } from 'react';
import { useServices } from './useServices';
import { useCostSummary } from './useCostSummary';
import { useProjects } from './useProjects';
import type { DashboardStats } from '../types';

export function useDashboardStats(): DashboardStats {
  const { allServices } = useServices();
  const { totalMonthly } = useCostSummary();
  const { projects } = useProjects();

  const stats = useMemo(() => {
    let renewalCriticalCount = 0;
    let renewalWarnCount = 0;
    let budgetAlertCount = 0;
    let apiConnectedCount = 0;

    allServices.forEach((service) => {
      if (service.renewalStatus === 'danger') {
        renewalCriticalCount++;
      } else if (service.renewalStatus === 'warn') {
        renewalWarnCount++;
      }

      if (service.budgetStatus === 'warn' || service.budgetStatus === 'danger') {
        budgetAlertCount++;
      }

      if (service.apiConfig.status === 'connected') {
        apiConnectedCount++;
      }
    });

    return {
      totalServices: allServices.length,
      totalProjects: projects.length,
      totalMonthly,
      renewalCriticalCount,
      renewalWarnCount,
      budgetAlertCount,
      apiConnectedCount,
    };
  }, [allServices, totalMonthly, projects.length]);

  return stats;
}
