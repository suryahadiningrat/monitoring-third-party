import { useState } from 'react';
import { useServices } from '@/hooks';
import { ServiceTable } from '@/components/ServiceTable';
import { SearchFilter } from '@/components/SearchFilter';
import { ServiceForm } from '@/components/ServiceForm';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { exportToCSV } from '@/utils/export.utils';
import type { ServiceCategory, ServiceWithStatus } from '@/types';

const CATEGORIES: ServiceCategory[] = [
  'Domain & Hosting',
  'Email Marketing',
  'Push Notification',
  'SEO Tools',
  'QR & Link Tool',
  'WhatsApp & Notif',
  'Cloud Storage',
  'Meeting & Collab',
  'Analytics',
  'Lainnya',
];

export function Services() {
  const {
    services,
    allServices,
    addService,
    updateService,
    deleteService,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
  } = useServices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceWithStatus | undefined>();

  const handleExport = () => {
    exportToCSV(allServices);
  };

  const handleEdit = (service: ServiceWithStatus) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      deleteService(id);
    }
  };

  const handleSubmit = (data: Partial<ServiceWithStatus>) => {
    if (editingService) {
      updateService(editingService.id, data);
    } else {
      addService(data as Parameters<typeof addService>[0]);
    }
    setIsFormOpen(false);
    setEditingService(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Layanan</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => {
            setEditingService(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Layanan
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border shadow-sm">
        <SearchFilter
          onSearch={setSearchQuery}
          onFilterCategory={setCategoryFilter}
          onFilterStatus={setStatusFilter}
          categories={CATEGORIES}
        />
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ServiceForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingService(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={editingService}
      />
    </div>
  );
}
