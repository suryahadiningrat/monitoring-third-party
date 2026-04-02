import { Badge } from '@/components/ui/badge';
import type { ApiStatus } from '@/types';

export interface ApiStatusBadgeProps {
  apiStatus: ApiStatus;
}

export function ApiStatusBadge({ apiStatus }: ApiStatusBadgeProps) {
  const config = {
    connected: { label: 'Connected', color: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200' },
    pending: { label: 'Pending', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200' },
    manual: { label: 'Manual', color: 'bg-slate-100 text-slate-800 hover:bg-slate-100/80 border-slate-200' },
    error: { label: 'Error', color: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200' },
  };

  const { label, color } = config[apiStatus] || config.manual;

  return (
    <Badge variant="outline" className={`${color} font-medium`}>
      {label}
    </Badge>
  );
}
