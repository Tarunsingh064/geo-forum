'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { ContributorBadge } from '@/components/ui/ContributorBadge';
import { PostCard } from '@/components/app/PostCard';
import { usersApi } from '@/lib/users-api';
import { followApi } from '@/lib/follow-api';
import { searchApi } from '@/lib/search-api';
import { useAuth } from '@/hooks/useAuth';
import type { Post, User } from '@/lib/types';

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Partial<User> & { id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?._id === params.id;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([usersApi.getPublicProfile(params.id), searchApi.search({ author: params.id })])
      .then(([profileData, results]) => {
        setProfile(profileData);
        setPosts([...results.discussions, ...results.articles].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  async function handleFollowToggle() {
    if (isFollowing) {
      await followApi.unfollowUser(params.id);
    } else {
      await followApi.followUser(params.id);
    }
    setIsFollowing((f) => !f);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-black/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-24 text-black/50">This profile couldn&apos;t be found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <div className="bg-white rounded-2xl border border-black/10 p-8 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name || '?'} avatarUrl={profile.avatarUrl} size={64} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-medium">{profile.name}</h1>
                <ContributorBadge type={profile.contributorType} />
                {profile.isVerifiedBadge && <Badge tone="plum">Verified</Badge>}
              </div>
              <p className="text-black/60 text-sm mt-1">
                {typeof profile.followers === 'number' ? profile.followers : 0} followers ·{' '}
                {typeof profile.following === 'number' ? profile.following : 0} following ·{' '}
                {profile.reputationScore ?? 0} reputation
              </p>
            </div>
          </div>

          {!isOwnProfile && (
            <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollowToggle}>
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        {profile.bio && <p className="text-black/70 mt-5 leading-relaxed">{profile.bio}</p>}

        {profile.badges && profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {profile.badges.map((badge) => (
              <Badge key={badge} tone="outline">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-lg font-medium mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-black/50 text-center py-12">No published posts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}