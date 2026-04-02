import { useUsageBasedServices } from '@/hooks/useUsageBasedServices';
import { UsageCard } from '@/components/UsageCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function UsageMonitor() {
  const { services: usageServices } = useUsageBasedServices();
  const [search, setSearch] = useState('');

  const filteredServices = usageServices.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usage Monitor</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Pantau penggunaan layanan dengan budget cap (Usage-Based & Hybrid)
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Sync All
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari layanan usage-based..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">Tidak ada layanan usage-based yang ditemukan.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => (
            <UsageCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
