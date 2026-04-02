import { differenceInDays, format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import type { ServiceStatus } from '../types';

/**
 * Menghitung sisa hari dari hari ini sampai tanggal renewal
 * @param renewalDate ISO date string
 * @returns number sisa hari
 */
export function daysUntil(renewalDate: string): number {
  if (!renewalDate) return 0;
  return differenceInDays(parseISO(renewalDate), new Date());
}

/**
 * Menentukan status berdasarkan tanggal renewal
 * ok: > 30 hari
 * warn: <= 30 hari
 * danger: <= 7 hari atau sudah lewat
 * unknown: tidak ada tanggal renewal
 * @param renewalDate ISO date string
 * @returns ServiceStatus
 */
export function getStatus(renewalDate?: string): ServiceStatus {
  if (!renewalDate) return 'unknown';
  
  const remainingDays = daysUntil(renewalDate);
  
  if (remainingDays <= 7) return 'danger';
  if (remainingDays <= 30) return 'warn';
  return 'ok';
}

/**
 * Format tanggal ke format lokal Indonesia
 * @param dateString ISO date string
 * @param formatStr Format string date-fns (default: 'd MMM yyyy')
 * @returns string formatted date
 */
export function formatDate(dateString?: string, formatStr: string = 'd MMM yyyy'): string {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), formatStr, { locale: id });
  } catch {
    return dateString;
  }
}
