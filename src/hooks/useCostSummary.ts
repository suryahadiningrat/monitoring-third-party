import { useMemo } from 'react';
import { useServices } from './useServices';
import { toMonthly } from '../utils/currency.utils';
import type { CostSummary, ServiceCategory } from '../types';

export function useCostSummary(): CostSummary {
  const { allServices } = useServices();

  const summary = useMemo(() => {
    let totalMonthly = 0;
    let totalYearly = 0;
    
    const categoryMap = new Map<ServiceCategory, { monthly: number; yearly: number; count: number }>();

    allServices.forEach((service) => {
      // Mengasumsikan costPerMonth di database sebenarnya adalah cost per siklus,
      // kita gunakan toMonthly untuk mendapatkan biaya per bulan.
      const monthlyCost = toMonthly(service.costPerMonth, service.billingCycle);
      const yearlyCost = monthlyCost * 12;

      totalMonthly += monthlyCost;
      totalYearly += yearlyCost;

      const current = categoryMap.get(service.category) || { monthly: 0, yearly: 0, count: 0 };
      categoryMap.set(service.category, {
        monthly: current.monthly + monthlyCost,
        yearly: current.yearly + yearlyCost,
        count: current.count + 1,
      });
    });

    const byCategory = Array.from(categoryMap.entries()).map(([category, data]) => {
      const percentage = totalMonthly > 0 ? (data.monthly / totalMonthly) * 100 : 0;
      return {
        category,
        monthly: data.monthly,
        yearly: data.yearly,
        percentage,
        count: data.count,
      };
    });

    // Sort by largest monthly cost
    byCategory.sort((a, b) => b.monthly - a.monthly);

    return {
      totalMonthly,
      totalYearly,
      byCategory,
    };
  }, [allServices]);

  return summary;
}
