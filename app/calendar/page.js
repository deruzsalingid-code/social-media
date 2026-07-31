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
const PRODUCTION_STATUSES = ['Belum syuting', 'Syuting', 'Editing', 'Siap posting'];
const APPROVAL_STATUSES = ['Belum direview', 'Revisi', 'Approved'];

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
  production_status: PRODUCTION_STATUSES[0],
  production_deadline: '',
  raw_file_url: '',
  edited_file_url: '',
  published_url: '',
  approval_status: APPROVAL_STATUSES[0],
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
      production_deadline: form.production_deadline || null,
    });
    setForm(emptyForm);
    setSaving(false);
    loadItems();
  }

  async function updateField(id, field, value) {
    await supabase.from('content_items').update({ [field]: value }).eq('id', id);
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

          <div className="form-group-wide" style={{ borderTop: '1px solid #eee', margin: '8px 0', paddingTop: '12px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px' }}>Production</h3>
          </div>

          <label className="form-group">
            <span>Status produksi</span>
            <select value={form.production_status} onChange={(e) => handleChange('production_status', e.target.value)}>
              {PRODUCTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="form-group">
            <span>Deadline produksi</span>
            <input
              type="date"
              value={form.production_deadline}
              onChange={(e) => handleChange('production_deadline', e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>Approval</span>
            <select value={form.approval_status} onChange={(e) => handleChange('approval_status', e.target.value)}>
              {APPROVAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="form-group form-group-wide">
            <span>Link file mentah (Drive/Canva)</span>
            <input type="text" value={form.raw_file_url} onChange={(e) => handleChange('raw_file_url', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Link hasil edit final</span>
            <input
              type="text"
              value={form.edited_file_url}
              onChange={(e) => handleChange('edited_file_url', e.target.value)}
            />
          </label>
          <label className="form-group form-group-wide">
            <span>Link postingan asli (setelah tayang)</span>
            <input
              type="text"
              value={form.published_url}
              onChange={(e) => handleChange('published_url', e.target.value)}
            />
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
                <th>Produksi</th>
                <th>Approval</th>
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
                    <select
                      value={item.production_status || PRODUCTION_STATUSES[0]}
                      onChange={(e) => updateField(item.id, 'production_status', e.target.value)}
                    >
                      {PRODUCTION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.approval_status || APPROVAL_STATUSES[0]}
                      onChange={(e) => updateField(item.id, 'approval_status', e.target.value)}
                    >
                      {APPROVAL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={item.status} onChange={(e) => updateField(item.id, 'status', e.target.value)}>
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
