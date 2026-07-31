'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/calendar', label: 'Kalender konten' },
  { href: '/production', label: 'Production board' },
  { href: '/brand-guide', label: 'Brand guide' },
  { href: '/trending', label: 'Trending topics' },
  { href: '/competitors', label: 'Kompetitor' },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (pathname === '/login' || pathname === '/reset-password') {
    return null;
  }

  return (
    <nav className="nav">
      <div className="nav-brand">smartmomvestor</div>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'nav-link active' : 'nav-link'}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button className="btn-secondary" onClick={handleLogout}>
        Keluar
      </button>
    </nav>
  );
}
