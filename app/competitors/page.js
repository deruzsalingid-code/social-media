'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users } from 'lucide-react';

const emptyForm = { name: '', focus: '', notes: '' };

function CompetitorsContent() {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadCompetitors() {
    setLoading(true);
    const { data } = await supabase
      .from('competitors')
      .select('*')
      .order('created_at', { ascending: false });
    setCompetitors(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCompetitors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('competitors').insert(form);
    setForm(emptyForm);
    setSaving(false);
    loadCompetitors();
  }

  async function deleteCompetitor(id) {
    await supabase.from('competitors').delete().eq('id', id);
    loadCompetitors();
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon">
          <Users size={20} />
        </div>
        <div>
          <p className="page-header-eyebrow">Benchmark & swipe file</p>
          <h1>Kompetitor</h1>
        </div>
      </div>

      <div className="card">
        <h2>Tambah kompetitor</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <label className="form-group">
            <span>Nama / akun</span>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="form-group form-group-wide">
            <span>Fokus</span>
            <input type="text" value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} />
          </label>
          <label className="form-group form-group-wide">
            <span>Catatan</span>
            <textarea rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan kompetitor'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar kompetitor</h2>
        {loading ? (
          <p className="muted">Memuat...</p>
        ) : competitors.length === 0 ? (
          <p className="muted">Belum ada data kompetitor.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Fokus</th>
                <th>Catatan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.focus}</td>
                  <td>{c.notes}</td>
                  <td>
                    <button className="btn-danger-text" onClick={() => deleteCompetitor(c.id)}>
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

export default function CompetitorsPage() {
  return <CompetitorsContent />;
}
