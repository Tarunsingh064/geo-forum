'use client';

import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, matches the backend's multer limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface ImagePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  onError: (message: string) => void;
  /** Images the post already has (edit flow) - counted against the 5-image cap. */
  existingCount?: number;
}

export function ImagePicker({ files, onChange, error, onError, existingCount = 0 }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remainingSlots = MAX_IMAGES - existingCount - files.length;

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file after removing it

    if (picked.length > remainingSlots) {
      onError(
        existingCount > 0
          ? `This post already has ${existingCount} image(s). You can add ${remainingSlots} more.`
          : `You can attach up to ${MAX_IMAGES} images.`,
      );
      return;
    }

    for (const file of picked) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        onError('Only JPEG, PNG, WEBP, or GIF images are allowed.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        onError(`"${file.name}" is over 5MB. Please choose a smaller image.`);
        return;
      }
    }

    onError('');
    onChange([...files, ...picked]);
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="text-sm font-medium text-black/70 mb-2">
        Images (optional{existingCount > 0 ? `, ${remainingSlots} more allowed` : `, up to ${MAX_IMAGES}`})
      </p>

      <div className="flex flex-wrap gap-3">
        {files.map((file, i) => (
          <div key={`${file.name}-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-black/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-xl border border-dashed border-black/20 flex flex-col items-center justify-center text-black/40 hover:text-black/70 hover:border-black/40 transition-colors duration-200"
          >
            <ImagePlus className="w-5 h-5 mb-1" />
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}