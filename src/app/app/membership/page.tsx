'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { subscriptionApi } from '@/lib/subscription-api';
import { loadRazorpayScript } from '@/lib/razorpay';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';
import type { SubscriptionPlan } from '@/lib/types';

const PLANS: { value: SubscriptionPlan; label: string; price: string; hint: string }[] = [
  { value: 'monthly', label: 'Monthly', price: '₹199/mo', hint: 'Billed every month' },
  { value: 'yearly', label: 'Yearly', price: '₹1,999/yr', hint: 'Two months free vs. monthly' },
];

export default function MembershipPage() {
  const { user, refresh } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadRazorpayScript().catch(() => null);
  }, []);

  async function handleUpgrade() {
    setError('');
    setIsProcessing(true);
    try {
      await loadRazorpayScript();
      const order = await subscriptionApi.createOrder(plan);

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Geo Forum',
        description: `${plan === 'yearly' ? 'Yearly' : 'Monthly'} Verified membership`,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#0A0A0A' },
        handler: async (response) => {
          try {
            await subscriptionApi.verify(response);
            await refresh();
            setSuccess(true);
          } catch (err) {
            setError(err instanceof ApiRequestError ? err.message : 'Payment verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not start checkout.');
      setIsProcessing(false);
    }
  }

  const isVerified = user?.subscriptionTier === 'verified';

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Membership
      </h1>
      <p className="text-black/60 text-sm mb-6">
        Get the Verified badge next to your name and posts, so readers know your analysis is
        credentialed.
      </p>

      {isVerified ? (
        <div className="bg-white rounded-2xl border border-black/10 p-8 flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-[#2B2644] shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-medium">You&apos;re Verified</h2>
              <Badge tone="plum">Verified</Badge>
            </div>
            <p className="text-sm text-black/60">
              Thanks for supporting Geo Forum. Your badge renews automatically until you cancel.
            </p>
          </div>
        </div>
      ) : success ? (
        <div className="bg-white rounded-2xl border border-black/10 p-8 flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
          <div>
            <h2 className="font-medium mb-1">Payment confirmed</h2>
            <p className="text-sm text-black/60">Your Verified badge is now active. Refresh your profile to see it everywhere.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {PLANS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlan(p.value)}
                className={`text-left rounded-2xl border p-4 transition-colors duration-200 ${
                  plan === p.value ? 'border-black bg-black/5' : 'border-black/10 hover:bg-black/5'
                }`}
              >
                <p className="font-medium">{p.label}</p>
                <p className="text-2xl font-medium my-1" style={{ letterSpacing: '-0.02em' }}>
                  {p.price}
                </p>
                <p className="text-xs text-black/50">{p.hint}</p>
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <Button variant="primary" onClick={handleUpgrade} disabled={isProcessing} className="w-full justify-center">
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            Upgrade to Verified
          </Button>
          <p className="text-xs text-black/40 mt-3 text-center">Payments processed securely via Razorpay.</p>
        </div>
      )}
    </div>
  );
}