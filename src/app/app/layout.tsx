import { AppNavbar } from '@/components/app/AppNavbar';
import { AuthGuard } from '@/components/app/AuthGuard';
import { NotificationProvider } from '@/lib/notification-context';

export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NotificationProvider>
        <div className="min-h-screen bg-[#F5F5F5]">
          <AppNavbar />
          <main className="max-w-content mx-auto px-6 py-8">{children}</main>
        </div>
      </NotificationProvider>
    </AuthGuard>
  );
}