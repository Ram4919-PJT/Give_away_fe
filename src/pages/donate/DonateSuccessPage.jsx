import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, RefreshCw, UserPlus } from 'lucide-react';
import { BackToHomeLink, FooterTrustStrip } from './CharityPromoPanel';
import { fetchDonationReceipt } from '../../api/paymentClient';
import { formatInr } from '../../utils/paymentHelpers';

export default function DonateSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const donationId = searchParams.get('donation_id');

  useEffect(() => {
    let cancelled = false;

    async function loadReceipt() {
      setLoading(true);
      try {
        if (donationId) {
          const data = await fetchDonationReceipt(donationId);
          if (!cancelled && data?.donation) {
            setReceipt({
              donation_id: data.donation.donation_id,
              amount: data.donation.amount,
              cause: data.donation.program_name || 'Charitable donation',
              mobile: data.mobile,
              donorName: data.donor_name,
              status: data.donation.payment_status,
              transactionId: data.donation.razorpay_payment_id,
              date: new Date(data.donation.paid_at || Date.now()).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            });
            return;
          }
        }
      } catch {
        /* fall back to local storage */
      }

      const storedReceipt = localStorage.getItem('giveaway_last_donation_receipt');
      if (!cancelled && storedReceipt) {
        try {
          setReceipt(JSON.parse(storedReceipt));
        } catch {
          setReceipt(null);
        }
      }
      if (!cancelled) setLoading(false);
    }

    loadReceipt().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [donationId]);

  const maskedMobile = receipt?.mobile
    ? `+91 ${String(receipt.mobile).slice(-10, -5)} *****`
    : null;

  return (
    <div className="pay-flow-shell font-sans text-[#0B245B]">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src="/assets/donor/Aja_Abayahastham_Brand_Logo.png"
            alt="Aja Abayahastham Logo"
            className="w-10 h-10 object-contain"
          />
          <div className="text-left">
            <div className="text-lg font-extrabold text-[#0B245B] leading-tight">Aja Abayahastham</div>
            <div className="text-xs font-medium text-[#49638F] leading-tight">Trust &amp; Transparency in Every Gift</div>
          </div>
        </Link>
        <BackToHomeLink />
      </header>

      <main className="w-full max-w-xl mx-auto px-4 my-auto py-8">
        <motion.div
          className="pay-flow-card text-center space-y-6"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-[#E8F8F0] border border-[#20B878]/30 text-[#20B878] flex items-center justify-center mx-auto"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">Donation successful</h1>
            <p className="text-sm text-[#49638F]">Thank you — your contribution creates real impact.</p>
          </div>

          {loading ? (
            <p className="pay-hint">Loading receipt…</p>
          ) : receipt ? (
            <>
              <div className="py-3 px-6 rounded-2xl bg-[#EEF5FF] border border-[#DCE8FA] inline-block">
                <span className="text-xs font-bold text-[#49638F] block uppercase tracking-wider">Amount donated</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1268E8]">
                  {formatInr(receipt.amount)}
                </span>
              </div>

              <div className="pay-summary text-left">
                <div className="pay-summary__row">
                  <span>Transaction ID</span>
                  <strong className="font-mono text-xs sm:text-sm">{receipt.transactionId || '—'}</strong>
                </div>
                <div className="pay-summary__row">
                  <span>Cause supported</span>
                  <strong>{receipt.cause}</strong>
                </div>
                {maskedMobile && (
                  <div className="pay-summary__row">
                    <span>Donor mobile</span>
                    <strong>{maskedMobile}</strong>
                  </div>
                )}
                <div className="pay-summary__row">
                  <span>Date</span>
                  <strong>{receipt.date}</strong>
                </div>
                <div className="pay-summary__row">
                  <span>Status</span>
                  <strong className="pay-summary__yes">{receipt.status || 'CONFIRMED'}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className="pay-hint">Receipt details are unavailable. Check your email or donor dashboard.</p>
          )}

          <div className="bg-gradient-to-r from-[#EEF5FF] to-[#E8F8F0] border border-[#DCE8FA] rounded-2xl p-4 text-left flex items-start gap-3">
            <UserPlus className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-[#0B245B]">Track your giving journey</h4>
              <p className="text-[#49638F]">Create a donor account to view receipts, 80G certificates, and impact updates.</p>
              <Link to="/register/donor" className="inline-flex items-center gap-1 text-[#1268E8] font-bold hover:underline pt-1">
                <span>Create donor account</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" className="pay-btn pay-btn--primary" onClick={() => navigate('/donate')}>
              <RefreshCw size={16} aria-hidden="true" />
              <span>Donate again</span>
            </button>
            <button type="button" className="pay-btn pay-btn--ghost" onClick={() => navigate('/')}>
              Done
            </button>
          </div>
        </motion.div>
      </main>

      <FooterTrustStrip />
    </div>
  );
}
