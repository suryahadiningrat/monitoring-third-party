import { useMemo } from 'react';
import { useServicesStore } from '../store/services.store';
import { calcBudgetPercent, getBudgetStatus } from '../utils/budget.utils';

export function useBudgetStatus(serviceId: string) {
  const { services } = useServicesStore();
  
  const status = useMemo(() => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return { percent: 0, status: 'unknown' as const };
    
    if (service.billingType === 'subscription') {
      return { percent: 0, status: 'ok' as const };
    }
    
    const usage = service.usageData?.currentUsage || 0;
    const cap = service.budgetCap || 0;
    const percent = calcBudgetPercent(usage, cap);
    
    return {
      percent,
      status: getBudgetStatus(percent),
    };
  }, [services, serviceId]);

  return status;
}
