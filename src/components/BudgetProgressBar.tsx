import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getBudgetStatus } from '@/utils/budget.utils';

interface BudgetProgressBarProps {
  usedPercent: number;
  className?: string;
  showLabel?: boolean;
}

export function BudgetProgressBar({ usedPercent, className, showLabel = true }: BudgetProgressBarProps) {
  // Clamp percent between 0 and 100
  const clampedPercent = Math.min(Math.max(usedPercent, 0), 100);
  
  // Use existing util to determine color/status
  const status = getBudgetStatus(clampedPercent);
  
  let colorClass = 'bg-emerald-500';
  if (status === 'warn') colorClass = 'bg-amber-500';
  if (status === 'danger') colorClass = 'bg-rose-500';

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground font-medium">Usage</span>
          <span className={cn("font-semibold", 
            status === 'danger' ? 'text-rose-600 dark:text-rose-400' :
            status === 'warn' ? 'text-amber-600 dark:text-amber-400' :
            'text-emerald-600 dark:text-emerald-400'
          )}>
            {usedPercent.toFixed(1)}%
          </span>
        </div>
      )}
      <Progress 
        value={clampedPercent} 
        indicatorClassName={colorClass}
        className="h-2" 
      />
    </div>
  );
}
