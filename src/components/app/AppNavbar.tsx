'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Bookmark, Plus, Search } from 'lucide-react';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { notificationApi } from '@/lib/notification-api';

export function AppNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationApi
      .getMine()
      .then((items) => setUnreadCount(items.filter((n) => !n.isRead).length))
      .catch(() => null);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/app/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleLogout() {
    await logout();
    router.push('/signin');
  }

  return (
    <header className="sticky top-0 z-30 bg-[#F5F5F5]/90 backdrop-blur border-b border-black/5 px-6 py-4">
      <div className="max-w-content mx-auto flex items-center gap-6">
        <Link href="/app" className="flex items-center gap-2 shrink-0">
          <LogoIcon className="w-6 h-6 text-black" />
          <span className="text-xl font-medium tracking-tight text-black hidden sm:inline">The Bait</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search China, Taiwan, NATO…"
            className="w-full rounded-full border border-black/10 bg-white pl-10 pr-4 py-2 text-sm outline-none focus:border-black/30 transition-colors duration-200"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/app/create"
            className="hidden sm:inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Post
          </Link>

          <Link
            href="/app/bookmarks"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors duration-200"
            aria-label="Bookmarks"
          >
            <Bookmark className="w-5 h-5 text-black/70" />
          </Link>

          <Link
            href="/app/notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-black/70" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Link>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((o) => !o)} className="rounded-full">
              <Avatar name={user?.name || '?'} avatarUrl={user?.avatarUrl} size={36} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-black/10 shadow-lg py-2 z-40">
                <Link href={`/app/profile/${user?._id}`} className="block px-4 py-2 text-sm text-black/80 hover:bg-black/5">
                  Profile
                </Link>
                <Link href="/app/settings" className="block px-4 py-2 text-sm text-black/80 hover:bg-black/5">
                  Settings
                </Link>
                <Link href="/app/membership" className="block px-4 py-2 text-sm text-black/80 hover:bg-black/5">
                  Membership
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/app/admin" className="block px-4 py-2 text-sm text-black/80 hover:bg-black/5">
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}