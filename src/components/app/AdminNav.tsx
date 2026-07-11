'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_LINKS = [
  { href: '/app/admin', label: 'Overview' },
  { href: '/app/admin/users', label: 'Users' },
  { href: '/app/admin/reports', label: 'Reports' },
  { href: '/app/admin/posts', label: 'Posts' },
  { href: '/app/admin/privacy-policy', label: 'Privacy Policy' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6 border-b border-black/10">
      {ADMIN_LINKS.map((link) => {
        const isActive = link.href === '/app/admin' ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 ${
              isActive ? 'border-black text-black' : 'border-transparent text-black/50 hover:text-black'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
