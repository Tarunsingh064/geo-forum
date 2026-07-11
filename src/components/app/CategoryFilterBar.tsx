'use client';

import { CATEGORY_LABELS, CATEGORY_VALUES } from '@/lib/types';
import type { Category } from '@/lib/types';

interface CategoryFilterBarProps {
  active?: Category;
  onSelect: (category: Category | undefined) => void;
}

export function CategoryFilterBar({ active, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <button
        onClick={() => onSelect(undefined)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
          !active ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/70 hover:bg-black/5'
        }`}
      >
        All
      </button>
      {CATEGORY_VALUES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
            active === cat ? 'bg-black text-white' : 'bg-white border border-black/10 text-black/70 hover:bg-black/5'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
