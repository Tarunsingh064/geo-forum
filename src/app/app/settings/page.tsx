'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { BackButton } from '@/components/ui/Backbutton';
import { PostCard } from '@/components/app/PostCard';
import { usersApi } from '@/lib/users-api';
import { authApi } from '@/lib/auth-api';
import { votesApi } from '@/lib/votes-api';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';
import type { Comment, Post } from '@/lib/types';

const TABS = ['profile', 'security', 'activity', 'account'] as const;
type Tab = (typeof TABS)[number];

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get('tab') as Tab) || 'profile';
  const [tab, setTab] = useState<Tab>(TABS.includes(initialTab) ? initialTab : 'profile');

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-6" style={{ letterSpacing: '-0.02em' }}>
        Settings
      </h1>

      <div className="flex gap-2 mb-6 border-b border-black/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors duration-200 ${
              tab === t ? 'border-black text-black' : 'border-transparent text-black/50 hover:text-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileTab />}
      {tab === 'security' && <SecurityTab />}
      {tab === 'activity' && <ActivityTab />}
      {tab === 'account' && <AccountTab onDeleted={() => router.push('/signin')} />}
    </div>
  );
}

function ProfileTab() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [tags, setTags] = useState((user?.expertiseTags || []).join(', '));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setGender(user?.gender || '');
    setTags((user?.expertiseTags || []).join(', '));
  }, [user]);

  async function handleSave() {
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      await usersApi.updateProfile({
        name,
        bio,
        gender: gender || undefined,
        expertiseTags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      await refresh();
      setMessage('Profile updated.');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save your profile.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      await usersApi.updateAvatar(file);
      await refresh();
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar name={user?.name || '?'} avatarUrl={user?.avatarUrl} size={64} />
        <label className="cursor-pointer">
          <span className="inline-block bg-white border border-black/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-black/5 transition-colors duration-200">
            {isUploadingAvatar ? 'Uploading…' : 'Change photo'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
        </label>
      </div>

      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={300} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-black/70">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input label="Expertise tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="India, China, NATO" />

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button variant="primary" onClick={handleSave} disabled={isSaving} className="self-end">
        Save changes
      </Button>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setMessage('Password changed. Use it next time you sign in.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not change your password.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-5 max-w-md">
      <Input label="Current password" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <Input label="New password" type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="primary" disabled={isSaving} className="self-end">
        Update password
      </Button>
    </form>
  );
}

function ActivityTab() {
  const [subTab, setSubTab] = useState<'posts' | 'comments' | 'liked'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([usersApi.getMyPosts(), usersApi.getMyComments(), votesApi.getMyLikedPosts()])
      .then(([p, c, l]) => {
        setPosts(p);
        setComments(c);
        setLikedPosts(l);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['posts', 'comments', 'liked'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-200 ${
              subTab === t ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/70 hover:bg-black/5'
            }`}
          >
            My {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-black/50 text-sm py-8 text-center">Loading…</p>
      ) : subTab === 'posts' ? (
        posts.length === 0 ? (
          <p className="text-black/50 text-sm py-8 text-center">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((p) => (
              <PostCard key={p._id} post={p} showOwnerActions onDeleted={(id) => setPosts((prev) => prev.filter((post) => post._id !== id))} />
            ))}
          </div>
        )
      ) : subTab === 'liked' ? (
        likedPosts.length === 0 ? (
          <p className="text-black/50 text-sm py-8 text-center">No liked posts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">{likedPosts.map((p) => <PostCard key={p._id} post={p} />)}</div>
        )
      ) : comments.length === 0 ? (
        <p className="text-black/50 text-sm py-8 text-center">No comments yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-black/10 p-4">
              <p className="text-sm text-black/80">{c.content}</p>
              <p className="text-xs text-black/40 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountTab({ onDeleted }: { onDeleted: () => void }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<'deactivate' | 'delete' | null>(null);

  async function handleDeactivate() {
    setError('');
    setMessage('');
    try {
      const result = await usersApi.deactivate(password);
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not deactivate your account.');
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    setError('');
    try {
      await usersApi.delete(password);
      onDeleted();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not delete your account.');
      setPendingAction(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <h3 className="font-medium mb-1">Deactivate account</h3>
        <p className="text-sm text-black/60 mb-4">
          Hides your profile and content. Sign back in anytime to reactivate.
        </p>
        {pendingAction === 'deactivate' ? (
          <div className="flex flex-col gap-3">
            <Input label="Confirm password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setPendingAction(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleDeactivate}>Confirm deactivation</Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setPendingAction('deactivate')}>Deactivate</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="font-medium mb-1 text-red-600">Delete account</h3>
        <p className="text-sm text-black/60 mb-4">
          Permanently removes your personal data. This cannot be undone.
        </p>
        {pendingAction === 'delete' ? (
          <div className="flex flex-col gap-3">
            <Input label="Confirm password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setPendingAction(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Permanently delete</Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setPendingAction('delete')}>Delete account</Button>
        )}
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}