# Project.md — CeritaKita (rencana proyek terperinci)

> Dokumen perencanaan produk untuk aplikasi berbasis cerita interaktif dan ruang berbagi yang fokus pada isu-isu psikologis remaja (bullying, kesehatan mental, konsep diri). Aplikasi ini memiliki dua peran utama yaitu **Siswa** dan **Guru**.

---

## 1 — Ringkasan Produk

Aplikasi ini merupakan ruang aman bagi remaja (siswa) untuk mengekspresikan diri, membaca, dan belajar melalui cerita interaktif, curhatan anonim, serta konten edukatif. Guru berperan sebagai pembimbing yang mengawasi, memberikan tanggapan, serta menyediakan materi pembelajaran atau refleksi. Fitur utama meliputi:

* Koleksi **cerita statis dan interaktif**.
* **Curhat anonim** dengan reaksi positif (Peluk Virtual, Aku Mengerti, Semangat).
* **Konten edukasi** berupa artikel, infografis, dan video singkat.
* **Jurnal harian** atau mood-tracker untuk membantu pengguna memantau keseharian.

Tujuan utama aplikasi adalah meningkatkan kesadaran dan empati terhadap isu psikologis remaja, serta membangun komunitas yang suportif dan sehat secara emosional antara siswa dan guru.

---

## 2 — Prinsip Desain Visual & UX

* **Warna utama:** Putih (background) dan hitam (teks/ikonografi) untuk kesan modern, bersih, dan kontras tinggi.
* **Tipografi:** Sans-serif modern dengan ukuran responsif (base 16px).
* **Layout:** Spasi lebar, minimalis, fokus pada konten teks dan ilustrasi sederhana.
* **Komponen inti:** Header sederhana, kartu cerita, drawer navigasi, dan tombol aksi di bagian bawah untuk membuat cerita atau jurnal.
* **Aksesibilitas:** Kontras tinggi (WCAG AA), dukungan keyboard navigation, dan atribut ARIA.
* **Mood visual:** Humanis, hangat, dan minimal dengan ilustrasi monokrom atau garis sederhana.

---

## 3 — Persona & User Flow

### 1. Siswa

* Membaca cerita dan refleksi.
* Menulis curhat anonim.
* Memberi reaksi positif.
* Melihat tanggapan atau saran dari guru.

### 2. Guru

* Mengunggah cerita edukatif atau reflektif.
* Memberikan bimbingan, komentar, atau tanggapan.
* Membuat, mengedit, dan menghapus jurnal refleksi.
* Memantau aktivitas siswa dan laporan anonim.

**User Flow:**
Login/Register → Beranda (feed cerita & topik) → Baca / Buat Cerita → Interaksi (reaksi, komentar, simpan) → Profil / Jurnal.

---

## 4 — Arsitektur & Teknologi

* **Frontend:** Next.js 15 (App Router, Server Components, React Hooks).
* **Styling:** Tailwind CSS.
* **Backend:** Seluruh fungsi backend dikembangkan menggunakan **Serverless API Routes** dari Next.js agar dapat dideploy langsung di **Vercel** tanpa server tambahan.
* **Database & Storage:** Supabase digunakan untuk **database utama dan storage bucket media** (gambar, file). Tidak digunakan untuk autentikasi.
* **Auth:** Custom authentication berbasis JWT (disimpan di cookie HttpOnly) dengan role-based access (Siswa & Guru).
* **Deployment:** Vercel (full serverless stack).

**Struktur Dasar Folder**

```
/ (root)
├─ app/
│  ├─ (auth)/login, register
│  ├─ (dashboard)/layout.tsx  ← DashboardLayout
│  ├─ (dashboard)/beranda/page.tsx
│  ├─ (story)/[slug]/page.tsx
│  ├─ api/
│  │  ├─ stories/[id]/route.ts        ← Serverless CRUD cerita
│  │  ├─ journals/[id]/route.ts       ← Serverless CRUD jurnal
│  │  ├─ auth/login/route.ts          ← Serverless login JWT
│  │  ├─ auth/register/route.ts       ← Serverless register JWT
│  │  └─ user/role/route.ts           ← Serverless role handler
├─ components/
│  ├─ sidebar.tsx
│  ├─ header.tsx
│  ├─ avatar-dropdown.tsx
├─ lib/
├─ styles/
├─ prisma/schema.prisma
```

---

## 5 — Fitur Utama (Serverless CRUD + Auth + Layout Dashboard)

### CRUD Cerita (Sama untuk Semua Role):

* Create: pengguna menulis cerita (judul, isi, tag, privasi).
* Read: menampilkan cerita berdasarkan popularitas / terbaru.
* Update: penulis dapat mengedit cerita sendiri.
* Delete: penulis atau admin/guru dapat menghapus cerita.
* Semua endpoint dijalankan melalui **Serverless API (Vercel Functions)** agar skalabel dan efisien.

