'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CalendarDays } from 'lucide-react';

const PILLARS = [
  'Investasi / Crypto',
  'Keuangan Keluarga & Pendidikan Anak',
  'Kehidupan di Singapore',
  'Technology / AI',
];

const PILLAR_COLORS = {
  'Investasi / Crypto': '#D9E8FB',
  'Keuangan Keluarga & Pendidikan Anak': '#FCE4EC',
  'Kehidupan di Singapore': '#E1F3E1',
  'Technology / AI': '#EAE1F7',
};

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
  script_full: '',
  shot_list: '',
  wardrobe_notes: '',
  music_notes: '',
  editing_notes: '',
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

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(dateStr);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function CalendarContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('ide');
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

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

  function showToast(message, isError) {
    setToast({ message, isError: !!isError });
    setTimeout(() => setToast(null), 2500);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(item) {
    setForm({
      scheduled_date: item.scheduled_date || '',
      pillar: item.pillar || PILLARS[0],
      content_style: item.content_style || STYLES[0],
      format: item.format || FORMATS[0],
      topic_hook: item.topic_hook || '',
      breakdown: item.breakdown || '',
      script_full: item.script_full || '',
      shot_list: item.shot_list || '',
      wardrobe_notes: item.wardrobe_notes || '',
      music_notes: item.music_notes || '',
      editing_notes: item.editing_notes || '',
      caption: item.caption || '',
      hashtags: item.hashtags || '',
      status: item.status || 'draft',
      production_status: item.production_status || PRODUCTION_STATUSES[0],
      production_deadline: item.production_deadline || '',
      raw_file_url: item.raw_file_url || '',
      edited_file_url: item.edited_file_url || '',
      published_url: item.published_url || '',
      approval_status: item.approval_status || APPROVAL_STATUSES[0],
    });
    setEditingId(item.id);
    setActiveTab('ide');
    document.getElementById('content-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setActiveTab('ide');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      scheduled_date: form.scheduled_date || null,
      production_deadline: form.production_deadline || null,
    };
    const { error } = editingId
      ? await supabase.from('content_items').update(payload).eq('id', editingId)
      : await supabase.from('content_items').insert(payload);
    setSaving(false);
    if (error) {
      showToast('Gagal menyimpan: ' + error.message, true);
      return;
    }
    showToast(editingId ? 'Konten berhasil diupdate' : 'Konten berhasil disimpan', false);
    setForm(emptyForm);
    setEditingId(null);
    loadItems();
  }

  async function updateField(id, field, value) {
    const { error } = await supabase.from('content_items').update({ [field]: value }).eq('id', id);
    if (error) {
      showToast('Gagal update: ' + error.message, true);
    }
    loadItems();
  }

  async function deleteItem(id) {
    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) {
      showToast('Gagal hapus: ' + error.message, true);
    } else {
      showToast('Konten dihapus', false);
    }
    loadItems();
  }

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const weeks = buildMonthGrid(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  const itemsByDate = {};
  items.forEach((item) => {
    if (!item.scheduled_date) return;
    if (!itemsByDate[item.scheduled_date]) itemsByDate[item.scheduled_date] = [];
    itemsByDate[item.scheduled_date].push(item);
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon">
          <CalendarDays size={20} />
        </div>
        <div>
          <p className="page-header-eyebrow">Jadwalkan &amp; kelola konten</p>
          <h1>Kalender konten</h1>
        </div>
      </div>

      {toast && <div className={toast.isError ? 'toast toast-error' : 'toast toast-success'}>{toast.message}</div>}

      <div className="card">
        <div className="calendar-header">
          <button type="button" className="btn-secondary-light" onClick={goPrevMonth}>
            &larr;
          </button>
          <h2 style={{ margin: 0 }}>{monthLabel}</h2>
          <button type="button" className="btn-secondary-light" onClick={goNextMonth}>
            &rarr;
          </button>
        </div>
        <div className="calendar-grid">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
            <div key={d} className="calendar-day-label">
              {d}
            </div>
          ))}
          {weeks.flat().map((dateStr, idx) => (
            <div key={idx} className={dateStr ? 'calendar-cell' : 'calendar-cell calendar-cell-empty'}>
              {dateStr && (
                <>
                  <div className="calendar-date-number">{parseInt(dateStr.slice(-2), 10)}</div>
                  {(itemsByDate[dateStr] || []).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="calendar-item-pill"
                      style={{ background: PILLAR_COLORS[item.pillar] || '#eee' }}
                      onClick={() => startEdit(item)}
                      title={item.topic_hook}
                    >
                      {item.topic_hook}
                    </button>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" id="content-form">
        <h2>{editingId ? 'Edit konten' : 'Tambah konten baru'}</h2>
        <div className="form-tabs">
          <button
            type="button"
            className={activeTab === 'ide' ? 'form-tab form-tab-active' : 'form-tab'}
            onClick={() => setActiveTab('ide')}
          >
            1. Ide &amp; konten
          </button>
          <button
            type="button"
            className={activeTab === 'produksi' ? 'form-tab form-tab-active' : 'form-tab'}
            onClick={() => setActiveTab('produksi')}
          >
            2. Script &amp; produksi
          </button>
          <button
            type="button"
            className={activeTab === 'tracking' ? 'form-tab form-tab-active' : 'form-tab'}
            onClick={() => setActiveTab('tracking')}
          >
            3. Tracking
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid-form">
          {activeTab === 'ide' && (
            <>
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
            <span>Outline / timing (ringkas)</span>
            <textarea rows="3" value={form.breakdown} onChange={(e) => handleChange('breakdown', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Caption</span>
            <textarea rows="3" value={form.caption} onChange={(e) => handleChange('caption', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Hashtag</span>
            <input type="text" value={form.hashtags} onChange={(e) => handleChange('hashtags', e.target.value)} />
          </label>
            </>
          )}

          {activeTab === 'produksi' && (
            <>
          <label className="form-group form-group-wide">
            <span>Script lengkap (talking head) / detail slide (carousel)</span>
            <textarea
              rows="4"
              value={form.script_full}
              onChange={(e) => handleChange('script_full', e.target.value)}
            />
          </label>
          <label className="form-group form-group-wide">
            <span>Shot list (lokasi, angle, b-roll)</span>
            <textarea rows="3" value={form.shot_list} onChange={(e) => handleChange('shot_list', e.target.value)} />
          </label>
          <label className="form-group">
            <span>Wardrobe</span>
            <input
              type="text"
              value={form.wardrobe_notes}
              onChange={(e) => handleChange('wardrobe_notes', e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>Musik</span>
            <input type="text" value={form.music_notes} onChange={(e) => handleChange('music_notes', e.target.value)} />
          </label>
          <label className="form-group form-group-wide">
            <span>Catatan editing</span>
            <textarea
              rows="3"
              value={form.editing_notes}
              onChange={(e) => handleChange('editing_notes', e.target.value)}
            />
          </label>
            </>
          )}

          {activeTab === 'tracking' && (
            <>
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
            </>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : editingId ? 'Update konten' : 'Simpan konten'}
          </button>
          {editingId && (
            <button type="button" className="btn-danger-text" style={{ marginLeft: '12px' }} onClick={cancelEdit}>
              Batal edit
            </button>
          )}
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
                  <td data-label="Tanggal">{item.scheduled_date ?? '-'}</td>
                  <td data-label="Pilar">{item.pillar}</td>
                  <td data-label="Format">{item.format}</td>
                  <td data-label="Topik">{item.topic_hook}</td>
                  <td data-label="Produksi">
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
                  <td data-label="Approval">
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
                  <td data-label="Status">
                    <select value={item.status} onChange={(e) => updateField(item.id, 'status', e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Aksi">
                    <button className="link-button" style={{ marginRight: '10px' }} onClick={() => startEdit(item)}>
                      Edit
                    </button>
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
  return <CalendarContent />;
}
