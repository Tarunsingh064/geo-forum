'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { BackButton } from '@/components/ui/Backbutton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContributorBadge } from '@/components/ui/ContributorBadge';
import { adminApi } from '@/lib/admin-api';
import type { AdminUserRow } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  function loadUsers(q?: string) {
    setIsLoading(true);
    adminApi
      .listUsers(1, 50, q)
      .then((res) => setUsers(res.users))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleBanToggle(user: AdminUserRow) {
    const updated = await adminApi.banUser(user._id, !user.isBanned);
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isBanned: updated.isBanned } : u)));
  }

  async function handleVerifyJournalist(user: AdminUserRow) {
    const updated = await adminApi.verifyJournalist(user._id);
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, badges: updated.badges, isVerifiedBadge: updated.isVerifiedBadge } : u)));
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">Manage user roles, verification, and bans.</p>
      <AdminNav />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadUsers(query);
        }}
        className="mb-4"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
        />
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 divide-y divide-black/5">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-4 p-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} avatarUrl={user.avatarUrl} size={36} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    <ContributorBadge type={user.contributorType} />
                    {user.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
                    {user.isBanned && <Badge tone="outline">Banned</Badge>}
                    <Badge>{user.role}</Badge>
                  </div>
                  <p className="text-xs text-black/50">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!user.badges?.includes('Verified Journalist') && (
                  <Button variant="secondary" size="sm" onClick={() => handleVerifyJournalist(user)}>
                    Grant journalist badge
                  </Button>
                )}
                <Button variant={user.isBanned ? 'secondary' : 'danger'} size="sm" onClick={() => handleBanToggle(user)}>
                  {user.isBanned ? 'Unban' : 'Ban'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}