# Prompts — Third Party Service Monitor

## Deskripsi Project (untuk context agent)

Kamu adalah agent yang membangun aplikasi web internal bernama **Third Party Service Monitor**.  
Aplikasi ini digunakan oleh tim internal untuk memantau status, biaya, dan tanggal renewal dari seluruh layanan third party yang digunakan perusahaan.

Stack yang digunakan: **React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + TanStack Query**.  
Penyimpanan data: **localStorage + JSON lokal** (tidak ada database server).  
Referensi lengkap ada di: `prd.md`, `stack.md`, `database.md`, `checklist.md`, `api-adapters.md`.

---

## Aturan Umum untuk Agent

1. **Selalu gunakan TypeScript** — tidak boleh ada `any` kecuali terpaksa, gunakan type dari `src/types/index.ts`
2. **Ikuti struktur folder** yang sudah didefinisikan di `stack.md`
3. **Gunakan shadcn/ui** untuk komponen UI dasar, jangan buat komponen form/button dari scratch
4. **Tailwind CSS only** untuk styling, tidak ada inline style atau CSS module
5. **Setiap komponen harus memiliki props yang di-type** secara eksplisit
6. **Gunakan `date-fns`** untuk semua operasi tanggal, bukan `new Date()` langsung
7. **Format IDR** menggunakan `Intl.NumberFormat` atau fungsi `formatIDR()` dari `currency.utils.ts`
8. **Jangan hardcode data** — semua data layanan diambil dari store, bukan dari komponen

---

## Prompt Spesifik Per Task

### Membuat Types
```
Buat file src/types/index.ts berdasarkan interface di database.md.
Pastikan semua type di-export dan menggunakan TypeScript strict.
Jangan tambahkan field yang tidak ada di schema.
```

### Membuat Store
```
Buat Zustand store di src/store/services.store.ts.
Store harus persist ke localStorage menggunakan zustand middleware persist.
Implementasikan actions: loadServices, addService, updateService, deleteService (soft delete dengan isActive: false).
Seed data awal (12 layanan) dari database.md jika localStorage kosong.
```

### Membuat Komponen ServiceTable
```
Buat komponen ServiceTable.tsx yang:
- Menerima props: services: ServiceWithStatus[]
- Render tabel dengan kolom: Nama (dengan inisial badge), Kategori, Email, Biaya/Bulan, Renewal + daysUntilRenewal, Status badge, tombol Edit
- Setiap baris bisa di-klik untuk edit
- Tampilkan empty state jika services kosong
- Gunakan Tailwind untuk styling, tidak ada CSS custom
- Format biaya dengan formatIDR(), tampilkan "Gratis" jika 0
- Format tanggal dengan date-fns format('d MMM yyyy', ...) locale id
```

### Membuat ServiceForm
```
Buat ServiceForm.tsx sebagai Dialog (gunakan shadcn Dialog).
Form fields sesuai interface Service di types/index.ts:
- name: text input, required
- category: select dropdown, pilihan dari type ServiceCategory
- accounts[0].email: email input, required
- costPerMonth: number input, min 0
- billingCycle: select (monthly/quarterly/yearly)
- renewalDate: date input
- apiConfig.status: select (manual/connected/pending)
- notes: textarea, optional
Validasi semua required field sebelum submit.
Prop onSubmit(service: Partial<Service>) dipanggil saat form valid.
Mode add dan edit (jika prop initialData tersedia, pre-fill form).
```

### Membuat halaman Dashboard
```
Buat Dashboard.tsx yang menampilkan:
1. Grid 5 StatCard (total layanan, biaya/bulan, kritis, perlu perhatian, API connected)
2. Section "Renewal Terdekat" — 5 item pertama dari useReminders()
3. Tombol "+ Tambah Layanan" yang buka ServiceForm dialog
Gunakan useDashboardStats() dan useReminders() hooks.
Layout: 2 kolom di desktop, 1 kolom di mobile.
```

