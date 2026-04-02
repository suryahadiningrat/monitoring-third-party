# PRD — Third Party Service Monitor

## Overview

Aplikasi web internal untuk memantau status, biaya, dan tanggal renewal seluruh layanan third party yang digunakan perusahaan lintas project/client. Berfungsi sebagai **financial control center** yang mencegah pembengkakan biaya usage-based (seperti insiden GCP Rp 98jt), memberikan peringatan renewal, dan mengirim notifikasi WhatsApp otomatis ke Project Manager & Tech Lead ketika biaya mendekati atau melampaui budget cap.

---

## Latar Belakang & Problem Statement

Perusahaan mengalami insiden di mana **Google Cloud API (Geocode) menghabiskan Rp 98 juta** dalam satu bulan tanpa ada yang menyadari. Ini terjadi karena:

1. Tidak ada sistem monitoring terpusat untuk biaya third party
2. Tidak ada budget cap & alert otomatis per layanan per project
3. Layanan yang sama digunakan di 10+ project dengan akun berbeda — tidak ada visibility total
4. Campuran billing model: subscription tetap + usage-based (credit/balance habis pakai)

---

## Goals

1. **Satu dashboard** untuk semua layanan third party lintas project
2. **Budget cap per layanan per project** — jika terlampaui, kirim alert WhatsApp
3. **Pantau usage-based billing** secara real-time (GCP, Qiscus balance, Adsmedia OTP)
4. **Peringatan renewal** sebelum expired (7 hari, 30 hari)
5. **Ringkasan biaya** per layanan, per kategori, per project, total bulanan/tahunan
6. **Notifikasi WhatsApp** ke PM & Tech Lead via Qiscus WA API

---

## Non-Goals (Out of Scope v1)

- Pembayaran otomatis ke third party
- Multi-user login dengan role & permission (v2)
- Mobile app native
- BigQuery export / data warehouse integration

---

## Target Users

- **Admin/Finance**: monitoring total pengeluaran, approval budget
- **Project Manager**: menerima alert jika biaya project melampaui cap
- **Tech Lead**: menerima alert teknis, troubleshooting jika ada lonjakan usage

---

## Model Billing (Dua Tipe Berbeda)

### Tipe 1: Subscription Tetap
Biaya tetap per periode, yang penting adalah tanggal renewal.

| Layanan | Billing | Yang Dipantau |
|---------|---------|---------------|
| Niagahoster Domain | Yearly | Tanggal renewal |
| Rumahweb | Yearly | Tanggal renewal |
| Webpushr | Monthly | Tanggal renewal |
| Mailjet | Monthly | Tanggal renewal |
| Ahrefs | Monthly | Tanggal renewal |
| Semrush | Monthly | Tanggal renewal |
| me-QR Code | Yearly | Tanggal renewal |
| Zoom Pro | Yearly | Tanggal renewal |
| Google One Drive | Monthly | Tanggal renewal |
| Qiscus (subscription) | 6-bulanan | Tanggal renewal subscription |

### Tipe 2: Usage-Based / Balance (KRITIS — potensi jebol)
Biaya tergantung penggunaan, bisa melonjak tak terduga.

| Layanan | Model | Yang Dipantau | Risiko |
|---------|-------|---------------|--------|
| **Google Cloud (GCP)** | Auto-charge credit card | Cost bulan ini vs budget cap | ⚠️ TINGGI — kasus Rp 98jt |
| **Qiscus WA Balance** | Balance habis pakai per message | Sisa balance, estimasi habis | ⚠️ SEDANG |
| **Adsmedia OTP** | Balance habis pakai per OTP | Sisa balance, usage/hari | ⚠️ SEDANG |

---

## Struktur Data: Multi-Project

Perusahaan memiliki 10+ project/client. Layanan yang sama bisa dipakai di project berbeda dengan akun berbeda.

```
Project: Suzuki Hyperlocal
├── Google Cloud  → budget cap: Rp 5jt/bln, usage bulan ini: Rp 3.2jt
├── Qiscus WA    → balance: Rp 800rb, usage hari ini: 1.200 message
└── Adsmedia OTP → balance: Rp 200rb, usage hari ini: 340 OTP

Project: IDP (Integrated Data Platform)
├── Google Cloud → budget cap: Rp 2jt/bln, usage: Rp 1.8jt ⚠️ 90%
└── Qiscus WA   → balance: Rp 500rb

Project: Floothink
├── Niagahoster  → renewal: Des 2026
├── Ahrefs       → renewal: Mei 2026
└── Semrush      → renewal: Mei 2026
```

---

## Core Features

