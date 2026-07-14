import { Badge } from './Badge';
import type { ContributorType } from '@/lib/types';

export function ContributorBadge({ type }: { type?: ContributorType }) {
  if (!type || type === 'none') return null;
  return <Badge tone="plum">{type === 'author' ? 'Author' : 'Journalist'}</Badge>;
}