import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Heart, ShieldCheck, Download, RefreshCw, UserPlus, ArrowRight } from 'lucide-react';
import { BackToHomeLink, FooterTrustStrip } from './CharityPromoPanel';

export default function DonateSuccessPage() {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const storedReceipt = localStorage.getItem('giveaway_last_donation_receipt');
    if (storedReceipt) {
      try {
        setReceipt(JSON.parse(storedReceipt));
      } catch {
        /* fallback */
      }
    }
  }, []);

  const displayReceipt = receipt || {
    id: `DON-${Date.now()}`,
    amount: 2500,
    cause: 'Education for All',
    mobile: '9876543210',
    donorName: 'Generous Donor',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    status: 'Completed',
    transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
  };

  const maskedMobile = displayReceipt.mobile
    ? `+91 ${displayReceipt.mobile.slice(0, 5)} *****`
    : '+91 98765 *****';

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between font-sans text-[#0B245B] relative overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-10">
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

      {/* Success Card Centered */}
      <main className="w-full max-w-xl mx-auto px-4 my-auto py-8 z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DCE8FA] shadow-[0_10px_40px_-10px_rgba(18,104,232,0.08)] text-center space-y-6">
          {/* Green Check Icon */}
          <div className="w-20 h-20 rounded-full bg-[#E8F8F0] border border-[#20B878]/30 text-[#20B878] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">
              Donation Successful!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#49638F]">
              Thank you for supporting Aja Abayahastham. Your contribution creates real impact.
            </p>
          </div>

          {/* Amount Badge */}
          <div className="py-3 px-6 rounded-2xl bg-[#EEF5FF] border border-[#DCE8FA] inline-block">
            <span className="text-xs font-bold text-[#49638F] block uppercase tracking-wider">Amount Donated</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1268E8]">
              ₹{displayReceipt.amount.toLocaleString()}
            </span>
          </div>

          {/* Receipt Details Box */}
          <div className="bg-[#FAFCFF] border border-[#DCE8FA] rounded-2xl p-5 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-[#DCE8FA] pb-2">
              <span className="text-[#49638F] font-medium">Transaction ID</span>
              <span className="font-bold text-[#0B245B] font-mono">{displayReceipt.transactionId}</span>
            </div>

            <div className="flex justify-between border-b border-[#DCE8FA] pb-2">
              <span className="text-[#49638F] font-medium">Cause Supported</span>
              <span className="font-bold text-[#0B245B]">{displayReceipt.cause}</span>
            </div>

            <div className="flex justify-between border-b border-[#DCE8FA] pb-2">
              <span className="text-[#49638F] font-medium">Donor Mobile</span>
              <span className="font-bold text-[#0B245B]">{maskedMobile}</span>
            </div>

            <div className="flex justify-between border-b border-[#DCE8FA] pb-2">
              <span className="text-[#49638F] font-medium">Date &amp; Time</span>
              <span className="font-bold text-[#0B245B]">{displayReceipt.date}</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[#49638F] font-medium">Payment Status</span>
              <span className="px-3 py-1 rounded-full bg-[#E8F8F0] text-[#20B878] text-xs font-extrabold">
                ✓ {displayReceipt.status}
              </span>
            </div>
          </div>

          {/* Account Upgrade Banner for Guests */}
          <div className="bg-gradient-to-r from-[#EEF5FF] to-[#E8F8F0] border border-[#DCE8FA] rounded-2xl p-4 text-left flex items-start gap-3">
            <UserPlus className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-[#0B245B]">Want to track your impact history?</h4>
              <p className="text-[#49638F]">
                Create a permanent donor account to view past receipts, download 80G tax certificates, and get campaign updates.
              </p>
              <Link
                to="/register/donor"
                className="inline-flex items-center gap-1 text-[#1268E8] font-bold hover:underline pt-1"
              >
                <span>Create Donor Account Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/donate')}
              style={{ backgroundColor: '#1268E8' }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm hover:bg-[#0f54be] transition border-none cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Make Another Donation</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white border border-[#DCE8FA] hover:bg-[#EEF5FF] text-[#0B245B] font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </main>

      {/* Footer Trust Strip */}
      <FooterTrustStrip />
    </div>
  );
}
