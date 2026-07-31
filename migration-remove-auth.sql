-- Migration: buka akses RLS jadi publik (tanpa login sama sekali)
-- PERINGATAN: setelah ini dijalankan, SIAPAPUN yang punya anon key
-- (yang udah ada di kode frontend, publik) bisa baca, ubah, dan hapus
-- semua data di 5 tabel ini tanpa autentikasi apapun.

drop policy if exists "allow authenticated full access" on brand_profile;
drop policy if exists "allow authenticated full access" on growth_snapshots;
drop policy if exists "allow authenticated full access" on content_items;
drop policy if exists "allow authenticated full access" on trending_topics;
drop policy if exists "allow authenticated full access" on competitors;

create policy "allow public full access" on brand_profile for all using (true) with check (true);
create policy "allow public full access" on growth_snapshots for all using (true) with check (true);
create policy "allow public full access" on content_items for all using (true) with check (true);
create policy "allow public full access" on trending_topics for all using (true) with check (true);
create policy "allow public full access" on competitors for all using (true) with check (true);
