'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [mode, setMode] = useState('password'); // 'password' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Email atau password salah. Kalau belum pernah set password, klik "Belum punya password" di bawah.');
      return;
    }
    window.location.href = '/';
  }

  async function handleSendReset(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <h1>Masuk</h1>
            <p className="muted">Masukin email dan password kamu.</p>
            <label className="form-group">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </label>
            <label className="form-group">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
            <p className="muted" style={{ marginTop: '12px' }}>
              Belum punya password?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('reset');
                  setError('');
                }}
              >
                Set di sini
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSendReset}>
            <h1>Set password</h1>
            <p className="muted">
              Masukin email kamu, nanti dikirim link sekali ini aja buat bikin password. Setelah itu kamu
              bisa login pakai email + password langsung, nggak perlu cek email lagi.
            </p>
            {resetSent ? (
              <p className="success-text">Link udah dikirim ke {email}. Buka email, klik link-nya buat set password.</p>
            ) : (
              <>
                <label className="form-group">
                  <span>Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                  />
                </label>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim link set password'}
                </button>
              </>
            )}
            <p className="muted" style={{ marginTop: '12px' }}>
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('password');
                  setError('');
                  setResetSent(false);
                }}
              >
                Balik ke halaman login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