### CRUD Jurnal (Khusus Guru):

* Create: guru menulis jurnal reflektif atau pembelajaran.
* Read: siswa dapat membaca jurnal guru yang diizinkan publik.
* Update: guru dapat memperbarui jurnalnya.
* Delete: guru dapat menghapus jurnal miliknya.
* Implementasi penuh berbasis **Serverless API** untuk integrasi mulus dengan Supabase.

### Custom Auth (Role-Based Serverless):

* Registrasi dengan email & role (Siswa / Guru).
* Login via JWT + cookie HttpOnly.
* Middleware proteksi untuk route privat sesuai role.
* Setelah login, pengguna diarahkan ke **halaman Beranda** dalam layout dashboard.
* Semua proses autentikasi dilakukan lewat **Serverless API routes**.

### Dashboard Layout:

* **`DashboardLayout`** membungkus seluruh halaman setelah login.
* Terdiri dari dua komponen utama:

  * **Sidebar:** menampilkan menu berbeda berdasarkan role pengguna.

    * **Siswa:** Beranda, Cerita, Jurnal, Profil.
    * **Guru:** Beranda, Cerita, Jurnal (CRUD), Monitoring, Pengaturan.
  * **Header:** berisi ikon **lonceng (Lucide React)** untuk notifikasi, serta **avatar pengguna** dengan nama dan email yang **clickable**.

    * Klik avatar menampilkan dropdown (menggunakan **shadcn/ui**) berisi menu:

      * Pengaturan Akun
      * Keluar

### Endpoint API (Semua Serverless)

```ts
POST /api/auth/register      // register user dengan role
POST /api/auth/login         // login & JWT
GET /api/stories             // ambil daftar cerita
POST /api/stories            // tambah cerita
PUT /api/stories/:id         // update cerita
DELETE /api/stories/:id      // hapus cerita
GET /api/journals            // ambil jurnal (guru)
POST /api/journals           // tambah jurnal (guru)
PUT /api/journals/:id        // update jurnal (guru)
DELETE /api/journals/:id     // hapus jurnal (guru)
GET /api/user/role           // ambil role user
```

---

## 6 — Modul Tambahan

* **Mood Tracker:** log harian (senang, sedih, stres, tenang).
* **Notifikasi & Reminder:** dukungan push notification (via OneSignal atau Vercel Edge Middleware).
* **Moderasi otomatis:** NLP sederhana untuk mendeteksi kata berpotensi berbahaya.
* **Dark Mode opsional:** masih berbasis putih-hitam (toggle sederhana).

---

## 7 — Rencana Pengembangan

| Tahap | Fokus                                          | Output                               |
| ----- | ---------------------------------------------- | ------------------------------------ |
| 1     | Setup Next.js + Tailwind + Supabase DB         | Struktur dasar, koneksi DB           |
| 2     | Implementasi Auth (register/login dengan role) | Sistem login custom JWT + role-based |
| 3     | Dashboard Layout (Sidebar + Header + Dropdown) | Navigasi utama setelah login         |
| 4     | CRUD Cerita (Serverless)                       | API dan UI dasar cerita              |
| 5     | CRUD Jurnal (Serverless untuk Guru)            | Modul tambahan untuk guru            |
| 6     | Integrasi Mood Tracker                         | Komponen jurnal harian               |
| 7     | Sistem Moderasi                                | Validasi & filtering konten          |
| 8     | Dashboard Guru                                 | Monitoring & laporan siswa           |
| 9     | Finalisasi UI                                  | Desain modern putih-hitam            |
| 10    | Deployment & Testing di Vercel                 | Launch versi produksi                |

---

## 8 — Evaluasi & Target

* **Target Pengguna:** Siswa dan Guru di lingkungan pendidikan menengah.
* **Indikator Keberhasilan:**

  * > 500 siswa aktif bulan pertama.
  * Partisipasi guru minimal 50% dari jumlah kelas terdaftar.
  * > 70% engagement rate pada konten reflektif.
  * Minimal 100 unggahan cerita dan curhat dalam 1 bulan pertama.

---

## 9 — Kesimpulan

CeritaKita dikembangkan dengan pendekatan modern (Next.js + Serverless) sepenuhnya kompatibel dengan **Vercel deployment**. Seluruh fungsi backend menggunakan **Serverless API routes**, terhubung langsung dengan **Supabase** sebagai database dan storage bucket utama. Sistem autentikasi dikelola dengan JWT dan **role-based (Siswa & Guru)**. Sidebar menampilkan menu berbeda sesuai peran, dengan CRUD cerita untuk semua pengguna dan CRUD jurnal khusus guru. Setelah login, pengguna diarahkan ke halaman **Beranda** dalam layout dashboard dengan sidebar dan header interaktif (ikon lonceng & avatar dropdown).
