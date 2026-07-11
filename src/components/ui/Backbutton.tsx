'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /** Fallback destination if there's no browser history to go back to (e.g. page opened directly via URL). */
  fallbackHref?: string;
  className?: string;
}

export function BackButton({ fallbackHref = '/app', className = '' }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    // If this page was reached by a link within the app, history exists and back() feels natural.
    // If someone opened the URL directly (or shared it), there's nothing to go back to, so fall
    // back to a sensible default rather than leaving the button doing nothing.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-black transition-colors duration-200 mb-4 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}