'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, Clock } from 'lucide-react';
import { PostCard } from '@/components/app/PostCard';
import { CategoryDropdown } from '@/components/app/Categorydropdown';
import { PostTypeSidebar } from '@/components/app/Posttypesidebar';
import { postsApi } from '@/lib/posts-api';
import type { Category, Post, PostType } from '@/lib/types';
import { POST_TYPE_LABELS } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [postType, setPostType] = useState<PostType | undefined>(undefined);
  const [sort, setSort] = useState<'latest' | 'trending'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    postsApi
      .getFeed({ page: 1, limit: 20, category, type: postType, sort })
      .then((feed) => setPosts(feed.posts))
      .finally(() => setIsLoading(false));
  }, [category, postType, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <aside className="hidden lg:block shrink-0 lg:pr-6 lg:border-r lg:border-black/10">
        <PostTypeSidebar
          value={postType}
          onChange={setPostType}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((c) => !c)}
        />
      </aside>

      <div className="min-w-0 flex-1 w-full lg:px-6 lg:border-r lg:border-black/10">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h1 className="text-2xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            {postType ? POST_TYPE_LABELS[postType] : sort === 'trending' ? 'Trending today' : 'Latest discussions'}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Post-type filter is a sidebar on desktop, so it's repeated here just for mobile. */}
            <select
              value={postType || ''}
              onChange={(e) => setPostType(e.target.value ? (e.target.value as PostType) : undefined)}
              className="lg:hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 outline-none hover:bg-black/5 transition-colors duration-200"
            >
              <option value="">All types</option>
              <option value="discussion">Discussion</option>
              <option value="news">News + Analysis</option>
              <option value="article">Article</option>
            </select>

            <CategoryDropdown value={category} onChange={setCategory} />

            <div className="flex items-center gap-1 bg-white rounded-full border border-black/10 p-1">
              <button
                onClick={() => setSort('latest')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  sort === 'latest' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Latest
              </button>
              <button
                onClick={() => setSort('trending')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  sort === 'trending' ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Trending
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-black/40">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-black/50">
            No posts here yet. Be the first to{' '}
            <Link href="/app/create" className="text-black font-medium hover:underline">
              start a discussion
            </Link>
            .
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <aside className="hidden lg:block shrink-0 w-[260px]">
        <div className="bg-white rounded-2xl border border-black/10 p-5 sticky top-24">
          <h2 className="text-base font-medium mb-3">Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}</h2>
          <p className="text-sm text-black/60 mb-4">
            Share analysis, debate the news, and build reputation across the geopolitics
            community.
          </p>
          <Link
            href="/app/create"
            className="block text-center bg-black text-white text-sm font-medium py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Start a post
          </Link>
        </div>
      </aside>
    </div>
  );
}