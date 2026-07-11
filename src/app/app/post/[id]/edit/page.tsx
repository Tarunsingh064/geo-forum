'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { ImagePicker } from '@/components/app/Imagepicker';
import { postsApi } from '@/lib/posts-api';
import { CATEGORY_LABELS, CATEGORY_VALUES } from '@/lib/types';
import type { Category, Post } from '@/lib/types';
import { ApiRequestError } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadWarning, setImageUploadWarning] = useState<{ willBePublished: boolean } | null>(null);

  useEffect(() => {
    // getById only serves published posts; if this is a draft, fall back to the owner's own list
    postsApi
      .getById(params.id)
      .catch(() => postsApi.getMyPosts().then((posts) => posts.find((p) => p._id === params.id) || null))
      .then((data) => {
        if (!data) {
          setLoadError("This post couldn't be found.");
          return;
        }
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setSourceUrl(data.sourceUrl || '');
        setSourceName(data.sourceName || '');
        setCategories(data.categories);
        setTagsInput(data.tags.join(', '));
      })
      .catch(() => setLoadError("This post couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  function toggleCategory(cat: Category) {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat].slice(0, 5)));
  }

  async function handleSave(publish = false) {
    if (!post) return;
    setError('');
    setImageUploadWarning(null);
    if (!title.trim() || content.trim().length < 10) {
      setError('Add a title and at least a couple of sentences before continuing.');
      return;
    }
    setIsSubmitting(true);
    // A post that's still a draft has no page on the published-only detail route - anywhere we'd
    // normally link to "the post" needs to go to the activity list instead in that case.
    const willBePublished = publish || post.status === 'published';
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 10);

      await postsApi.update(post._id, {
        title: title.trim(),
        content: content.trim(),
        sourceUrl: post.type === 'news' ? sourceUrl.trim() || undefined : undefined,
        sourceName: post.type === 'news' ? sourceName.trim() || undefined : undefined,
        categories,
        tags,
        ...(publish ? { status: 'published' as const } : {}),
      });

      if (newImages.length > 0) {
        try {
          await postsApi.uploadImages(post._id, newImages);
        } catch {
          setImageUploadWarning({ willBePublished });
          setIsSubmitting(false);
          return;
        }
      }

      router.push(willBePublished ? `/app/post/${post._id}` : '/app/settings?tab=activity');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save your changes.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-black/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (loadError || !post) {
    return <div className="text-center py-24 text-black/50">{loadError || "This post couldn't be found."}</div>;
  }

  const authorId = typeof post.author === 'string' ? post.author : post.author._id;
  if (user && user._id !== authorId) {
    return <div className="text-center py-24 text-black/50">You can only edit your own posts.</div>;
  }

  // Where "Cancel" (discard changes) should return to, based on the post's current saved status.
  const viewHref = post.status === 'published' ? `/app/post/${post._id}` : '/app/settings?tab=activity';

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium" style={{ letterSpacing: '-0.02em' }}>
          Edit post
        </h1>
        <Link href={viewHref} className="text-sm text-black/50 hover:text-black transition-colors duration-200">
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-5">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the headline?" />

        {post.type === 'news' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Source link" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…" />
            <Input label="Source name" value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Reuters, AP…" />
          </div>
        )}

        <Textarea
          label={post.type === 'news' ? 'Your analysis' : 'Content'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />

        <div>
          <p className="text-sm font-medium text-black/70 mb-2">Categories (up to 5)</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_VALUES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-200 ${
                  categories.includes(cat) ? 'bg-black text-white border-black' : 'bg-white border-black/10 text-black/70 hover:bg-black/5'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {post.images.length > 0 && (
          <div>
            <p className="text-sm font-medium text-black/70 mb-2">Existing images</p>
            <div className="flex flex-wrap gap-3">
              {post.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.publicId} src={img.url} alt={img.caption || ''} className="w-20 h-20 rounded-xl object-cover border border-black/10" />
              ))}
            </div>
            <p className="text-xs text-black/40 mt-1.5">Existing images can&apos;t be removed here yet — only new ones can be added below.</p>
          </div>
        )}

        <ImagePicker files={newImages} onChange={setNewImages} error={imageError} onError={setImageError} existingCount={post.images.length} />

        <Input
          label="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="taiwan, semiconductors, deterrence"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        {imageUploadWarning && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex items-center justify-between gap-4">
            <span>Your changes saved, but the new images failed to upload.</span>
            <Link
              href={imageUploadWarning.willBePublished ? `/app/post/${post._id}` : '/app/settings?tab=activity'}
              className="font-medium underline shrink-0"
            >
              Continue
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={() => router.push(viewHref)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleSave(false)} disabled={isSubmitting}>
            Save changes
          </Button>
          {post.status === 'draft' && (
            <Button variant="primary" onClick={() => handleSave(true)} disabled={isSubmitting}>
              Publish now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}