import type { BrandItem } from '@/lib/types';

interface MarqueeProps {
  items: BrandItem[];
  trackClassName: string;
  itemClassName: string;
}

/** Renders the brand list twice back-to-back so the -50% translate loops seamlessly. */
export function Marquee({ items, trackClassName, itemClassName }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={trackClassName} aria-hidden={false}>
      {doubled.map((item, i) => (
        <span key={`${item.name}-${i}`} className={itemClassName} style={item.style}>
          {item.name}
        </span>
      ))}
    </div>
  );
}
