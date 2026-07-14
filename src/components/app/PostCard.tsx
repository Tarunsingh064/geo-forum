'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VoteButtons } from './VoteButtons';
import { postsApi } from '@/lib/posts-api';
import { POST_TYPE_LABELS } from '@/lib/types';
import { CategoryBadge } from '@/components/ui/Categorybadge';
import { ContributorBadge } from '@/components/ui/ContributorBadge';
import type { Post } from '@/lib/types';

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label} ago`;
  }
  return 'just now';
}

interface PostCardProps {
  post: Post;
  /** Shows Edit/Delete controls - only pass this for the signed-in owner's own post lists (e.g. Settings > Activity). */
  showOwnerActions?: boolean;
  onDeleted?: (postId: string) => void;
}

export function PostCard({ post, showOwnerActions, onDeleted }: PostCardProps) {
  const author = typeof post.author === 'string' ? null : post.author;
  const authorId = typeof post.author === 'string' ? post.author : post.author._id;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Drafts don't exist on the public /app/post/[id] route (it only serves published posts),
  // so a draft's own title/thumbnail should open it for editing instead of a dead "not found" page.
  const targetHref = post.status === 'draft' ? `/app/post/${post._id}/edit` : `/app/post/${post._id}`;

  async function handleDelete() {
    setDeleteError('');
    setIsDeleting(true);
    try {
      await postsApi.delete(post._id);
      onDeleted?.(post._id);
    } catch {
      setDeleteError('Could not delete this post.');
      setIsDeleting(false);
    }
  }

  return (
    <article className="bg-white rounded-2xl border border-black/10 p-6 flex gap-4">
      <Link href={`/app/profile/${authorId}`} className="shrink-0">
        <Avatar name={author?.name || 'Unknown'} avatarUrl={author?.avatarUrl} size={48} />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sm text-black/50 flex-wrap">
            <Badge tone="outline">{POST_TYPE_LABELS[post.type]}</Badge>
            <span className="font-medium text-black/70">{author?.name || 'Unknown'}</span>
            <ContributorBadge type={author?.contributorType} />
            {author?.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
            {post.status === 'draft' && <Badge tone="outline">Draft</Badge>}
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            {post.type === 'article' && (
              <>
                <span>·</span>
                <span>{post.estimatedReadMinutes} min read</span>
              </>
            )}
          </div>

          {showOwnerActions && !isConfirmingDelete && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Link href={`/app/post/${post._id}/edit`}>
                <Button variant="secondary" size="sm">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setIsConfirmingDelete(true)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isConfirmingDelete && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 mb-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-red-800">Delete this post?</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsConfirmingDelete(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm
              </Button>
            </div>
          </div>
        )}
        {deleteError && <p className="text-sm text-red-600 mb-2">{deleteError}</p>}

        <Link href={targetHref} className="block group">
          <h3 className="text-lg font-medium text-black leading-snug mb-1 group-hover:underline" style={{ letterSpacing: '-0.01em' }}>
            {post.title}
          </h3>
          {post.type === 'news' && post.sourceName && (
            <p className="text-sm text-black/50 mb-1">Source: {post.sourceName}</p>
          )}
        </Link>

        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {post.categories.map((c) => (
              <CategoryBadge key={c} category={c} />
            ))}
          </div>
        )}

        {/* Vote, comments, and views all share one row, same icon size and gap, so they read as a single stat line. */}
        <div className="flex items-center gap-4 text-sm text-black/50">
          {post.status !== 'draft' && (
            <VoteButtons targetId={post._id} targetType="post" initialUpvotes={post.upvoteCount} initialDownvotes={post.downvoteCount} size="xs" />
          )}
          {post.type === 'discussion' && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> {post.commentCount}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="w-4 h-4" /> {post.viewCount}
          </span>
        </div>
      </div>

      {post.images.length > 0 && (
        <Link href={targetHref} className="w-28 h-28 shrink-0 self-stretch rounded-xl overflow-hidden hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.images[0].url} alt={post.images[0].caption || post.title} className="w-full h-full object-cover" />
        </Link>
      )}
    </article>
  );
}