### F1 — Dashboard Overview
- Summary cards: total layanan, total biaya/bulan, kritis renewal, usage-based alert, total project
- Alert banner merah jika ada layanan usage-based ≥80% budget cap
- Quick access ke layanan bermasalah

### F2 — Manajemen Project
- CRUD project: nama, deskripsi, PM (nama + nomor WA), Tech Lead (nama + nomor WA)
- Setiap layanan terikat ke satu project
- View per project: semua layanan + total biaya project

### F3 — Manajemen Layanan
- CRUD layanan dengan billingType: `subscription` | `usage-based` | `hybrid`
- Subscription: renewal date, biaya tetap/bulan
- Usage-based: budget cap, current usage (manual input atau dari API), sisa balance
- Filter: per project, per kategori, per billing type, per status
- Export CSV

### F4 — Budget Cap & Alert
- Set budget cap per layanan (IDR/bulan)
- Threshold: 50% (info), 80% (warning), 100% (kritis)
- Riwayat alert yang pernah terkirim
- Tombol "Test Alert" untuk verifikasi konfigurasi WA

### F5 — Notifikasi WhatsApp (via Qiscus WA API)
- Template pesan alert yang bisa dikustomisasi
- Kirim ke PM + Tech Lead per project
- Log pengiriman: timestamp, penerima, status (delivered/failed)

### F6 — Monitoring Usage-Based
- GCP: progress bar cost vs budget cap, last sync timestamp
- Qiscus Balance: sisa balance, estimasi habis N hari
- Adsmedia: sisa balance, usage hari ini vs rata-rata
- Refresh manual + auto-refresh setiap 1 jam (jika API connected)

### F7 — Pengingat Renewal
- List diurutkan by renewal terdekat
- Filter: Kritis / Perlu Perhatian / Aman

### F8 — Ringkasan Biaya
- Total bulanan & tahunan
- Breakdown per project, per kategori
- Bar chart distribusi

---

## Daftar Layanan Awal

| No | Nama | Kategori | Billing Type | Akun |
|----|------|---------|-------------|------|
| 1 | Niagahoster Domain | Domain & Hosting | Subscription | floothink360@gmail.com |
| 2 | Webpushr | Push Notification | Subscription | floothink360@gmail.com |
| 3 | Mailjet | Email Marketing | Subscription | floothink360@gmail.com |
| 4 | Ahrefs | SEO Tools | Subscription | floothink360@gmail.com |
| 5 | Semrush | SEO Tools | Subscription | floothink360@gmail.com |
| 6 | me-QR Code | QR & Link Tool | Subscription | floothink360@gmail.com |
| 7 | Rumahweb | Domain & Hosting | Subscription | idealivejkt@gmail.com |
| 8 | Elastic Email | Email Marketing | Subscription | suzukihyperlocal@gmail.com |
| 9 | Qiscus WA Notif | WhatsApp & Notif | Hybrid ⚠️ | integrated.data.platform@gmail.com |
| 10 | Adsmedia OTP | WhatsApp & Notif | Usage-Based ⚠️ | suzukihyperlocal@gmail.com |
| 11 | Google One Drive | Cloud Storage | Subscription | integrated.data.platform@gmail.com |
| 12 | Zoom Pro | Meeting & Collab | Subscription | superuser.global@gmail.com |
| 13 | Google Cloud (GCP) | Cloud Infrastructure | Usage-Based ⚠️ | per project |

---

## Roadmap

### v1 — MVP (Sudah Selesai)
- Dashboard overview ✅
- Manajemen layanan CRUD ✅
- Pengingat renewal ✅
- Ringkasan biaya ✅

### v1.5 — Multi-Project + Budget Cap (Next)
- Struktur multi-project dengan PM & Tech Lead per project
- Field `billingType` di setiap layanan
- Budget cap + progress bar usage
- Input manual usage-based (sementara sebelum API)
- UI alert threshold

### v2 — Notifikasi & API Integration
- Notifikasi WhatsApp via Qiscus WA API
- GCP Billing API integration (Cloud Billing API + Service Account)
- Qiscus balance API integration
- Alert log & history

### v3 — Advanced
- Multi-user login (PM / Tech Lead / Finance / Admin)
- Dashboard per project (isolated view)
- Prediksi cost bulan depan
- BigQuery export

---

## Success Metrics

- Tidak ada lagi insiden biaya melonjak tanpa notifikasi
- PM & Tech Lead menerima WA alert dalam <5 menit setelah threshold tercapai
- Semua layanan dari semua project terdaftar dalam satu dashboard
- Total biaya per project terlihat jelas