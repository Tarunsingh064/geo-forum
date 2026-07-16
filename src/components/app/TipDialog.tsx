'use client';

import { useState } from 'react';
import { Coins, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { tipsApi } from '@/lib/tips-api';
import { loadRazorpayScript } from '@/lib/razorpay';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';

const PRESET_AMOUNTS_INR = [10, 50, 100, 500];

interface TipDialogProps {
  recipientId: string;
  recipientName: string;
  postId?: string;
}

export function TipDialog({ recipientId, recipientName, postId }: TipDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [amountInr, setAmountInr] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const effectiveAmountInr = customAmount ? Number(customAmount) : amountInr;

  async function handleTip() {
    setError('');
    if (!effectiveAmountInr || effectiveAmountInr < 10) {
      setError('Minimum tip is ₹10.');
      return;
    }
    setIsProcessing(true);
    try {
      await loadRazorpayScript();
      const order = await tipsApi.createOrder({
        recipientId,
        amountInPaise: Math.round(effectiveAmountInr * 100),
        message: message.trim() || undefined,
        postId,
      });

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Geo Forum',
        description: `Tip to ${recipientName}`,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#0A0A0A' },
        handler: async (response) => {
          try {
            await tipsApi.verify(response);
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

  function handleClose() {
    setIsOpen(false);
    setSuccess(false);
    setError('');
    setMessage('');
    setCustomAmount('');
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        <Coins className="w-3.5 h-3.5" /> Tip
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={handleClose}>
          <div className="w-full max-w-sm bg-white rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tip {recipientName}</h3>
              <button onClick={handleClose} aria-label="Close">
                <X className="w-5 h-5 text-black/50" />
              </button>
            </div>

            {success ? (
              <p className="text-sm text-black/70">
                Thanks — your tip to {recipientName} went through. They&apos;ll be notified right away.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS_INR.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setAmountInr(amt);
                        setCustomAmount('');
                      }}
                      className={`rounded-xl border py-2 text-sm font-medium transition-colors duration-200 ${
                        !customAmount && amountInr === amt ? 'border-black bg-black/5' : 'border-black/10 hover:bg-black/5'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min={10}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Custom amount (₹)"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-black/30"
                />

                <Textarea
                  label="Message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={280}
                  placeholder="Say something nice…"
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button variant="primary" onClick={handleTip} disabled={isProcessing} className="justify-center">
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send ₹{effectiveAmountInr || 0} tip
                </Button>
                <p className="text-xs text-black/40 text-center">Payments processed securely via Razorpay.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}