import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { Service, Project, AlertThreshold } from '../types';
import { formatIDR } from './currency.utils';

export function buildAlertMessage(
  service: Service,
  project: Project,
  threshold: AlertThreshold
): string {
  const usage = service.usageData?.currentUsage || 0;
  const cap = service.budgetCap || 0;
  const percent = cap > 0 ? Math.round((usage / cap) * 100) : 0;
  const now = format(new Date(), 'dd MMM yyyy HH:mm', { locale: id });

  return `⚠️ *BUDGET ALERT — ${threshold}%*
  
Layanan: ${service.name}
Project: ${project.name}

Usage bulan ini: ${formatIDR(usage)}
Budget cap: ${formatIDR(cap)}
Terpakai: ${percent}%

Segera cek dashboard untuk tindakan lebih lanjut.

_Third Party Monitor — ${now}_`;
}

export function shouldSendAlert(service: Service, threshold: AlertThreshold): boolean {
  const rule = service.alertRules?.find((r) => r.threshold === threshold);
  if (!rule || !rule.enabled) return false;

  // Cek lastTriggeredAt — jangan kirim duplikat dalam bulan yang sama
  if (rule.lastTriggeredAt) {
    const lastTriggered = new Date(rule.lastTriggeredAt);
    const now = new Date();
    if (
      lastTriggered.getMonth() === now.getMonth() &&
      lastTriggered.getFullYear() === now.getFullYear()
    ) {
      return false;
    }
  }

  return true;
}
