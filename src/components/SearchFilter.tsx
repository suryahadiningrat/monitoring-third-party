import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { ServiceCategory, ServiceStatus, BillingType } from '@/types';
import { useProjects } from '@/hooks/useProjects';

export interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: ServiceStatus | 'All') => void;
  onFilterCategory: (category: ServiceCategory | 'All') => void;
  onFilterProject?: (projectId: string | 'All') => void;
  onFilterBillingType?: (billingType: BillingType | 'All') => void;
  categories: ServiceCategory[];
}

export function SearchFilter({
  onSearch,
  onFilterStatus,
  onFilterCategory,
  onFilterProject,
  onFilterBillingType,
  categories,
}: SearchFilterProps) {
  const { projects } = useProjects();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari layanan atau email..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 sm:w-auto w-full">
        <Select defaultValue="All" onValueChange={(val) => onFilterStatus(val as ServiceStatus | 'All')}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Semua Status</SelectItem>
            <SelectItem value="ok">Aman</SelectItem>
            <SelectItem value="warn">Perlu Perhatian</SelectItem>
            <SelectItem value="danger">Kritis</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="All" onValueChange={(val) => onFilterCategory(val as ServiceCategory | 'All')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onFilterProject && (
          <Select defaultValue="All" onValueChange={(val) => onFilterProject(val || 'All')}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onFilterBillingType && (
          <Select defaultValue="All" onValueChange={(val) => onFilterBillingType(val as BillingType | 'All')}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Tipe Tagihan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Tipe</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="usage-based">Usage-Based</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
