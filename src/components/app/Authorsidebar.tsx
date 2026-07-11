'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { usersApi } from '@/lib/users-api';
import { followApi } from '@/lib/follow-api';
import { useAuth } from '@/hooks/useAuth';
import type { PostAuthor, User } from '@/lib/types';

interface AuthorSidebarProps {
  authorId: string;
}

function PersonList({ people, emptyLabel }: { people: PostAuthor[]; emptyLabel: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? people : people.slice(0, 5);

  if (people.length === 0) {
    return <p className="text-xs text-black/40 px-1 py-2">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {visible.map((person) => (
        <Link
          key={person._id}
          href={`/app/profile/${person._id}`}
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-black/[0.03] transition-colors duration-200"
        >
          <Avatar name={person.name} avatarUrl={person.avatarUrl} size={26} />
          <span className="text-sm text-black/75 truncate">{person.name}</span>
          {person.isVerifiedBadge && <Badge tone="plum">✓</Badge>}
        </Link>
      ))}
      {people.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-medium text-black/40 hover:text-black transition-colors duration-200 px-2 pt-2 text-left tracking-wide"
        >
          {expanded ? 'Show less' : `+${people.length - 5} more`}
        </button>
      )}
    </div>
  );
}

export function AuthorSidebar({ authorId }: AuthorSidebarProps) {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<(Partial<User> & { id: string }) | null>(null);
  const [followers, setFollowers] = useState<PostAuthor[]>([]);
  const [following, setFollowing] = useState<PostAuthor[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | null>(null);

  const isOwnProfile = currentUser?._id === authorId;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      usersApi.getPublicProfile(authorId),
      followApi.getFollowers(authorId),
      followApi.getFollowing(authorId),
    ])
      .then(([profileData, followersData, followingData]) => {
        setProfile(profileData);
        setFollowers(followersData);
        setFollowing(followingData);
        setIsFollowing(!!currentUser && followersData.some((f) => f._id === currentUser._id));
      })
      .finally(() => setIsLoading(false));
  }, [authorId, currentUser]);

  async function handleFollowToggle() {
    setIsFollowPending(true);
    try {
      if (isFollowing) {
        await followApi.unfollowUser(authorId);
        setFollowers((prev) => prev.filter((f) => f._id !== currentUser?._id));
      } else {
        await followApi.followUser(authorId);
        if (currentUser) setFollowers((prev) => [...prev, currentUser as unknown as PostAuthor]);
      }
      setIsFollowing((f) => !f);
    } finally {
      setIsFollowPending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-black/30" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/10 sticky top-24 overflow-hidden">
      {/* Top identity block, set apart on a faint tint so it reads as a "header" rather than just the first item in a stack */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 bg-gradient-to-b from-black/[0.02] to-transparent">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full ring-1 ring-black/10 -m-1" />
          <Avatar name={profile.name || 'Unknown'} avatarUrl={profile.avatarUrl} size={76} />
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/app/profile/${authorId}`}
            className="font-medium text-black hover:underline"
            style={{ letterSpacing: '-0.01em' }}
          >
            {profile.name}
          </Link>
          {profile.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
        </div>

        {profile.bio && (
          <p className="text-sm text-black/55 mt-2.5 leading-relaxed max-w-[240px]">{profile.bio}</p>
        )}

        <p className="text-[11px] font-medium text-black/35 mt-3 uppercase tracking-wider">
          {profile.reputationScore ?? 0} reputation
        </p>

        {profile.badges && profile.badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {profile.badges.map((badge) => (
              <Badge key={badge} tone="outline">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {!isOwnProfile && (
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            onClick={handleFollowToggle}
            disabled={isFollowPending}
            className="w-full justify-center mt-5"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>

      {/* Stats + lists live below, on plain white, separated by a hairline instead of a heavy border */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-black/[0.06]">
          <button
            onClick={() => setActiveTab(activeTab === 'followers' ? null : 'followers')}
            className={`rounded-xl py-3 text-center transition-colors duration-200 ${
              activeTab === 'followers' ? 'bg-black/[0.04]' : 'hover:bg-black/[0.03]'
            }`}
          >
            <p className="text-lg font-medium" style={{ letterSpacing: '-0.01em' }}>
              {followers.length}
            </p>
            <p className="text-[11px] text-black/40 uppercase tracking-wide mt-0.5">Followers</p>
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'following' ? null : 'following')}
            className={`rounded-xl py-3 text-center transition-colors duration-200 ${
              activeTab === 'following' ? 'bg-black/[0.04]' : 'hover:bg-black/[0.03]'
            }`}
          >
            <p className="text-lg font-medium" style={{ letterSpacing: '-0.01em' }}>
              {following.length}
            </p>
            <p className="text-[11px] text-black/40 uppercase tracking-wide mt-0.5">Following</p>
          </button>
        </div>

        {activeTab && (
          <div className="mt-1 pt-2 border-t border-black/[0.06]">
            {activeTab === 'followers' && <PersonList people={followers} emptyLabel="No followers yet." />}
            {activeTab === 'following' && <PersonList people={following} emptyLabel="Not following anyone yet." />}
          </div>
        )}
      </div>
    </div>
  );
}