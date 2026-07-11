'use client';

import { useState } from 'react';
import { commentsApi } from '@/lib/comments-api';
import { Button } from '@/components/ui/Button';
import { ApiRequestError } from '@/lib/api';
import type { Comment } from '@/lib/types';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSubmitted: (comment: Comment) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentForm({ postId, parentCommentId, onSubmitted, onCancel, autoFocus }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setIsSubmitting(true);
    try {
      const comment = await commentsApi.create(postId, content.trim(), parentCommentId);
      setContent('');
      onSubmitted(comment);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not post your comment.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? 'Write a reply…' : 'Add to the discussion…'}
        autoFocus={autoFocus}
        rows={parentCommentId ? 2 : 3}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 transition-colors duration-200 resize-y"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-2 self-end">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={isSubmitting || !content.trim()}>
          {parentCommentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}
