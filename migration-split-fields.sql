-- Migration: pecah field breakdown jadi kolom-kolom terpisah
-- Jalankan di Supabase SQL Editor. Aman, cuma nambah kolom, data lama nggak kehapus.

alter table content_items add column if not exists script_full text;
alter table content_items add column if not exists shot_list text;
alter table content_items add column if not exists wardrobe_notes text;
alter table content_items add column if not exists music_notes text;
alter table content_items add column if not exists editing_notes text;
