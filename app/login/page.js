'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>Masuk</h1>
        <p className="muted">Masukin email, nanti dikirim link login ke inbox kamu.</p>
        {sent ? (
          <p className="success-text">Link login udah dikirim ke {email}. Cek inbox kamu.</p>
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
            <button type="submit" className="btn-primary">
              Kirim link login
            </button>
          </>
        )}
      </form>
    </div>
  );
}
