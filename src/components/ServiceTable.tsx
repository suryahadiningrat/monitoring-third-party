import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { formatIDR } from '@/utils/currency.utils';
import { formatDate } from '@/utils/date.utils';
import { Edit, Trash2 } from 'lucide-react';
import type { ServiceWithStatus } from '@/types';
import { ProjectBadge } from './ProjectBadge';
import { BillingTypeBadge } from './BillingTypeBadge';
import { useProjects } from '@/hooks/useProjects';

export interface ServiceTableProps {
  services: ServiceWithStatus[];
  onEdit: (service: ServiceWithStatus) => void;
  onDelete: (id: string) => void;
}

export function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  const { projects } = useProjects();

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-md border border-dashed">
        <p className="text-muted-foreground">Tidak ada data layanan yang ditemukan.</p>
      </div>
    );
  }

  // Generate initial badge color based on name length or first char to keep it deterministic
  const getInitialColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-amber-100 text-amber-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-cyan-100 text-cyan-700',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Billing</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Biaya/Bulan</TableHead>
            <TableHead>Renewal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${getInitialColor(
                      service.name
                    )}`}
                  >
                    {service.name.charAt(0).toUpperCase()}
                  </div>
                  {service.name}
                </div>
              </TableCell>
              <TableCell>
                <ProjectBadge project={projects.find(p => p.id === service.projectId)} />
              </TableCell>
              <TableCell>
                <BillingTypeBadge type={service.billingType} />
              </TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {service.accounts.map((acc, idx) => (
                    <span key={idx} className={idx === 0 ? '' : 'text-xs text-muted-foreground'}>
                      {acc.email} {acc.label && `(${acc.label})`}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatIDR(service.costPerMonth)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{formatDate(service.renewalDate)}</span>
                  {service.daysUntilRenewal !== null && (
                    <span className="text-xs text-muted-foreground">
                      {service.daysUntilRenewal < 0
                        ? 'Sudah lewat'
                        : `${service.daysUntilRenewal} hari lagi`}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={service.renewalStatus} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(service)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(service.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
