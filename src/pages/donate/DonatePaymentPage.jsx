import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CharityPromoPanel, BackToHomeLink, FooterTrustStrip } from './CharityPromoPanel';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { usePublicContent } from '../../hooks/usePublicContent';
import PaymentCheckoutExperience from '../../components/payment/PaymentCheckoutExperience';

export default function DonatePaymentPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { showToast } = useToast();
  const { programs, loading: programsLoading } = usePublicContent();

  const [mobileNumber, setMobileNumber] = useState('');
  const [donorName, setDonorName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setMobileNumber(currentUser.mobile || '');
      setDonorName(currentUser.name || '');
      return;
    }

    const storedSession = localStorage.getItem('giveaway_guest_donor_session');
    if (!storedSession) {
      showToast('Please verify your mobile number before making a donation.', 'error');
      navigate('/donate/mobile');
      return;
    }

    try {
      const parsed = JSON.parse(storedSession);
      if (parsed.userType !== 'guest_donor' || !parsed.verifiedMobile) {
        navigate('/donate/mobile');
        return;
      }
      setMobileNumber(parsed.verifiedMobile);
    } catch {
      navigate('/donate/mobile');
    }
  }, [currentUser, navigate, showToast]);

  const handleSuccess = (donation) => {
    const receipt = {
      donation_id: donation?.donation_id,
      amount: donation?.amount,
      cause: donation?.program_name || 'Charitable donation',
      mobile: mobileNumber,
      donorName: donorName || currentUser?.name || 'Generous Donor',
      status: donation?.payment_status || 'CONFIRMED',
      transactionId: donation?.razorpay_payment_id,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    localStorage.setItem('giveaway_last_donation_receipt', JSON.stringify(receipt));
    showToast('Payment successful! Thank you for your generosity.', 'success');
    navigate(`/donate/success?donation_id=${donation?.donation_id || ''}`);
  };

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

      <motion.main
        className="pay-flow-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <CharityPromoPanel privacyMessage="Your payment is encrypted end-to-end and processed securely via Razorpay." />

        <section className="pay-flow-card pay-flow-card--checkout">
          {programsLoading ? (
            <p className="pay-hint">Loading programs…</p>
          ) : (
            <PaymentCheckoutExperience
              programs={programs}
              mobile={mobileNumber}
              donorName={donorName}
              donorNameEditable
              authenticated={Boolean(currentUser?.role === 'donor')}
              onSuccess={handleSuccess}
            />
          )}
        </section>
      </motion.main>

      <FooterTrustStrip />
    </div>
  );
}
