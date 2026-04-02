import { Badge } from '@/components/ui/badge';
import type { BillingType } from '@/types';

interface BillingTypeBadgeProps {
  type: BillingType;
  className?: string;
}

export function BillingTypeBadge({ type, className = '' }: BillingTypeBadgeProps) {
  switch (type) {
    case 'subscription':
      return (
        <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 ${className}`}>
          Subscription
        </Badge>
      );
    case 'usage-based':
      return (
        <Badge variant="outline" className={`bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 ${className}`}>
          Usage-Based
        </Badge>
      );
    case 'hybrid':
      return (
        <Badge variant="outline" className={`bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800 ${className}`}>
          Hybrid
        </Badge>
      );
    default:
      return <Badge variant="outline" className={className}>{type}</Badge>;
  }
}
