import type { ServiceStatus } from '../types';

export function calcBudgetPercent(currentUsage: number, budgetCap: number): number {
  if (budgetCap <= 0) return 0;
  return Math.min(Math.round((currentUsage / budgetCap) * 100), 100);
}

export function getBudgetStatus(usedPercent?: number): ServiceStatus {
  if (usedPercent === undefined) return 'unknown';
  if (usedPercent >= 100) return 'danger';
  if (usedPercent >= 80) return 'warn';
  if (usedPercent >= 50) return 'ok'; // info saja
  return 'ok';
}

export function estimateDaysLeft(balance: number, usageToday: number): number | null {
  if (!usageToday || usageToday <= 0) return null;
  return Math.floor(balance / usageToday);
}
