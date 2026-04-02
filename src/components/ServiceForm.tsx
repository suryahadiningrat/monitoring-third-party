/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
  Service,
  ServiceCategory,
  BillingCycle,
  BillingType,
  ApiStatus,
} from '@/types';
import { useProjects } from '@/hooks/useProjects';

export interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Partial<Service>) => void;
  initialData?: Service;
}

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

export function ServiceForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: ServiceFormProps) {
  const { projects } = useProjects();
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [billingType, setBillingType] = useState<BillingType>('subscription');
  const [budgetCap, setBudgetCap] = useState<number | ''>('');
  const [currentUsage, setCurrentUsage] = useState<number | ''>('');
  const [balance, setBalance] = useState<number | ''>('');
  const [category, setCategory] = useState<ServiceCategory>('Lainnya');
  const [email, setEmail] = useState('');
  const [costPerMonth, setCostPerMonth] = useState<number | ''>('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [apiStatus, setApiStatus] = useState<ApiStatus>('manual');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setProjectId(initialData.projectId || '');
        setBillingType(initialData.billingType || 'subscription');
        setBudgetCap(initialData.budgetCap ?? '');
        setCurrentUsage(initialData.usageData?.currentUsage ?? '');
        setBalance(initialData.usageData?.balance ?? '');
        setCategory(initialData.category);
        setEmail(initialData.accounts[0]?.email || '');
        setCostPerMonth(initialData.costPerMonth);
        setBillingCycle(initialData.billingCycle);
        setRenewalDate(
          initialData.renewalDate ? initialData.renewalDate.split('T')[0] : ''
        );
        setApiStatus(initialData.apiConfig.status);
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setProjectId('');
        setBillingType('subscription');
        setBudgetCap('');
        setCurrentUsage('');
        setBalance('');
        setCategory('Domain & Hosting');
        setEmail('');
        setCostPerMonth('');
        setBillingCycle('monthly');
        setRenewalDate('');
        setApiStatus('manual');
        setNotes('');
      }
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = 'Email tidak valid';
    if (costPerMonth === '' || costPerMonth < 0)
      newErrors.costPerMonth = 'Biaya per bulan tidak valid';
    if (!renewalDate) newErrors.renewalDate = 'Tanggal renewal wajib diisi';

    if (!projectId) newErrors.projectId = 'Project wajib dipilih';
    if (billingType === 'usage-based' && budgetCap === '') newErrors.budgetCap = 'Batas budget wajib diisi untuk layanan usage-based';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name,
      projectId,
      billingType,
      budgetCap: budgetCap === '' ? undefined : Number(budgetCap),
      usageData: {
        ...(initialData?.usageData || {}),
        currentUsage: currentUsage === '' ? undefined : Number(currentUsage),
        balance: balance === '' ? undefined : Number(balance),
      },
      category,
      accounts: [{ email, label: 'Primary' }],
      costPerMonth: Number(costPerMonth),
      billingCycle,
      renewalDate,
      apiConfig: {
        ...(initialData?.apiConfig || {}),
        status: apiStatus,
      },
      notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Layanan' : 'Tambah Layanan Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Layanan *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Niagahoster Domain"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project *</Label>
              <Select
                value={projectId}
                onValueChange={(val) => setProjectId(val || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-xs text-red-500">{errors.projectId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingType">Tipe Tagihan *</Label>
              <Select
                value={billingType}
                onValueChange={(val) => setBillingType(val as BillingType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="usage-based">Usage-Based</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as ServiceCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Utama *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPerMonth">Biaya per Siklus (IDR) *</Label>
              <Input
                id="costPerMonth"
                type="number"
                min="0"
                value={costPerMonth}
                onChange={(e) => setCostPerMonth(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
              />
              {errors.costPerMonth && (
                <p className="text-xs text-red-500">{errors.costPerMonth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCycle">Siklus Tagihan *</Label>
              <Select
                value={billingCycle}
                onValueChange={(val) => setBillingCycle(val as BillingCycle)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="quarterly">Kuartalan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                  <SelectItem value="biannual">6 Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(billingType === 'usage-based' || billingType === 'hybrid') && (
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="budgetCap" className="text-xs">Budget Cap (IDR) *</Label>
                <Input
                  id="budgetCap"
                  type="number"
                  min="0"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                />
                {errors.budgetCap && (
                  <p className="text-xs text-red-500">{errors.budgetCap}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentUsage" className="text-xs">Current Usage (IDR)</Label>
                <Input
                  id="currentUsage"
                  type="number"
                  min="0"
                  value={currentUsage}
                  onChange={(e) => setCurrentUsage(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance" className="text-xs">Sisa Balance (IDR)</Label>
                <Input
                  id="balance"
                  type="number"
                  min="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renewalDate">Tanggal Renewal *</Label>
              <Input
                id="renewalDate"
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
              />
              {errors.renewalDate && (
                <p className="text-xs text-red-500">{errors.renewalDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiStatus">Status API *</Label>
              <Select
                value={apiStatus}
                onValueChange={(val) => setApiStatus(val as ApiStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan jika ada..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
