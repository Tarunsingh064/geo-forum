'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/components/app/PostCard';
import { BackButton } from '@/components/ui/Backbutton';
import { bookmarkApi } from '@/lib/bookmark-api';
import type { Bookmark } from '@/lib/types';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookmarkApi
      .getMine()
      .then(setBookmarks)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-6" style={{ letterSpacing: '-0.02em' }}>
        Saved posts
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <p className="text-black/50 text-center py-16">Nothing saved yet — bookmark a post to find it here.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((b) => (
            <PostCard key={b._id} post={b.post} />
          ))}
        </div>
      )}
    </div>
  );
}