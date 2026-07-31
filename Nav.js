'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    </nav>
  );
}
