import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BasePillProps {
  children: ReactNode;
  size?: 'base' | 'lg';
  withArrow?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<BasePillProps['size']>, string> = {
  base: 'text-base',
  lg: 'text-base md:text-lg',
};

/** The solid black pill with a trailing white arrow circle, used for primary CTAs like "Enter Forum", "Join the debate", "Explore the forum". */
export function PillButton({
  children,
  size = 'base',
  withArrow = false,
  className = '',
  href,
  ...rest
}: BasePillProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  const content = (
    <span
      className={`inline-flex items-center gap-3 bg-black text-white font-medium rounded-full transition-colors duration-200 hover:bg-gray-800 ${
        withArrow ? 'pl-8 pr-2 py-2' : 'px-7 py-2.5'
      } ${sizeClasses[size]} ${className}`}
    >
      {children}
      {withArrow && (
        <span className="bg-white rounded-full p-2 inline-flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-black" />
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return (
    <button {...rest} className="inline-flex focus-visible:outline-none">
      {content}
    </button>
  );
}
