'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../components/AuthGate';
import { supabase } from '../lib/supabaseClient';

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

function DashboardContent() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadSnapshots() {
    setLoading(true);
    const { data } = await supabase
      .from('growth_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false });
    setSnapshots(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadSnapshots();
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
    loadSnapshots();
  }

  const latest = snapshots[0];

  return (
    <div>
      <h1>Dashboard growth</h1>

      {latest && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Followers</span>
            <span className="stat-value">{latest.followers ?? '-'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Engagement rate</span>
            <span className="stat-value">{latest.engagement_rate ?? '-'}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Rata-rata likes</span>
            <span className="stat-value">{latest.avg_likes ?? '-'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Rata-rata komentar</span>
            <span className="stat-value">{latest.avg_comments ?? '-'}</span>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Tambah snapshot baru</h2>
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

      <div className="card">
        <h2>Riwayat snapshot</h2>
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
                  <td>{s.snapshot_date}</td>
                  <td>{s.followers ?? '-'}</td>
                  <td>{s.engagement_rate ?? '-'}%</td>
                  <td>{s.avg_likes ?? '-'}</td>
                  <td>{s.avg_comments ?? '-'}</td>
                  <td>{s.notes ?? '-'}</td>
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
