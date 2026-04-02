import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string; // Optional class for the value text color
}

export function StatCard({ label, value, sub, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color || ''}`}>{value}</div>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1">
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
