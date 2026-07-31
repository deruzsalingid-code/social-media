'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, Flame, Heart, MessageCircle, Video, GalleryHorizontal, Image as ImageIcon, ArrowUpRight } from 'lucide-react';

const emptyForm = {
  snapshot_date: '',
  followers: '',
  following: '',
  posts: '',
  engagement_rate: '',
  avg_likes: '',
  avg_comments: '',
  notes: '',
};

const PRODUCTION_STATUSES = ['Belum syuting', 'Syuting', 'Editing', 'Siap posting'];
const STATUS_COLORS = {
  'Belum syuting': '#E0DED6',
  Syuting: '#E8127A',
  Editing: '#7B2FF7',
  'Siap posting': '#2FAE64',
};

const FORMAT_ICONS = {
  Reels: Video,
  Carousel: GalleryHorizontal,
  'Single Post': ImageIcon,
};

function buildDonutGradient(counts) {
  const total = counts.reduce((sum, c) => sum + c.value, 0);
  if (total === 0) return '#eee';
  let cumulative = 0;
  const stops = counts.map((c) => {
    const start = (cumulative / total) * 100;
    cumulative += c.value;
    const end = (cumulative / total) * 100;
    return `${c.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

function DashboardContent() {
  const [snapshots, setSnapshots] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [{ data: snapshotData }, { data: contentData }] = await Promise.all([
      supabase.from('growth_snapshots').select('*').order('snapshot_date', { ascending: false }),
      supabase.from('content_items').select('*').order('scheduled_date', { ascending: true }),
    ]);
    setSnapshots(snapshotData || []);
    setContentItems(contentData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('growth_snapshots').insert({
      snapshot_date: form.snapshot_date,
      followers: form.followers ? Number(form.followers) : null,
      following: form.following ? Number(form.following) : null,
      posts: form.posts ? Number(form.posts) : null,
      engagement_rate: form.engagement_rate ? Number(form.engagement_rate) : null,
      avg_likes: form.avg_likes ? Number(form.avg_likes) : null,
      avg_comments: form.avg_comments ? Number(form.avg_comments) : null,
      notes: form.notes || null,
    });
    setForm(emptyForm);
    setSaving(false);
    loadData();
  }

  const latest = snapshots[0];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = contentItems.filter((it) => it.scheduled_date && it.scheduled_date >= today).slice(0, 4);

  const productionCounts = PRODUCTION_STATUSES.map((status) => ({
    label: status,
    value: contentItems.filter((it) => (it.production_status || PRODUCTION_STATUSES[0]) === status).length,
    color: STATUS_COLORS[status],
  }));
  const donutBackground = buildDonutGradient(productionCounts);

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-badge">smartmomvestor</div>
        <h1 className="hero-title">Dashboard growth &amp; produksi</h1>
        <p className="hero-subtitle">Pantau performa akun dan progres konten dalam satu tempat</p>
      </div>

      <div className="stat-grid-v2">
        <div className="stat-card-v2">
          <div className="stat-icon" style={{ background: '#FCE4EC', color: '#E8127A' }}>
            <Users size={18} />
          </div>
          <span className="stat-label">Followers</span>
          <span className="stat-value">{latest?.followers ?? '-'}</span>
        </div>
        <div className="stat-card-v2">
          <div className="stat-icon" style={{ background: '#EAE1F7', color: '#7B2FF7' }}>
            <Flame size={18} />
          </div>
          <span className="stat-label">Engagement rate</span>
          <span className="stat-value">{latest?.engagement_rate ?? '-'}%</span>
        </div>
        <div className="stat-card-v2">
          <div className="stat-icon" style={{ background: '#D9E8FB', color: '#185FA5' }}>
            <Heart size={18} />
          </div>
          <span className="stat-label">Rata-rata likes</span>
          <span className="stat-value">{latest?.avg_likes ?? '-'}</span>
        </div>
        <div className="stat-card-v2">
          <div className="stat-icon" style={{ background: '#E1F3E1', color: '#2FAE64' }}>
            <MessageCircle size={18} />
          </div>
          <span className="stat-label">Rata-rata komentar</span>
          <span className="stat-value">{latest?.avg_comments ?? '-'}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-v2">
          <div className="card-v2-header">
            <h2>Konten mendatang</h2>
            <a href="/calendar" className="icon-link">
              <ArrowUpRight size={16} />
            </a>
          </div>
          {loading ? (
            <p className="muted">Memuat...</p>
          ) : upcoming.length === 0 ? (
            <p className="muted">Nggak ada konten terjadwal. Tambahin di Kalender.</p>
          ) : (
            <div className="task-list">
              {upcoming.map((item) => {
                const Icon = FORMAT_ICONS[item.format] || Video;
                return (
                  <div className="task-item" key={item.id}>
                    <div className="task-icon">
                      <Icon size={16} />
                    </div>
                    <div className="task-item-body">
                      <p className="task-item-title">{item.topic_hook || '(tanpa judul)'}</p>
                      <p className="task-item-meta">
                        {item.scheduled_date} &middot; {item.production_status || 'Belum syuting'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card card-v2">
          <div className="card-v2-header">
            <h2>Status produksi</h2>
          </div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: donutBackground }}>
              <div className="donut-hole">{contentItems.length}</div>
            </div>
            <div className="donut-legend">
              {productionCounts.map((c) => (
                <div className="donut-legend-item" key={c.label}>
                  <span className="donut-dot" style={{ background: c.color }} />
                  {c.label}: {c.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card card-v2">
        <div className="card-v2-header">
          <h2>Tambah snapshot baru</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid-form">
          <label className="form-group">
            <span>Tanggal</span>
            <input
              type="date"
              required
              value={form.snapshot_date}
              onChange={(e) => handleChange('snapshot_date', e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>Followers</span>
            <input type="number" value={form.followers} onChange={(e) => handleChange('followers', e.target.value)} />
          </label>
          <label className="form-group">
            <span>Following</span>
            <input type="number" value={form.following} onChange={(e) => handleChange('following', e.target.value)} />
          </label>
          <label className="form-group">
            <span>Jumlah post</span>
            <input type="number" value={form.posts} onChange={(e) => handleChange('posts', e.target.value)} />
          </label>
          <label className="form-group">
            <span>Engagement rate (%)</span>
            <input
              type="number"
              step="0.01"
              value={form.engagement_rate}
              onChange={(e) => handleChange('engagement_rate', e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>Rata-rata likes</span>
            <input type="number" value={form.avg_likes} onChange={(e) => handleChange('avg_likes', e.target.value)} />
          </label>
          <label className="form-group">
            <span>Rata-rata komentar</span>
            <input
              type="number"
              value={form.avg_comments}
              onChange={(e) => handleChange('avg_comments', e.target.value)}
            />
          </label>
          <label className="form-group form-group-wide">
            <span>Catatan</span>
            <textarea rows="2" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan snapshot'}
          </button>
        </form>
      </div>

      <div className="card card-v2">
        <div className="card-v2-header">
          <h2>Riwayat snapshot</h2>
        </div>
        {loading ? (
          <p className="muted">Memuat...</p>
        ) : snapshots.length === 0 ? (
          <p className="muted">Belum ada data. Tambahin snapshot pertama di atas.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Followers</th>
                <th>ER</th>
                <th>Avg likes</th>
                <th>Avg komentar</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((s) => (
                <tr key={s.id}>
                  <td data-label="Tanggal">{s.snapshot_date}</td>
                  <td data-label="Followers">{s.followers ?? '-'}</td>
                  <td data-label="ER">{s.engagement_rate ?? '-'}%</td>
                  <td data-label="Avg likes">{s.avg_likes ?? '-'}</td>
                  <td data-label="Avg komentar">{s.avg_comments ?? '-'}</td>
                  <td data-label="Catatan">{s.notes ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
