'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const emptyForm = { pillar: '', insight: '', source_url: '' };

function TrendingContent() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadTopics() {
    setLoading(true);
    const { data } = await supabase
      .from('trending_topics')
      .select('*')
      .order('created_at', { ascending: false });
    setTopics(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTopics();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('trending_topics').insert(form);
    setForm(emptyForm);
    setSaving(false);
    loadTopics();
  }

  async function deleteTopic(id) {
    await supabase.from('trending_topics').delete().eq('id', id);
    loadTopics();
  }

  return (
    <div>
      <h1>Trending topics</h1>

      <div className="card">
        <h2>Tambah topik</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <label className="form-group">
            <span>Pilar</span>
            <input type="text" value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })} />
          </label>
          <label className="form-group form-group-wide">
            <span>Insight</span>
            <textarea rows="2" value={form.insight} onChange={(e) => setForm({ ...form, insight: e.target.value })} />
          </label>
          <label className="form-group form-group-wide">
            <span>Sumber (URL)</span>
            <input
              type="text"
              value={form.source_url}
              onChange={(e) => setForm({ ...form, source_url: e.target.value })}
            />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan topik'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Daftar topik</h2>
        {loading ? (
          <p className="muted">Memuat...</p>
        ) : topics.length === 0 ? (
          <p className="muted">Belum ada topik.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Pilar</th>
                <th>Insight</th>
                <th>Sumber</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.id}>
                  <td>{t.pillar}</td>
                  <td>{t.insight}</td>
                  <td>
                    {t.source_url ? (
                      <a href={t.source_url} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button className="btn-danger-text" onClick={() => deleteTopic(t.id)}>
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

export default function TrendingPage() {
  return <TrendingContent />;
}
