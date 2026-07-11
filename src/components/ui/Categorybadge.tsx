import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';
import type { Category } from '@/lib/types';

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}