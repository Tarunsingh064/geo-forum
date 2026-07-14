import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Bait — Where the World Gets Argued',
  description:
    'A dedicated community for geopolitics: long-form analysis, sourced news debate, and threaded discussion for students, researchers, journalists, and policy watchers.',
  icons: {
    icon: '/image/favicon.ico',
    shortcut: '/image/favicon.ico',
    apple: '/image/the-bait-logo-mark-512copy.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-[#F5F5F5] text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}