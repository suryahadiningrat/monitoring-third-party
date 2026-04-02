import type { BillingCycle } from '../types';

/**
 * Format number ke currency IDR
 * @param amount Number
 * @returns string format IDR
 */
export function formatIDR(amount: number): string {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Konversi biaya ke biaya bulanan berdasarkan billing cycle
 * @param cost Biaya
 * @param cycle Billing cycle (monthly, quarterly, yearly)
 * @returns number biaya bulanan
 */
export function toMonthly(cost: number, cycle: BillingCycle): number {
  if (!cost) return 0;
  
  switch (cycle) {
    case 'yearly':
      return cost / 12;
    case 'quarterly':
      return cost / 3;
    case 'monthly':
    default:
      return cost;
  }
}
