# PRD — Third Party Service Monitor

## Overview

Aplikasi web internal untuk memantau status, biaya, dan tanggal renewal seluruh layanan third party yang digunakan oleh tim. Berfungsi sebagai **dashboard terpusat** yang menampilkan informasi real-time (jika API tersedia) atau data yang diperbarui secara manual, dilengkapi sistem pengingat renewal dan ringkasan biaya.

---

## Problem Statement

Tim saat ini tidak memiliki satu tempat terpusat untuk memantau:
- Kapan langganan/domain/layanan akan expired atau perlu diperbarui
- Berapa total biaya yang dikeluarkan per bulan/tahun untuk seluruh third party
- Akun email mana yang digunakan untuk setiap layanan
- Status aktif/tidak aktif dari masing-masing layanan

---

## Goals

1. Menyediakan **satu dashboard** untuk semua layanan third party
2. Memberikan **peringatan dini** sebelum tanggal renewal (7 hari, 30 hari)
3. Menampilkan **ringkasan biaya** per layanan, per kategori, dan total bulanan/tahunan
4. Mendukung **integrasi API** untuk fetch data otomatis (balance, usage, billing)
5. Memungkinkan **penambahan layanan baru** dengan mudah tanpa coding

---

## Non-Goals (Out of Scope v1)

- Pembayaran otomatis ke third party
- Notifikasi email/WhatsApp (v2)
- Multi-user dengan role & permission (v2)
- Mobile app native

---

## Target Users

- Tim internal (admin/finance/developer) yang mengelola langganan layanan digital perusahaan

---

## Daftar Layanan Third Party (Initial Data)

| No | Nama Layanan       | Kategori            | Akun Email                              |
|----|--------------------|---------------------|-----------------------------------------|
| 1  | Niagahoster Domain | Domain & Hosting    | floothink360@gmail.com                  |
| 2  | Webpushr           | Push Notification   | floothink360@gmail.com                  |
| 3  | Mailjet            | Email Marketing     | floothink360@gmail.com                  |
| 4  | Ahrefs             | SEO Tools           | floothink360@gmail.com                  |
| 5  | Semrush            | SEO Tools           | floothink360@gmail.com                  |
| 6  | me-QR Code         | QR & Link Tool      | floothink360@gmail.com                  |
| 7  | Rumahweb           | Domain & Hosting    | idealivejkt@gmail.com / f3brili0@gmail.com |
| 8  | Elastic Email      | Email Marketing     | suzukihyperlocal@gmail.com              |
| 9  | Qiscus WA Notif    | WhatsApp & Notif    | integrated.data.platform@gmail.com      |
| 10 | Adsmedia OTP       | WhatsApp & Notif    | suzukihyperlocal@gmail.com              |
| 11 | Google One Drive   | Cloud Storage       | integrated.data.platform@gmail.com      |
| 12 | Zoom Pro           | Meeting & Collab    | superuser.global@gmail.com              |

> Daftar bersifat dinamis — layanan baru dapat ditambahkan kapan saja melalui UI.

---

## Core Features

### F1 — Dashboard Overview
- Summary card: total layanan, total biaya/bulan, jumlah yang kritis (≤7 hari), jumlah yang perlu perhatian (≤30 hari), jumlah API terhubung
- Status color coding: Merah (kritis), Kuning (perlu perhatian), Hijau (aman)

### F2 — Tabel Layanan
- Kolom: Nama, Kategori, Email, Biaya/Bulan, Tanggal Renewal, Status, API Status
- Filter: berdasarkan status, kategori, pencarian teks
- Aksi: tambah, edit, hapus layanan

### F3 — Sistem Pengingat
- Tab khusus menampilkan daftar layanan diurutkan berdasarkan tanggal renewal terdekat
- Highlight visual untuk layanan yang akan expired ≤7 hari dan ≤30 hari

### F4 — Ringkasan Biaya
- Total biaya bulanan dan tahunan
- Breakdown per kategori dengan persentase
- Bar chart sederhana proporsi biaya

### F5 — Integrasi API (Per Layanan)
- Setiap layanan memiliki field `api_endpoint`, `api_key`, dan `api_status`
- Status API: `manual` | `connected` | `pending`
- Jika connected: data balance/usage ditarik otomatis saat dashboard dibuka
- Jika manual: data diisi oleh user

### F6 — Export
- Export seluruh data ke CSV
- Format: Nama, Kategori, Email, Biaya, Renewal, Status

---

## User Stories

```
Sebagai admin, saya ingin melihat semua layanan third party dalam satu halaman
sehingga saya tidak perlu mengecek satu per satu.

Sebagai finance, saya ingin melihat total biaya per bulan dan per kategori
sehingga saya bisa membuat laporan pengeluaran.

Sebagai developer, saya ingin menambahkan layanan baru dengan mudah
sehingga daftar layanan selalu up-to-date.

Sebagai admin, saya ingin mendapat peringatan visual ketika ada layanan
yang akan expired dalam 7 hari sehingga saya bisa memperpanjang tepat waktu.
```

---

## Success Metrics

- Semua 12 layanan awal terdaftar dan tampil di dashboard
- User dapat menambah/edit/hapus layanan dalam < 30 detik
- Status renewal terupdate dan peringatan tampil dengan benar
- Export CSV berjalan dan menghasilkan file yang valid