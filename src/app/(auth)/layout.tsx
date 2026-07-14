import { GuestGuard } from '@/components/auth/Guestguard ';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}