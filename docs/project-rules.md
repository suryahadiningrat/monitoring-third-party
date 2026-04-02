# Project Rules — Third Party Service Monitor

## Tentang Project Ini

Aplikasi web internal untuk monitoring status, biaya, dan renewal seluruh layanan third party perusahaan.
Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + TanStack Query.
Data disimpan di localStorage (tidak ada backend/database server).

## File Referensi

Sebelum mengerjakan task apapun, baca file-file berikut sebagai context:

- `prd.md` — requirements lengkap, fitur, dan daftar 12 layanan third party
- `stack.md` — tech stack, struktur folder, dan cara setup project
- `database.md` — TypeScript interfaces, schema JSON, dan seed data
- `api-adapters.md` — implementasi adapter per layanan (Webpushr, Mailjet, Ahrefs, dll)
- `checklist.md` — breakdown task per phase yang harus diselesaikan
- `prompts.md` — prompt spesifik, konvensi penamaan, dan quick reference data

## Aturan Wajib

1. Selalu gunakan TypeScript strict — tidak ada implicit `any`
2. Semua type diambil dari `src/types/index.ts`, jangan definisikan ulang
3. Styling hanya dengan Tailwind CSS utility classes — tidak ada inline style atau CSS module
4. Gunakan shadcn/ui untuk komponen UI (Button, Input, Dialog, Table, Badge, Select, Tabs)
5. Semua operasi tanggal gunakan `date-fns` — bukan `new Date()` raw
6. Format mata uang IDR gunakan fungsi `formatIDR()` dari `src/utils/currency.utils.ts`
7. Data layanan selalu dari Zustand store — tidak boleh hardcode di komponen
8. Setiap komponen baru harus memiliki props interface yang di-type eksplisit
9. Ikuti struktur folder yang didefinisikan di `stack.md`
10. Seed data 12 layanan harus sesuai persis dengan `database.md` dan `prompts.md`

## Prioritas Pengerjaan

Kerjakan sesuai urutan phase di `checklist.md`:
Phase 1 (Setup) → Phase 2 (Data Layer) → Phase 3 (UI Components) → Phase 4 (Pages) → Phase 5 (API) → Phase 6 (QA)

## Hal yang TIDAK Boleh Dilakukan

- Jangan buat backend server — ini pure frontend dengan localStorage
- Jangan gunakan CSS Module atau styled-components
- Jangan hardcode API key di source code — semua dari `.env.local`
- Jangan hapus data layanan secara permanen — gunakan soft delete (`isActive: false`)
- Jangan ubah TypeScript interfaces di `database.md` tanpa alasan yang jelas