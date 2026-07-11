'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/lib/admin-api';
import type { Post, PostStatus } from '@/lib/types';
import { BackButton } from '@/components/ui/Backbutton';

const STATUS_FILTERS: { value: PostStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'removed', label: 'Removed' },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<PostStatus | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .listPosts(1, 50, status)
      .then((res) => setPosts(res.posts))
      .finally(() => setIsLoading(false));
  }, [status]);

  return (
    <div>
       <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">Oversight of all posts on the platform.</p>
      <AdminNav />

      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setStatus(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              status === f.value ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/70 hover:bg-black/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 divide-y divide-black/5">
          {posts.map((post) => {
            const author = typeof post.author === 'string' ? null : post.author;
            return (
              <Link
                key={post._id}
                href={`/app/post/${post._id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-black/5 transition-colors duration-200"
              >
                <div>
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-black/50">by {author?.name || 'Unknown'}</p>
                </div>
                <Badge tone={post.status === 'removed' ? 'outline' : 'neutral'}>{post.status}</Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
