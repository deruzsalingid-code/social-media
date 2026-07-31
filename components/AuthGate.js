'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function AuthGate({ children }) {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login');
      } else {
        setSession(data.session);
      }
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        router.replace('/login');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return <div className="loading-screen">Memuat...</div>;
  }

  if (!session) {
    return null;
  }

  return children;
}
