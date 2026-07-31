'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(!!session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi nggak sama.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.replace('/'), 1500);
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>Set password baru</h1>
        {!ready ? (
          <p className="muted">Memuat link... kalau ini nggak berubah, coba buka lagi link dari email kamu.</p>
        ) : done ? (
          <p className="success-text">Password berhasil disimpan! Mengarahkan ke dashboard...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="form-group">
              <span>Password baru</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="form-group">
              <span>Konfirmasi password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
