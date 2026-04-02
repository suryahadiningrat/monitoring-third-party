import { useMemo } from 'react';
import { useServices } from './useServices';

export function useReminders() {
  const { allServices } = useServices();

  const reminders = useMemo(() => {
    return allServices
      .filter((service) => service.daysUntilRenewal !== null)
      .sort((a, b) => {
        // We know it's not null here due to the filter
        return (a.daysUntilRenewal as number) - (b.daysUntilRenewal as number);
      });
  }, [allServices]);

  return { reminders };
}
