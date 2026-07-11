'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { ImagePicker } from '@/components/app/Imagepicker';
import { postsApi } from '@/lib/posts-api';
import { CATEGORY_LABELS, CATEGORY_VALUES } from '@/lib/types';
import type { Category, PostType } from '@/lib/types';
import { ApiRequestError } from '@/lib/api';

const TYPE_OPTIONS: { value: PostType; label: string; hint: string }[] = [
  { value: 'discussion', label: 'Discussion', hint: 'Start a debate or ask the community a question' },
  { value: 'news', label: 'News + Analysis', hint: 'Share a source link with your own take' },
  { value: 'article', label: 'Article', hint: 'Long-form, evergreen analysis' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const [type, setType] = useState<PostType>('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedWithImageIssue, setSavedWithImageIssue] = useState<{ postId: string; status: 'draft' | 'published' } | null>(null);

  function toggleCategory(cat: Category) {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat].slice(0, 5)));
  }

  async function handleSubmit(status: 'draft' | 'published') {
    setError('');
    setSavedWithImageIssue(null);
    if (!title.trim() || content.trim().length < 10) {
      setError('Add a title and at least a couple of sentences before continuing.');
      return;
    }
    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10);

      const post = await postsApi.create({
        type,
        title: title.trim(),
        content: content.trim(),
        sourceUrl: type === 'news' ? sourceUrl.trim() || undefined : undefined,
        sourceName: type === 'news' ? sourceName.trim() || undefined : undefined,
        categories,
        tags,
        status,
      });

      if (images.length > 0) {
        try {
          await postsApi.uploadImages(post._id, images);
        } catch {
          // The post itself saved fine - only the image step failed. Show a persistent notice
          // with a way to continue, rather than navigating past a message the user never sees.
          setSavedWithImageIssue({ postId: post._id, status });
          setIsSubmitting(false);
          return;
        }
      }

      router.push(status === 'draft' ? '/app/settings?tab=activity' : `/app/post/${post._id}`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not publish your post.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-6" style={{ letterSpacing: '-0.02em' }}>
        Start a post
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setType(opt.value)}
            className={`text-left rounded-2xl border p-4 transition-colors duration-200 ${
              type === opt.value ? 'border-black bg-black/5' : 'border-black/10 bg-white hover:bg-black/5'
            }`}
          >
            <p className="font-medium mb-1">{opt.label}</p>
            <p className="text-xs text-black/50">{opt.hint}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-5">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the headline?" />

        {type === 'news' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Source link" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…" />
            <Input label="Source name" value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Reuters, AP…" />
          </div>
        )}

        <Textarea
          label={type === 'news' ? 'Your analysis' : 'Content'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder={type === 'article' ? 'Write your long-form piece…' : 'Share your take…'}
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

        <ImagePicker files={images} onChange={setImages} error={imageError} onError={setImageError} />

        <Input
          label="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="taiwan, semiconductors, deterrence"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        {savedWithImageIssue && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex items-center justify-between gap-4">
            <span>Your post saved, but the images failed to upload. You can add them later.</span>
            <Link
              href={
                savedWithImageIssue.status === 'draft'
                  ? '/app/settings?tab=activity'
                  : `/app/post/${savedWithImageIssue.postId}`
              }
              className="font-medium underline shrink-0"
            >
              Continue
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
            Save as draft
          </Button>
          <Button variant="primary" onClick={() => handleSubmit('published')} disabled={isSubmitting}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}