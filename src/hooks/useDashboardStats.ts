import { useMemo } from 'react';
import { useServices } from './useServices';
import { useCostSummary } from './useCostSummary';
import type { DashboardStats } from '../types';

export function useDashboardStats(): DashboardStats {
  const { allServices } = useServices();
  const { totalMonthly } = useCostSummary();

  const stats = useMemo(() => {
    let criticalCount = 0;
    let warnCount = 0;
    let apiConnectedCount = 0;

    allServices.forEach((service) => {
      if (service.status === 'danger') {
        criticalCount++;
      } else if (service.status === 'warn') {
        warnCount++;
      }

      if (service.apiConfig.status === 'connected') {
        apiConnectedCount++;
      }
    });

    return {
      totalServices: allServices.length,
      totalMonthly,
      criticalCount,
      warnCount,
      apiConnectedCount,
    };
  }, [allServices, totalMonthly]);

  return stats;
}
