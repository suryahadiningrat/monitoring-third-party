import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BudgetProgressBar } from './BudgetProgressBar';
import { formatIDR } from '@/utils/currency.utils';
import { estimateDaysLeft } from '@/utils/budget.utils';
import type { Service } from '@/types';
import { AlertCircle, Clock, Wallet } from 'lucide-react';
import { ProjectBadge } from './ProjectBadge';
import { useProjects } from '@/hooks/useProjects';

interface UsageCardProps {
  service: Service;
}

export function UsageCard({ service }: UsageCardProps) {
  const { projects } = useProjects();
  const project = projects.find(p => p.id === service.projectId);
  
  const usageData = service.usageData || {};
  const currentUsage = usageData.currentUsage || 0;
  const budgetCap = service.budgetCap || 0;
  const usedPercent = usageData.budgetUsedPercent || 0;
  const balance = usageData.balance;
  const daysLeft = usageData.estimatedDaysLeft ?? (balance && usageData.usageToday ? estimateDaysLeft(balance, usageData.usageToday) : null);

  const isCritical = usedPercent >= 80;

  return (
    <Card className={isCritical ? 'border-rose-200 dark:border-rose-800/50 shadow-sm' : ''}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {service.name}
            {isCritical && (
              <Badge variant="destructive" className="h-5 px-1.5 flex gap-1">
                <AlertCircle className="h-3 w-3" />
                Critical
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2 items-center">
            <ProjectBadge project={project} />
            <span className="text-xs text-muted-foreground">{service.category}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <BudgetProgressBar usedPercent={usedPercent} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
            <span>{formatIDR(currentUsage)} used</span>
            <span>{budgetCap > 0 ? formatIDR(budgetCap) : 'No limit'}</span>
          </div>
        </div>

        {(balance !== undefined || daysLeft !== null) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {balance !== undefined && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" />
                  Balance
                </span>
                <span className="font-medium text-sm">{formatIDR(balance)}</span>
              </div>
            )}
            {daysLeft !== null && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Est. Days Left
                </span>
                <span className={`font-medium text-sm ${daysLeft <= 7 ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                  {daysLeft} days
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
