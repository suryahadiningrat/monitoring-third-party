import { useMemo, useState } from 'react';
import { useServicesStore } from '../store/services.store';
import type { ServiceWithStatus, ServiceCategory, ServiceStatus } from '../types';
import { daysUntil, getStatus } from '../utils/date.utils';

export function useServices() {
  const store = useServicesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'All'>('All');

  const servicesWithStatus: ServiceWithStatus[] = useMemo(() => {
    return store.services
      .filter((s) => s.isActive)
      .map((service) => {
        const remainingDays = service.renewalDate ? daysUntil(service.renewalDate) : null;
        const status = getStatus(service.renewalDate);
        return {
          ...service,
          daysUntilRenewal: remainingDays,
          status,
        };
      });
  }, [store.services]);

  const filteredServices = useMemo(() => {
    return servicesWithStatus.filter((service) => {
      const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.accounts.some(acc => acc.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryFilter === 'All' || service.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || service.status === statusFilter;
      
      return matchSearch && matchCategory && matchStatus;
    });
  }, [servicesWithStatus, searchQuery, categoryFilter, statusFilter]);

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
  };
}
