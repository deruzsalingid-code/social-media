'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import { supabase } from '../../lib/supabaseClient';

const PILLARS = [
  'Investasi / Crypto',
  'Keuangan Keluarga & Pendidikan Anak',
  'Kehidupan di Singapore',
  'Technology / AI',
];

const STYLES = ['Edukasi', 'Edukasi + Journey', 'Journey / Proteksi', 'Journey (flagship)'];
const FORMATS = ['Carousel', 'Reels', 'Single Post'];
const STATUSES = ['draft', 'scheduled', 'posted'];

const emptyForm = {
  scheduled_date: '',
  pillar: PILLARS[0],
  content_style: STYLES[0],
  format: FORMATS[0],
  topic_hook: '',
  breakdown: '',
  caption: '',
  hashtags: '',
  status: 'draft',
};

function CalendarContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    const { data } = await supabase
      .from('content_items')
      .select('*')
      .order('scheduled_date', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('content_items').insert({
      ...form,
      scheduled_date: form.scheduled_date || null,
    });
    setForm(emptyForm);
    setSaving(false);
    loadItems();
  }

  async function updateStatus(id, status) {
    await supabase.from('content_items').update({ status }).eq('id', id);
    loadItems();
  }

  async function deleteItem(id) {
    await supabase.from('content_items').delete().eq('id', id);
    loadItems();
  }

  return (
    <div>
      <h1>Kalender konten</h1>

      <div className="card">
        <h2>Tambah konten baru</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <label className="form-group">
            <span>Tanggal posting</span>
            <input
              type="date"
              value={form.scheduled_date}
              onChange={(e) => handleChange('scheduled_date', e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>Pilar</span>
            <select value={form.pillar} onChange={(e) => handleChange('pillar', e.target.value)}>
              {PILLARS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="form-group">
            <span>Gaya konten</span>
            <select value={form.content_style} onChange={(e) => handleChange('content_style', e.target.value)}>
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="form-group">
            <span>Format</span>
            <select value={form.format} onChange={(e) => handleChange('format', e.target.value)}>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="form-group form-group-wide">
            <span>Topik / hook</span>
            <input type="text" value={form.topic_hook} onChange={(e) => handleChange('topic_hook', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Breakdown konten (slide/script)</span>
            <textarea rows="4" value={form.breakdown} onChange={(e) => handleChange('breakdown', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Caption</span>
            <textarea rows="3" value={form.caption} onChange={(e) => handleChange('caption', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Hashtag</span>
            <input type="text" value={form.hashtags} onChange={(e) => handleChange('hashtags', e.target.value)} />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan konten'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar konten</h2>
        {loading ? (
          <p className="muted">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="muted">Belum ada konten. Tambahin di atas.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pilar</th>
                <th>Format</th>
                <th>Topik</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.scheduled_date ?? '-'}</td>
                  <td>{item.pillar}</td>
                  <td>{item.format}</td>
                  <td>{item.topic_hook}</td>
                  <td>
                    <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn-danger-text" onClick={() => deleteItem(item.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <AuthGate>
      <CalendarContent />
    </AuthGate>
  );
}