### Membuat API Adapter
```
Implementasikan adapter untuk [NAMA_LAYANAN] di src/adapters/[nama-file].ts.
Ikuti interface ServiceAdapter dari src/adapters/base.adapter.ts.
Fungsi fetchStatus(config: AdapterConfig): Promise<AdapterResult>.
Handle error dengan try-catch, return success: false dengan error message.
Lihat contoh implementasi di api-adapters.md.
API key diambil dari config parameter, bukan dari import langsung.
```

### Membuat Export CSV
```
Buat fungsi exportToCSV(services: Service[]) di src/utils/export.utils.ts.
Header kolom: Nama,Kategori,Email Utama,Biaya per Bulan (IDR),Tanggal Renewal,Siklus,Status API,Catatan
Konversi renewalDate ke format dd/MM/yyyy.
costPerMonth dalam angka saja (tanpa "Rp").
Trigger download file browser dengan nama: third-party-monitor-[tanggal].csv
```

### Debugging / Fix
```
Cek error ini dan perbaiki sesuai TypeScript strict mode.
Jangan ubah logic bisnis atau interface yang sudah ada.
Hanya perbaiki yang error, jangan refactor hal lain.
```

---

## Konvensi Penamaan

| Tipe | Konvensi | Contoh |
|------|----------|--------|
| Komponen React | PascalCase | `ServiceTable.tsx` |
| Hooks | camelCase dengan prefix `use` | `useServices.ts` |
| Utils | camelCase dengan suffix tipe | `date.utils.ts` |
| Adapters | kebab-case | `elastic-email.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS class | Tailwind utility classes saja | - |
| Props interface | `[ComponentName]Props` | `ServiceTableProps` |

---

## Data Layanan Awal (Quick Reference)

```typescript
// 12 layanan yang harus ada sebagai seed data
const INITIAL_SERVICES = [
  { name: 'Niagahoster Domain',     email: 'floothink360@gmail.com',              cost: 150000,  cycle: 'yearly',   apiStatus: 'manual'  },
  { name: 'Webpushr Push Notif',    email: 'floothink360@gmail.com',              cost: 0,       cycle: 'monthly',  apiStatus: 'pending' },
  { name: 'Mailjet Email Marketing',email: 'floothink360@gmail.com',              cost: 200000,  cycle: 'monthly',  apiStatus: 'pending' },
  { name: 'Ahrefs',                 email: 'floothink360@gmail.com',              cost: 1500000, cycle: 'monthly',  apiStatus: 'manual'  },
  { name: 'Semrush',                email: 'floothink360@gmail.com',              cost: 1800000, cycle: 'monthly',  apiStatus: 'manual'  },
  { name: 'me-QR Code',             email: 'floothink360@gmail.com',              cost: 50000,   cycle: 'yearly',   apiStatus: 'manual'  },
  { name: 'Rumahweb',               email: 'idealivejkt@gmail.com',               cost: 300000,  cycle: 'yearly',   apiStatus: 'manual'  },
  { name: 'Elastic Email',          email: 'suzukihyperlocal@gmail.com',          cost: 80000,   cycle: 'monthly',  apiStatus: 'pending' },
  { name: 'Qiscus WA Notif',        email: 'integrated.data.platform@gmail.com', cost: 500000,  cycle: 'monthly',  apiStatus: 'pending' },
  { name: 'Adsmedia OTP',           email: 'suzukihyperlocal@gmail.com',          cost: 200000,  cycle: 'monthly',  apiStatus: 'manual'  },
  { name: 'Google One Drive',       email: 'integrated.data.platform@gmail.com', cost: 130000,  cycle: 'monthly',  apiStatus: 'manual'  },
  { name: 'Zoom Pro',               email: 'superuser.global@gmail.com',          cost: 350000,  cycle: 'yearly',   apiStatus: 'manual'  },
];
// Catatan Rumahweb: tambahkan sub-account f3brili0@gmail.com di accounts[1]
```