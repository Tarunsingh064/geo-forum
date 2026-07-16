'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContributorBadge } from '@/components/ui/ContributorBadge';
import { TipDialog } from './TipDialog';
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
    return <p className="text-xs text-black/40 px-1">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {visible.map((person) => (
        <Link
          key={person._id}
          href={`/app/profile/${person._id}`}
          className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-black/5 transition-colors duration-200"
        >
          <Avatar name={person.name} avatarUrl={person.avatarUrl} size={24} />
          <span className="text-sm text-black/80 truncate">{person.name}</span>
          {person.isVerifiedBadge && <Badge tone="plum">✓</Badge>}
        </Link>
      ))}
      {people.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-medium text-black/50 hover:text-black transition-colors duration-200 px-1 pt-1 text-left"
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
      <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-black/30" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6 sticky top-24">
      <div className="flex flex-col items-center text-center mb-4">
        <Avatar name={profile.name || 'Unknown'} avatarUrl={profile.avatarUrl} size={72} className="mb-3" />
        <div className="flex items-center gap-1.5">
          <Link href={`/app/profile/${authorId}`} className="font-medium text-black hover:underline">
            {profile.name}
          </Link>
          <ContributorBadge type={profile.contributorType} />
          {profile.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
        </div>
        {profile.bio && <p className="text-sm text-black/60 mt-2 leading-relaxed">{profile.bio}</p>}
        <p className="text-xs text-black/40 mt-2">{profile.reputationScore ?? 0} reputation</p>
      </div>

      {profile.badges && profile.badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {profile.badges.map((badge) => (
            <Badge key={badge} tone="outline">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {!isOwnProfile && (
        <div className="flex flex-col gap-2 mb-4">
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            onClick={handleFollowToggle}
            disabled={isFollowPending}
            className="w-full justify-center"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          {profile.contributorType && profile.contributorType !== 'none' && (
            <div className="flex justify-center">
              <TipDialog recipientId={authorId} recipientName={profile.name || 'this contributor'} />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-2 border-t border-black/10 pt-4">
        <button
          onClick={() => setActiveTab(activeTab === 'followers' ? null : 'followers')}
          className={`rounded-xl py-2 text-center transition-colors duration-200 ${
            activeTab === 'followers' ? 'bg-black/5' : 'hover:bg-black/5'
          }`}
        >
          <p className="text-base font-medium">{followers.length}</p>
          <p className="text-xs text-black/50">Followers</p>
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'following' ? null : 'following')}
          className={`rounded-xl py-2 text-center transition-colors duration-200 ${
            activeTab === 'following' ? 'bg-black/5' : 'hover:bg-black/5'
          }`}
        >
          <p className="text-base font-medium">{following.length}</p>
          <p className="text-xs text-black/50">Following</p>
        </button>
      </div>

      {activeTab === 'followers' && (
        <div className="mt-2">
          <PersonList people={followers} emptyLabel="No followers yet." />
        </div>
      )}
      {activeTab === 'following' && (
        <div className="mt-2">
          <PersonList people={following} emptyLabel="Not following anyone yet." />
        </div>
      )}
    </div>
  );
}