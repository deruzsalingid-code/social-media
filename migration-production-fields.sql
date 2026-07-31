-- Migration: production tracking fields for content_items
-- Jalankan ini di Supabase SQL Editor (tidak perlu drop/recreate tabel yang sudah ada)

alter table content_items add column if not exists production_status text default 'Belum syuting';
alter table content_items add column if not exists production_deadline date;
alter table content_items add column if not exists raw_file_url text;
alter table content_items add column if not exists edited_file_url text;
alter table content_items add column if not exists published_url text;
alter table content_items add column if not exists approval_status text default 'Belum direview';
