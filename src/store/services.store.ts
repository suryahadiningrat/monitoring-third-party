import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Service } from '../types';
import seedData from '../data/services.json';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  lastUpdated: string;
  loadServices: () => void;
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
}

export const useServicesStore = create<ServicesState>()(
  persist(
    (set) => ({
      services: seedData.services as Service[],
      isLoading: false,
      lastUpdated: new Date().toISOString(),

      loadServices: () => {
        set({ isLoading: true });
        // Simulating async load if needed, but for now we just use what's in state
        // The persist middleware will automatically load from localStorage
        set({ isLoading: false });
      },

      addService: (newServiceData) => {
        set((state) => {
          const newService: Service = {
            ...newServiceData,
            id: crypto.randomUUID(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            services: [...state.services, newService],
            lastUpdated: new Date().toISOString(),
          };
        });
      },

      updateService: (id, updatedFields) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id
              ? { ...service, ...updatedFields, updatedAt: new Date().toISOString() }
              : service
          ),
          lastUpdated: new Date().toISOString(),
        }));
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id
              ? { ...service, isActive: false, updatedAt: new Date().toISOString() }
              : service
          ),
          lastUpdated: new Date().toISOString(),
        }));
      },
    }),
    {
      name: 'services-storage',
      // By default it saves to localStorage
    }
  )
);
