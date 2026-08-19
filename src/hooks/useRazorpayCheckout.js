import { useCallback, useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../api/paymentClient';
import { loadRazorpayScript } from '../utils/paymentHelpers';

export default function useRazorpayCheckout() {
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState(null);

  const pay = useCallback(async ({
    amount,
    programId,
    programName,
    mobile,
    donorName,
    authenticated = false,
    onSuccess,
    onFailure,
  }) => {
    setError(null);
    setPhase('creating');

    try {
      const orderResponse = await createPaymentOrder({
        amount: Number(amount),
        program_id: Number(programId),
        mobile: mobile || undefined,
        donor_name: donorName || undefined,
        authenticated,
      });

      const order = orderResponse?.order;
      const donation = orderResponse?.donation;
      if (!order?.order_id) {
        throw new Error('Could not create a secure payment order.');
      }

      const openRazorpay = async () => {
        const Razorpay = await loadRazorpayScript();
        setPhase('checkout');

        return new Promise((resolve, reject) => {
          const rzp = new Razorpay({
            key: order.key_id,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'Aja Abayahastham',
            description: programName ? `Donation — ${programName}` : 'Charitable donation',
            image: '/assets/donor/Aja_Abayahastham_Brand_Logo.png',
            order_id: order.order_id,
            prefill: {
              name: donorName || '',
              contact: mobile || '',
            },
            theme: { color: '#1268E8' },
            modal: {
              ondismiss: () => {
                setPhase('idle');
                reject(new Error('Payment cancelled.'));
              },
            },
            handler: async (response) => {
              try {
                setPhase('verifying');
                const verified = await verifyPayment({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                });
                setPhase('success');
                onSuccess?.(verified?.donation || donation);
                resolve(verified);
              } catch (err) {
                setPhase('idle');
                const message = err?.message || 'Payment verification failed.';
                setError(message);
                onFailure?.(message);
                reject(err);
              }
            },
          });

          rzp.on('payment.failed', (resp) => {
            const message = resp?.error?.description || 'Payment failed. Please try again.';
            setPhase('idle');
            setError(message);
            onFailure?.(message);
            reject(new Error(message));
          });

          rzp.open();
        });
      };

      if (order.dev_mode) {
        setPhase('checkout');
        const fakePaymentId = `pay_dev_${Date.now()}`;
        setPhase('verifying');
        const verified = await verifyPayment({
          orderId: order.order_id,
          paymentId: fakePaymentId,
          signature: 'dev_verified_signature',
        });
        setPhase('success');
        onSuccess?.(verified?.donation || donation);
        return verified;
      }

      return await openRazorpay();
    } catch (err) {
      setPhase('idle');
      const message = err?.message || 'Payment could not be started.';
      setError(message);
      onFailure?.(message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setError(null);
  }, []);

  return { pay, phase, error, reset, isBusy: phase !== 'idle' && phase !== 'success' };
}
