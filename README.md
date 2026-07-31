# smartmomvestor dashboard

Dashboard internal buat kelola konten & growth akun @smartmomvestor. Gantiin file Excel jadi satu sistem yang saling nyambung.

## Halaman

- `/` — Dashboard growth (followers, ER, likes, komentar dari waktu ke waktu)
- `/calendar` — Kalender konten (pilar, gaya, format, breakdown, caption, status)
- `/brand-guide` — Positioning, pilar, tone of voice, warna brand
- `/trending` — Riset topik trending + sumber
- `/competitors` — Data kompetitor

## Setup (tanpa command line)

### 1. Supabase

1. Buka SQL Editor di project Supabase yang udah dibuat (`smartmomvestor-dashboard`)
2. Paste dan Run SQL schema (lihat file `supabase-schema.sql` di project ini)
3. Buka **Settings > API**, catat **Project URL** dan **anon public key**
4. Buka **Authentication > Providers**, pastiin **Email** provider aktif (buat magic link login)

### 2. GitHub

1. Bikin repo baru di GitHub, misal `smartmomvestor-dashboard`
2. Upload semua file di project ini ke repo lewat **Add file > Create new file**, ketik path lengkapnya (misal `app/calendar/page.js`) biar folder-nya otomatis kebuat — satu-satu, jangan drag-and-drop biar hierarki foldernya nggak berantakan
3. Jangan upload folder `node_modules` (nggak ada di project ini) dan `.env.local` (memang sengaja nggak disertain, isi credential)

### 3. Vercel

1. Import repo GitHub tadi di Vercel
2. Di **Environment Variables**, tambahin:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL dari Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key dari Supabase
3. Deploy

### 4. Login pertama kali

1. Buka URL Vercel-nya, masuk ke `/login`
2. Masukin email, klik link yang dikirim ke inbox
3. Otomatis masuk ke Dashboard

## Isi data awal

Setelah login, isi urutan ini biar datanya lengkap:

1. **Brand Guide** — paste positioning statement, pilar, dan warna yang udah kita susun
2. **Trending Topics** — paste 5 topik trending yang udah kita riset
3. **Competitors** — paste 3 kompetitor yang udah kita riset
4. **Kalender** — paste 7 hari konten yang udah kita rancang
5. **Dashboard** — isi snapshot growth pertama begitu data Instagram Insights udah didapet
