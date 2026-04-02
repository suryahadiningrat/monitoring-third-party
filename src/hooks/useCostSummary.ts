import { useMemo } from 'react';
import { useServices } from './useServices';
import { useProjects } from './useProjects';
import { toMonthly } from '../utils/currency.utils';
import type { CostSummary, ServiceCategory } from '../types';

export function useCostSummary(): CostSummary {
  const { allServices } = useServices();
  const { allProjects } = useProjects();

  const summary = useMemo(() => {
    let totalMonthly = 0;
    let totalYearly = 0;
    let usageBasedTotal = 0;
    let subscriptionTotal = 0;
    
    const categoryMap = new Map<ServiceCategory, { monthly: number; yearly: number; count: number }>();
    const projectMap = new Map<string, { monthly: number; count: number }>();

    allServices.forEach((service) => {
      let monthlyCost = 0;
      
      if (service.billingType === 'subscription' || service.billingType === 'hybrid') {
        monthlyCost += toMonthly(service.costPerMonth, service.billingCycle);
      }
      
      if (service.billingType === 'usage-based' || service.billingType === 'hybrid') {
        monthlyCost += service.usageData?.currentUsage || 0;
        usageBasedTotal += service.usageData?.currentUsage || 0;
      }

      if (service.billingType === 'subscription' || service.billingType === 'hybrid') {
        subscriptionTotal += toMonthly(service.costPerMonth, service.billingCycle);
      }

      const yearlyCost = monthlyCost * 12;

      totalMonthly += monthlyCost;
      totalYearly += yearlyCost;

      const currentCat = categoryMap.get(service.category) || { monthly: 0, yearly: 0, count: 0 };
      categoryMap.set(service.category, {
        monthly: currentCat.monthly + monthlyCost,
        yearly: currentCat.yearly + yearlyCost,
        count: currentCat.count + 1,
      });

      const currentProj = projectMap.get(service.projectId) || { monthly: 0, count: 0 };
      projectMap.set(service.projectId, {
        monthly: currentProj.monthly + monthlyCost,
        count: currentProj.count + 1,
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

    const byProject = Array.from(projectMap.entries()).map(([projectId, data]) => {
      const percentage = totalMonthly > 0 ? (data.monthly / totalMonthly) * 100 : 0;
      const project = allProjects.find(p => p.id === projectId);
      return {
        projectId,
        projectName: project ? project.name : 'Unknown Project',
        monthly: data.monthly,
        percentage,
        count: data.count,
      };
    });

    byCategory.sort((a, b) => b.monthly - a.monthly);
    byProject.sort((a, b) => b.monthly - a.monthly);

    return {
      totalMonthly,
      totalYearly,
      byProject,
      byCategory,
      usageBasedTotal,
      subscriptionTotal,
    };
  }, [allServices, allProjects]);

  return summary;
}
