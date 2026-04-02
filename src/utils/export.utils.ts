import type { Service } from '../types';
import { getStatus } from './date.utils';
import { format } from 'date-fns';

export function exportToCSV(services: Service[]) {
  // Header CSV
  const headers = [
    'Nama',
    'Kategori',
    'Email',
    'Biaya/Bulan',
    'Renewal',
    'Status'
  ];

  // Map data layanan ke baris CSV
  const rows = services.map(service => {
    const primaryEmail = service.accounts[0]?.email || '-';
    // Format renewalDate ke dd/MM/yyyy jika ada, jika tidak '-'
    const renewal = service.renewalDate ? format(new Date(service.renewalDate), 'dd/MM/yyyy') : '-';
    const status = getStatus(service.renewalDate);
    
    // Pastikan escape karakter koma/kutip jika ada dalam string
    const escapeCsv = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;

    return [
      escapeCsv(service.name),
      escapeCsv(service.category),
      escapeCsv(primaryEmail),
      service.costPerMonth,
      escapeCsv(renewal),
      escapeCsv(status)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const today = format(new Date(), 'yyyy-MM-dd');
  link.setAttribute('href', url);
  link.setAttribute('download', `third-party-monitor-${today}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
