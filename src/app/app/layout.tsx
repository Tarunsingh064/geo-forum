import { AppNavbar } from '@/components/app/AppNavbar';

export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppNavbar />
      <main className="max-w-content mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
