'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, ListTodo, Palette, TrendingUp, Users } from 'lucide-react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Kalender konten', icon: CalendarDays },
  { href: '/production', label: 'Production board', icon: ListTodo },
  { href: '/brand-guide', label: 'Brand guide', icon: Palette },
  { href: '/trending', label: 'Trending topics', icon: TrendingUp },
  { href: '/competitors', label: 'Kompetitor', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">SM</div>
      <div className="sidebar-links">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? 'sidebar-link sidebar-link-active' : 'sidebar-link'}
              title={link.label}
            >
              <Icon size={20} strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
