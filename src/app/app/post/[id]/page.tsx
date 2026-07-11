'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { VoteButtons } from '@/components/app/VoteButtons';
import { CommentForm } from '@/components/app/CommentForm';
import { CommentThread } from '@/components/app/CommentThread';
import { ReportDialog } from '@/components/app/ReportDialog';
import { AuthorSidebar } from '@/components/app/Authorsidebar';
import { CategoryBadge } from '@/components/ui/Categorybadge';
import { postsApi } from '@/lib/posts-api';
import { commentsApi } from '@/lib/comments-api';
import { bookmarkApi } from '@/lib/bookmark-api';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';
import type { Comment, Post } from '@/lib/types';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    postsApi
      .getById(params.id)
      .then((postData) => {
        setPost(postData);
        if (postData.type === 'discussion') {
          return commentsApi.getForPost(params.id).then(setComments);
        }
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  async function handleBookmarkToggle() {
    const result = await bookmarkApi.toggle(params.id);
    setIsBookmarked(result.bookmarked);
  }

  async function handleDelete() {
    setDeleteError('');
    setIsDeleting(true);
    try {
      await postsApi.delete(params.id);
      router.push('/app');
    } catch (err) {
      setDeleteError(err instanceof ApiRequestError ? err.message : 'Could not delete this post.');
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-black/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-24 text-black/50">This post couldn&apos;t be found.</div>;
  }

  const author = typeof post.author === 'string' ? null : post.author;
  const authorId = typeof post.author === 'string' ? post.author : post.author._id;
  const isOwner = user?._id === authorId;

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <div className="hidden lg:block">
          <AuthorSidebar authorId={authorId} />
        </div>

        <div className="min-w-0">
          <article className="bg-white rounded-2xl border border-black/10 p-8 mb-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3 lg:hidden">
                <Avatar name={author?.name || 'Unknown'} avatarUrl={author?.avatarUrl} size={40} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black">{author?.name || 'Unknown'}</span>
                    {author?.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
                  </div>
                  <p className="text-sm text-black/50">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    {post.type === 'article' && ` · ${post.estimatedReadMinutes} min read`}
                  </p>
                </div>
              </div>
              <p className="hidden lg:block text-sm text-black/50">
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                {post.type === 'article' && ` · ${post.estimatedReadMinutes} min read`}
              </p>

              {isOwner && !isConfirmingDelete && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/app/post/${post._id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => setIsConfirmingDelete(true)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              )}
            </div>

            {isOwner && isConfirmingDelete && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-red-800">Delete this post? This can&apos;t be undone.</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsConfirmingDelete(false)} disabled={isDeleting}>
                    Cancel
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Confirm delete
                  </Button>
                </div>
              </div>
            )}
            {deleteError && <p className="text-sm text-red-600 mb-4">{deleteError}</p>}

            <h1 className="text-3xl font-medium leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>

            {post.type === 'news' && post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block text-sm text-black/50 hover:text-black mb-4 underline"
              >
                Source: {post.sourceName || post.sourceUrl}
              </a>
            )}

            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.categories.map((c) => (
                  <CategoryBadge key={c} category={c} />
                ))}
              </div>
            )}

            {/* Content is sanitized server-side before storage */}
            <div
              className="prose prose-neutral max-w-none text-black/80 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {post.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={img.publicId} src={img.url} alt={img.caption || ''} className="rounded-xl w-full object-cover" />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-black/10">
              <VoteButtons targetId={post._id} targetType="post" initialUpvotes={post.upvoteCount} initialDownvotes={post.downvoteCount} />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBookmarkToggle}
                  className={`inline-flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                    isBookmarked ? 'text-black' : 'text-black/50 hover:text-black'
                  }`}
                >
                  <BookmarkIcon className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
                <ReportDialog targetId={post._id} targetType="post" />
              </div>
            </div>
          </article>

          {post.type === 'discussion' ? (
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <h2 className="text-lg font-medium mb-4">{post.commentCount} comments</h2>
              <div className="mb-6">
                <CommentForm postId={post._id} onSubmitted={(c) => setComments((prev) => [...prev, c])} />
              </div>

              <div className="divide-y divide-black/5">
                {comments.length === 0 ? (
                  <p className="text-sm text-black/50 py-6 text-center">Be the first to weigh in.</p>
                ) : (
                  comments.map((comment) => <CommentThread key={comment._id} comment={comment} postId={post._id} />)
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-black/40 py-4">
              Comments are only available on discussion posts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}