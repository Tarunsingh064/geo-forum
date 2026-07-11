import Link from 'next/link';
import { LogoIcon } from '@/components/icons/LogoIcon';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F5F5F5]">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <LogoIcon className="w-7 h-7 text-black" />
        <span className="text-2xl font-medium tracking-tight text-black">Geo Forum</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-medium text-black mb-2" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && <p className="text-black/60 text-sm mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}

        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-black/60">{footer}</div>}
    </div>
  );
}
