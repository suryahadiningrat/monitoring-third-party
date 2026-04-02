import { useMemo, useState } from 'react';
import { useServicesStore } from '../store/services.store';
import { useProjectsStore } from '../store/projects.store';
import type { ServiceWithStatus, ServiceCategory, ServiceStatus, BillingType } from '../types';
import { daysUntil, getStatus } from '../utils/date.utils';
import { calcBudgetPercent, getBudgetStatus } from '../utils/budget.utils';
import { useSearchParams } from 'react-router-dom';

export function useServices() {
  const store = useServicesStore();
  const { projects } = useProjectsStore();
  const [searchParams] = useSearchParams();
  
  const initialProjectFilter = searchParams.get('project') || 'All';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'All'>('All');
  const [projectFilter, setProjectFilter] = useState<string | 'All'>(initialProjectFilter);
  const [billingTypeFilter, setBillingTypeFilter] = useState<BillingType | 'All'>('All');

  const servicesWithStatus: ServiceWithStatus[] = useMemo(() => {
    return store.services
      .filter((s) => s.isActive)
      .map((service) => {
        const remainingDays = service.renewalDate ? daysUntil(service.renewalDate) : null;
        const renewalStatus = getStatus(service.renewalDate);
        
        let budgetStatus: ServiceStatus = 'ok';
        if (service.billingType === 'usage-based' || service.billingType === 'hybrid') {
           const percent = calcBudgetPercent(service.usageData?.currentUsage || 0, service.budgetCap || 0);
           budgetStatus = getBudgetStatus(percent);
        }

        const project = projects.find((p) => p.id === service.projectId);

        return {
          ...service,
          daysUntilRenewal: remainingDays,
          renewalStatus,
          budgetStatus,
          project,
        };
      });
  }, [store.services, projects]);

  const filteredServices = useMemo(() => {
    return servicesWithStatus.filter((service) => {
      const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.accounts.some(acc => acc.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryFilter === 'All' || service.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || service.renewalStatus === statusFilter || service.budgetStatus === statusFilter;
      const matchProject = projectFilter === 'All' || service.projectId === projectFilter;
      const matchBillingType = billingTypeFilter === 'All' || service.billingType === billingTypeFilter;
      
      return matchSearch && matchCategory && matchStatus && matchProject && matchBillingType;
    });
  }, [servicesWithStatus, searchQuery, categoryFilter, statusFilter, projectFilter, billingTypeFilter]);

  return {
    // Data
    services: filteredServices,
    allServices: servicesWithStatus,
    
    // Actions from store
    isLoading: store.isLoading,
    addService: store.addService,
    updateService: store.updateService,
    deleteService: store.deleteService,
    
    // Filters state
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    billingTypeFilter,
    setBillingTypeFilter,
  };
}
