import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AlertLog } from '../types';
import appData from '../data/app-data.json';

interface AlertsState {
  alertLogs: AlertLog[];
  isLoading: boolean;
  addAlertLog: (log: Omit<AlertLog, 'id' | 'sentAt'>) => void;
  clearAlertLogs: () => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set) => ({
      alertLogs: appData.alertLogs as AlertLog[],
      isLoading: false,

      addAlertLog: (newLogData) => {
        set((state) => {
          const newLog: AlertLog = {
            ...newLogData,
            id: crypto.randomUUID(),
            sentAt: new Date().toISOString(),
          };

          return {
            alertLogs: [newLog, ...state.alertLogs], // prepend new logs
          };
        });
      },

      clearAlertLogs: () => {
        set({ alertLogs: [] });
      },
    }),
    {
      name: 'alerts-storage',
    }
  )
);
