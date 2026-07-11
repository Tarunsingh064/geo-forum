'use client';

import { ChevronDown } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_VALUES } from '@/lib/types';
import type { Category } from '@/lib/types';

interface CategoryDropdownProps {
  value?: Category;
  onChange: (category: Category | undefined) => void;
}

export function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value as Category) : undefined)}
        className="appearance-none rounded-full border border-black/10 bg-white pl-4 pr-9 py-2 text-sm font-medium text-black/80 outline-none hover:bg-black/5 focus:border-black/30 transition-colors duration-200 cursor-pointer"
      >
        <option value="">All categories</option>
        {CATEGORY_VALUES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}