'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Palette } from 'lucide-react';

function emptyPillar() {
  return { name: '', percentage: '', description: '' };
}

function BrandGuideContent() {
  const [profileId, setProfileId] = useState(null);
  const [positioning, setPositioning] = useState('');
  const [toneNotes, setToneNotes] = useState('');
  const [pillars, setPillars] = useState([emptyPillar()]);
  const [colors, setColors] = useState({ primary: '', secondary: '', background: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    setLoading(true);
    const { data } = await supabase.from('brand_profile').select('*').limit(1).maybeSingle();
    if (data) {
      setProfileId(data.id);
      setPositioning(data.positioning_statement || '');
      setToneNotes(data.tone_notes || '');
      setPillars(data.pillars && data.pillars.length ? data.pillars : [emptyPillar()]);
      setColors(data.color_palette || { primary: '', secondary: '', background: '' });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function updatePillar(index, field, value) {
    setPillars((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addPillar() {
    setPillars((prev) => [...prev, emptyPillar()]);
  }

  function removePillar(index) {
    setPillars((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      positioning_statement: positioning,
      tone_notes: toneNotes,
      pillars,
      color_palette: colors,
      updated_at: new Date().toISOString(),
    };
    if (profileId) {
      await supabase.from('brand_profile').update(payload).eq('id', profileId);
    } else {
      const { data } = await supabase.from('brand_profile').insert(payload).select().maybeSingle();
      if (data) setProfileId(data.id);
    }
    setSaving(false);
    loadProfile();
  }

  if (loading) {
    return <p className="muted">Memuat...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon">
          <Palette size={20} />
        </div>
        <div>
          <p className="page-header-eyebrow">Satu sumber kebenaran identitas brand</p>
          <h1>Brand guide</h1>
        </div>
      </div>
      <form onSubmit={handleSave}>
        <div className="card">
          <h2>Positioning statement</h2>
          <textarea
            rows="3"
            value={positioning}
            onChange={(e) => setPositioning(e.target.value)}
            className="full-width"
          />
        </div>

        <div className="card">
          <h2>Tone of voice</h2>
          <textarea rows="3" value={toneNotes} onChange={(e) => setToneNotes(e.target.value)} className="full-width" />
        </div>

        <div className="card">
          <h2>Warna brand</h2>
          <div className="grid-form">
            <label className="form-group">
              <span>Primary</span>
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                placeholder="#E8127A"
              />
            </label>
            <label className="form-group">
              <span>Secondary</span>
              <input
                type="text"
                value={colors.secondary}
                onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                placeholder="#7B2FF7"
              />
            </label>
            <label className="form-group">
              <span>Background</span>
              <input
                type="text"
                value={colors.background}
                onChange={(e) => setColors({ ...colors, background: e.target.value })}
                placeholder="#FDF6EC"
              />
            </label>
          </div>
        </div>

        <div className="card">
          <h2>Pilar konten</h2>
          {pillars.map((pillar, index) => (
            <div key={index} className="pillar-row">
              <input
                type="text"
                placeholder="Nama pilar"
                value={pillar.name}
                onChange={(e) => updatePillar(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Porsi (%)"
                value={pillar.percentage}
                onChange={(e) => updatePillar(index, 'percentage', e.target.value)}
                className="pillar-percentage"
              />
              <input
                type="text"
                placeholder="Deskripsi singkat"
                value={pillar.description}
                onChange={(e) => updatePillar(index, 'description', e.target.value)}
              />
              <button type="button" className="btn-danger-text" onClick={() => removePillar(index)}>
                Hapus
              </button>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addPillar} style={{ color: '#e8127a', borderColor: '#e8127a' }}>
            Tambah pilar
          </button>
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan brand guide'}
        </button>
      </form>
    </div>
  );
}

export default function BrandGuidePage() {
  return <BrandGuideContent />;
}
