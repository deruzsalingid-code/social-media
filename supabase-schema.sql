-- Brand profile (satu baris aja, isinya identitas brand)
create table brand_profile (
  id uuid primary key default gen_random_uuid(),
  positioning_statement text,
  pillars jsonb, -- [{name, percentage, description}]
  color_palette jsonb, -- {primary, secondary, background}
  tone_notes text,
  updated_at timestamptz default now()
);

-- Growth snapshot (isi manual tiap kali cek Insights)
create table growth_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  followers int,
  following int,
  posts int,
  engagement_rate numeric(5,2),
  avg_likes int,
  avg_comments int,
  notes text,
  created_at timestamptz default now()
);

-- Content calendar
create table content_items (
  id uuid primary key default gen_random_uuid(),
  scheduled_date date,
  pillar text not null,
  content_style text, -- Edukasi / Journey / Proof
  format text, -- Carousel / Reels / Single Post
  topic_hook text,
  breakdown text, -- slide-by-slide atau script breakdown
  caption text,
  hashtags text,
  status text default 'draft', -- draft / scheduled / posted
  created_at timestamptz default now()
);

-- Trending topics
create table trending_topics (
  id uuid primary key default gen_random_uuid(),
  pillar text,
  insight text,
  source_url text,
  used_in_content_id uuid references content_items(id),
  created_at timestamptz default now()
);

-- Kompetitor
create table competitors (
  id uuid primary key default gen_random_uuid(),
  name text,
  focus text,
  notes text,
  created_at timestamptz default now()
);

-- RLS (internal tool, tapi tetap wajib aktifin buat keamanan dasar)
alter table brand_profile enable row level security;
alter table growth_snapshots enable row level security;
alter table content_items enable row level security;
alter table trending_topics enable row level security;
alter table competitors enable row level security;

create policy "allow authenticated full access" on brand_profile for all using (auth.role() = 'authenticated');
create policy "allow authenticated full access" on growth_snapshots for all using (auth.role() = 'authenticated');
create policy "allow authenticated full access" on content_items for all using (auth.role() = 'authenticated');
create policy "allow authenticated full access" on trending_topics for all using (auth.role() = 'authenticated');
create policy "allow authenticated full access" on competitors for all using (auth.role() = 'authenticated');
