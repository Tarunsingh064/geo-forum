'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { BackButton } from '@/components/ui/Backbutton';
import { adminApi } from '@/lib/admin-api';
import type { AdminOverview } from '@/lib/types';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5">
      <p className="text-sm text-black/50 mb-1">{label}</p>
      <p className="text-2xl font-medium" style={{ letterSpacing: '-0.02em' }}>
        {value}
      </p>
    </div>
  );
}

function formatCurrency(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getOverview()
      .then(setOverview)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">Platform activity and revenue at a glance.</p>
      <AdminNav />

      {isLoading || !overview ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total users" value={overview.users.total} />
          <StatCard label="New users (30d)" value={overview.users.newLast30Days} />
          <StatCard label="Published posts" value={overview.content.publishedPosts} />
          <StatCard label="Total comments" value={overview.content.totalComments} />
          <StatCard label="Pending reports" value={overview.moderation.pendingReports} />
          <StatCard label="Active subscribers" value={overview.revenue.activeSubscribers} />
          <StatCard label="Revenue (30d)" value={formatCurrency(overview.revenue.last30DaysInPaise)} />
          <StatCard label="Total revenue" value={formatCurrency(overview.revenue.totalInPaise)} />
        </div>
      )}
    </div>
  );
}