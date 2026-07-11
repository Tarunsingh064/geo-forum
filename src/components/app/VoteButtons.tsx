'use client';

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { votesApi } from '@/lib/votes-api';
import type { VoteTargetType } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface VoteButtonsProps {
  targetId: string;
  targetType: VoteTargetType;
  initialUpvotes: number;
  initialDownvotes: number;
  size?: 'xs' | 'sm' | 'md';
}

export function VoteButtons({ targetId, targetType, initialUpvotes, initialDownvotes, size = 'md' }: VoteButtonsProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [myVote, setMyVote] = useState<1 | -1 | 0>(0);
  const [isPending, setIsPending] = useState(false);

  async function handleVote(value: 1 | -1) {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (isPending) return;
    setIsPending(true);

    const previousVote = myVote;
    const nextVote = previousVote === value ? 0 : value;

    // optimistic UI update; the server is the source of truth for counts afterward
    setUpvotes((u) => u + (nextVote === 1 ? 1 : 0) - (previousVote === 1 ? 1 : 0));
    setDownvotes((d) => d + (nextVote === -1 ? 1 : 0) - (previousVote === -1 ? 1 : 0));
    setMyVote(nextVote);

    try {
      await votesApi.cast(targetId, targetType, value);
    } catch {
      // revert on failure
      setUpvotes(initialUpvotes);
      setDownvotes(initialDownvotes);
      setMyVote(previousVote);
    } finally {
      setIsPending(false);
    }
  }

  const iconSize = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const padding = size === 'xs' ? 'p-0.5' : 'p-1';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        aria-label="Upvote"
        className={`${padding} rounded-md transition-colors duration-200 ${myVote === 1 ? 'text-black bg-black/10' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
      >
        <ArrowBigUp className={iconSize} fill={myVote === 1 ? 'currentColor' : 'none'} />
      </button>
      <span className={`font-medium text-black/80 text-center ${size === 'xs' ? 'text-sm min-w-[1rem]' : 'text-sm min-w-[1.5rem]'}`}>
        {upvotes - downvotes}
      </span>
      <button
        onClick={() => handleVote(-1)}
        aria-label="Downvote"
        className={`${padding} rounded-md transition-colors duration-200 ${myVote === -1 ? 'text-red-600 bg-red-50' : 'text-black/40 hover:text-red-600 hover:bg-red-50'}`}
      >
        <ArrowBigDown className={iconSize} fill={myVote === -1 ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}