import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatIDR } from '@/utils/currency.utils';
import type { CostSummary as CostSummaryType } from '@/types';

export interface CostSummaryProps {
  summary: CostSummaryType;
}

export function CostSummary({ summary }: CostSummaryProps) {
  // Data for chart
  const chartData = summary.byCategory.map((cat) => ({
    name: cat.category,
    amount: cat.monthly,
  }));

  return (
    <div className="space-y-6">
      {/* Total Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Pengeluaran Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatIDR(summary.totalMonthly)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Berdasarkan biaya rata-rata per bulan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran Tahunan (Estimasi)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatIDR(summary.totalYearly)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Berdasarkan 12 bulan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rincian per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Bulanan</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byCategory.map((cat) => (
                  <TableRow key={cat.category}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{cat.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {cat.count} layanan
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(cat.monthly)}
                    </TableCell>
                    <TableCell className="text-right">
                      {cat.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                {summary.byCategory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Belum ada data biaya.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Breakdown Table by Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rincian per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Bulanan</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byProject.map((proj) => (
                  <TableRow key={proj.projectId}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{proj.projectName}</span>
                        <span className="text-xs text-muted-foreground">
                          {proj.count} layanan
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(proj.monthly)}
                    </TableCell>
                    <TableCell className="text-right">
                      {proj.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                {summary.byProject.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Belum ada data project.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Biaya</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={120}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [formatIDR(Number(value)), 'Biaya Bulanan']}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#0f172a"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Tidak ada data grafik.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
