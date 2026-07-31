'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const PRODUCTION_STATUSES = ['Belum syuting', 'Syuting', 'Editing', 'Siap posting'];

const PILLAR_COLORS = {
  'Investasi / Crypto': '#D9E8FB',
  'Keuangan Keluarga & Pendidikan Anak': '#FCE4EC',
  'Kehidupan di Singapore': '#E1F3E1',
  'Technology / AI': '#EAE1F7',
};

function ProductionContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState(null);
  const [toast, setToast] = useState(null);

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
    setTimeout(() => setToast(null), 2000);
  }

  async function moveTo(id, newStatus) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, production_status: newStatus } : it)));
    const { error } = await supabase.from('content_items').update({ production_status: newStatus }).eq('id', id);
    if (error) {
      showToast('Gagal update: ' + error.message, true);
      loadItems();
    } else {
      showToast('Dipindah ke "' + newStatus + '"', false);
    }
  }

  function handleDragStart(id) {
    setDragId(id);
  }

  function handleDrop(status) {
    if (dragId) {
      moveTo(dragId, status);
    }
    setDragId(null);
  }

  if (loading) {
    return <p className="muted">Memuat...</p>;
  }

  return (
    <div>
      <h1>Production board</h1>
      <p className="muted" style={{ marginTop: '-12px', marginBottom: '20px' }}>
        Drag kartu antar kolom buat update status produksi. Klik kartu buat edit lengkap di halaman Kalender.
      </p>

      {toast && <div className={toast.isError ? 'toast toast-error' : 'toast toast-success'}>{toast.message}</div>}

      <div className="kanban-board">
        {PRODUCTION_STATUSES.map((status) => {
          const columnItems = items.filter((it) => (it.production_status || PRODUCTION_STATUSES[0]) === status);
          return (
            <div
              key={status}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <div className="kanban-column-header">
                {status} <span className="kanban-count">{columnItems.length}</span>
              </div>
              <div className="kanban-column-body">
                {columnItems.length === 0 && <p className="muted kanban-empty">Kosong</p>}
                {columnItems.map((item) => (
                  <a
                    key={item.id}
                    href="/calendar"
                    className="kanban-card"
                    style={{ borderLeft: `4px solid ${PILLAR_COLORS[item.pillar] || '#ccc'}` }}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                  >
                    <div className="kanban-card-date">{item.scheduled_date || 'Belum dijadwalkan'}</div>
                    <div className="kanban-card-title">{item.topic_hook || '(tanpa judul)'}</div>
                    <div className="kanban-card-meta">
                      {item.format} &middot; {item.pillar}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductionPage() {
  return <ProductionContent />;
}
