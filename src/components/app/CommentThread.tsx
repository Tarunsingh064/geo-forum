'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { VoteButtons } from './VoteButtons';
import { CommentForm } from './CommentForm';
import type { Comment } from '@/lib/types';

interface CommentThreadProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export function CommentThread({ comment, postId, depth = 0 }: CommentThreadProps) {
  const [replies, setReplies] = useState(comment.replies || []);
  const [isReplying, setIsReplying] = useState(false);
  const author = typeof comment.author === 'string' ? null : comment.author;

  return (
    <div className={depth > 0 ? 'pl-6 border-l border-black/10' : ''}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5 text-sm">
          <Avatar name={author?.name || 'Unknown'} avatarUrl={author?.avatarUrl} size={22} />
          <span className="font-medium text-black/80">{author?.name || 'Unknown'}</span>
          {author?.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
        </div>

        <p className={`text-sm leading-relaxed mb-2 ${comment.isDeleted ? 'text-black/30 italic' : 'text-black/80'}`}>
          {comment.content}
        </p>

        <div className="flex items-center gap-4">
          <VoteButtons
            targetId={comment._id}
            targetType="comment"
            initialUpvotes={comment.upvoteCount}
            initialDownvotes={comment.downvoteCount}
            size="sm"
          />
          {!comment.isDeleted && (
            <button
              onClick={() => setIsReplying((r) => !r)}
              className="text-sm text-black/50 hover:text-black transition-colors duration-200"
            >
              Reply
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              autoFocus
              onCancel={() => setIsReplying(false)}
              onSubmitted={(newReply) => {
                setReplies((r) => [...r, newReply]);
                setIsReplying(false);
              }}
            />
          </div>
        )}
      </div>

      {replies.map((reply) => (
        <CommentThread key={reply._id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}
