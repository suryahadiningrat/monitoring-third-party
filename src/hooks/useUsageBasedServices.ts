import { useMemo } from 'react';
import { useServices } from './useServices';
import { calcBudgetPercent } from '../utils/budget.utils';

export function useUsageBasedServices() {
  const { allServices, isLoading } = useServices();

  const usageBasedServices = useMemo(() => {
    return allServices
      .filter((s) => s.billingType === 'usage-based' || s.billingType === 'hybrid')
      .sort((a, b) => {
        const percentA = calcBudgetPercent(a.usageData?.currentUsage || 0, a.budgetCap || 0);
        const percentB = calcBudgetPercent(b.usageData?.currentUsage || 0, b.budgetCap || 0);
        return percentB - percentA; // Sort descending (paling kritis di atas)
      });
  }, [allServices]);

  return {
    services: usageBasedServices,
    isLoading,
  };
}
