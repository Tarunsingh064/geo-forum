'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/components/app/PostCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/Backbutton';
import { searchApi } from '@/lib/search-api';
import type { SearchResults } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    searchApi
      .search({ q })
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [q]);

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-6" style={{ letterSpacing: '-0.02em' }}>
        {q ? `Results for "${q}"` : 'Search'}
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : !results || (results.articles.length === 0 && results.discussions.length === 0 && results.users.length === 0) ? (
        <p className="text-black/50 text-center py-16">No results found.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {results.users.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-black/50 mb-3 uppercase tracking-wide">People</h2>
              <div className="flex flex-col gap-2">
                {results.users.map((u) => (
                  <Link
                    key={u._id}
                    href={`/app/profile/${u._id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-black/10 p-4 hover:bg-black/5 transition-colors duration-200"
                  >
                    <Avatar name={u.name} avatarUrl={u.avatarUrl} size={36} />
                    <span className="font-medium">{u.name}</span>
                    {u.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.discussions.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-black/50 mb-3 uppercase tracking-wide">Discussions & News</h2>
              <div className="flex flex-col gap-3">
                {results.discussions.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
            </section>
          )}

          {results.articles.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-black/50 mb-3 uppercase tracking-wide">Articles</h2>
              <div className="flex flex-col gap-3">
                {results.articles.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}