import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'plum' | 'outline';
  className?: string;
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-black/5 text-black/70',
  plum: 'bg-[#2B2644] text-white',
  outline: 'border border-black/10 text-black/60',
};

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
