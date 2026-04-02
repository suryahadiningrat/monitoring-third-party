import { useAlertsStore } from '../store/alerts.store';

export function useAlertLogs() {
  const { alertLogs, isLoading, addAlertLog, clearAlertLogs } = useAlertsStore();

  return {
    alertLogs,
    isLoading,
    addAlertLog,
    clearAlertLogs,
  };
}
