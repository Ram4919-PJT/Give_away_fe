import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Award,
  Lock,
  Heart,
  Target,
  Eye,
  CheckCircle2,
  Quote,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Stethoscope,
  Utensils,
  UserCheck,
  Send,
  Linkedin,
  HelpCircle,
  Briefcase,
  Headphones,
  Newspaper,
  Check,
  Gift
} from 'lucide-react';
import GiveAwayHeader from '../components/layout/GiveAwayHeader';
import { useToast } from '../components/ui/Toast';

// ==========================================
// 1. TEAM MEMBERS DATA
// ==========================================
const TEAM_MEMBERS = [
  {
    name: 'Ramesh Kumar',
    role: 'Founder & Director',
    bio: 'Passionate about teamwork and social impact.',
    image: '/assets/images/Team_01_Ramesh_Kumar.png',
    linkedin: '#'
  },
  {
    name: 'Divya Singh',
    role: 'Operations Head',
    bio: 'Ensures everything runs smoothly and transparently.',
    image: '/assets/images/Team_02_Divya_Singh.png',
    linkedin: '#'
  },
  {
    name: 'Arjun Patel',
    role: 'Partnership Manager',
    bio: 'Builds strong partnerships for greater impact.',
    image: '/assets/images/Team_03_Arjun_Patel.png',
    linkedin: '#'
  },
  {
    name: 'Sneha Reddy',
    role: 'Community Lead',
    bio: 'Works closely with communities to create real change.',
    image: '/assets/images/Team_04_Sneha_Reddy.png',
    linkedin: '#'
  }
];

// ==========================================
// 2. TESTIMONIALS / VOICES OF CHANGE DATA
// ==========================================
const VOICES_OF_CHANGE = [
  {
    quote: "Thanks to the support, my daughter can now continue her education. This changed our lives.",
    name: "Kavitha R.",
    role: "Beneficiary"
  },
  {
    quote: "The food and care we received during the tough times gave us hope and strength.",
    name: "Ramesh M.",
    role: "Beneficiary"
  },
  {
    quote: "Their transparency and commitment inspire us to keep supporting. You see the proof.",
    name: "Anjali P.",
    role: "Donor"
  }
];

// ==========================================
// MAIN LANDING PAGE COMPONENT
// ==========================================
export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Contact form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle scroll state passed from navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.state]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setSubmitting(false);
      showToast('Thank you! Your message has been sent successfully.', 'success');
      setFormData({ fullName: '', email: '', subject: 'general', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col font-sans text-[#0B245B] overflow-x-hidden">
      {/* 1. NAVBAR */}
      <GiveAwayHeader />

      <main className="flex-1">
        {/* ==========================================
            2. HERO SECTION
           ========================================== */}
        <section id="hero" className="relative py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs sm:text-sm font-semibold border border-[#DCE8FA]">
                <Heart className="w-4 h-4 text-[#1268E8]" />
                <span>Connecting Kind Hearts to Real Needs</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.12] text-[#0B245B] tracking-tight">
                Give with purpose.<br />
                <span className="text-[#1268E8]">Create real impact.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#49638F] font-medium leading-relaxed max-w-xl">
                Aja Abayahastham connects generous donors with verified individuals and communities in need — ensuring transparency, accountability, and meaningful change.
              </p>

              {/* Exact CTA Buttons from Reference Screenshot (image_1.png) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/donate')}
                  className="h-12 sm:h-13 px-7 rounded-xl bg-[#0052FF] hover:bg-[#0B57D0] text-white font-bold text-base shadow-md shadow-blue-500/25 transition-all flex items-center gap-2.5 border-none cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white/20" />
                  <span>I Want to Donate</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/register/receiver')}
                  className="h-12 sm:h-13 px-6 rounded-xl border border-[#0B57D0]/30 hover:border-[#0B57D0] bg-white hover:bg-[#EEF5FF] text-[#0B57D0] font-bold text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-2xs"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>I Need Support</span>
                </button>
              </div>

              {/* Security Strip */}
              <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B57D0]">
                <ShieldCheck className="w-4 h-4 text-[#0B57D0]" />
                <span>Secure</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B57D0]" />
                <span>Transparent</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B57D0]" />
                <span>Verified</span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-[520px]">
                {/* Background Curved Swoop Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-blue-50/30 to-transparent rounded-full blur-2xl pointer-events-none" />
                
                <img
                  src="/assets/images/About_Us_Heart_Hands.png"
                  alt="Aja Abayahastham Support & Trust Illustration"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-xl relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            3. TRUST / IMPACT NUMBERS STRIP (MATCHING SCREENSHOT)
           ========================================== */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCE8FA] grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-[#0B245B]">12,450+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#49638F]">Happy Donors</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#20B878] flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-[#0B245B]">25,780+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#49638F]">Donations Delivered</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-[#0B245B]">18,600+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#49638F]">Lives Impacted</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-[#0B245B]">320+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#49638F]">Verified NGOs &amp; Partners</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            4. ABOUT / PURPOSE SECTION
           ========================================== */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-4">
            <span>OUR PURPOSE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B245B] tracking-tight mb-12">
            Guided by purpose. Driven by compassion.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* OUR MISSION */}
            <div className="bg-white rounded-2xl p-8 border border-[#DCE8FA] shadow-sm flex flex-col items-center text-center hover:border-[#1268E8]/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B245B] mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-[#49638F] leading-relaxed">
                To connect kindness with real need by ensuring every donation is transparent, verified, and creates real, lasting impact.
              </p>
            </div>

            {/* OUR VISION */}
            <div className="bg-white rounded-2xl p-8 border border-[#DCE8FA] shadow-sm flex flex-col items-center text-center hover:border-[#1268E8]/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B245B] mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-[#49638F] leading-relaxed">
                A world where no act of generosity is wasted and every person in need receives the support and dignity they deserve.
              </p>
            </div>

            {/* OUR VALUES */}
            <div className="bg-white rounded-2xl p-8 border border-[#DCE8FA] shadow-sm flex flex-col items-start text-left hover:border-[#1268E8]/40 transition">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center mb-6 self-center">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B245B] mb-3 self-center">Our Values</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#49638F] font-medium w-full">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1268E8] shrink-0 mt-0.5" />
                  <span>Transparency in everything we do</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1268E8] shrink-0 mt-0.5" />
                  <span>Accountability to our donors and partners</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1268E8] shrink-0 mt-0.5" />
                  <span>Compassion for every life we touch</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1268E8] shrink-0 mt-0.5" />
                  <span>Integrity in every action</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================
            5. OUR STORY SECTION
           ========================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider">
                <span>OUR STORY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B245B] tracking-tight">
                A small act that started a <span className="text-[#1268E8]">movement.</span>
              </h2>
              <div className="space-y-4 text-base text-[#49638F] font-medium leading-relaxed">
                <p>
                  Aja Abayahastham began with a simple belief — that giving should be easy, transparent, and truly impactful.
                </p>
                <p>
                  What started as a small initiative among a few well-wishers has grown into a trusted platform helping thousands of people across communities.
                </p>
                <p>
                  Every donation, every act of kindness, and every smile we create together, drives us forward.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 text-[#1268E8] font-bold text-base hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  <span>Join Our Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Story Image & Quote */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full max-w-[500px] mx-auto">
                <img
                  src="/assets/images/Our_Story_Hands_Heart.png"
                  alt="Our Story - Hands with Heart"
                  className="w-full h-auto object-contain rounded-2xl shadow-lg"
                />

                {/* Quote Box Overlay */}
                <div className="mt-6 sm:mt-0 sm:absolute sm:-bottom-8 sm:-left-8 bg-white rounded-2xl p-6 shadow-xl border border-[#DCE8FA] max-w-sm text-left">
                  <Quote className="w-8 h-8 text-[#1268E8]/30 mb-2" />
                  <p className="text-sm font-semibold text-[#0B245B] italic leading-relaxed mb-2">
                    &ldquo;Alone we can do so little; together we can do so much.&rdquo;
                  </p>
                  <p className="text-xs font-bold text-[#1268E8]">— Helen Keller</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            6. TEAM SECTION
           ========================================== */}
        <section id="team" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-4">
            <span>OUR TEAM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B245B] tracking-tight mb-12">
            People with passion. Purpose in action.
          </h2>

          {/* 4 Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col items-center text-center hover:border-[#1268E8]/40 transition group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#EEF5FF] shadow-inner shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#0B245B]">{member.name}</h3>
                <p className="text-xs font-bold text-[#1268E8] mb-2">{member.role}</p>
                <p className="text-xs text-[#49638F] leading-relaxed mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center hover:bg-[#1268E8] hover:text-white transition"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {/* Transparency Banner Below Team */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#1268E8] shrink-0" />
              <div>
                <h4 className="text-base font-bold text-[#0B245B]">100% Transparency, Zero Compromise.</h4>
                <p className="text-xs sm:text-sm text-[#49638F]">Every donation is tracked and verified. You see the proof.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('impact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-10 px-5 rounded-lg border border-[#1268E8] text-[#1268E8] hover:bg-[#EEF5FF] font-semibold text-xs sm:text-sm transition whitespace-nowrap cursor-pointer bg-white"
            >
              See Our Impact →
            </button>
          </div>
        </section>

        {/* ==========================================
            7. HOW IT WORKS SECTION
           ========================================== */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-4">
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B245B] tracking-tight mb-12">
            Simple steps to create meaningful change.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm relative space-y-4">
              <div className="text-3xl font-extrabold text-[#1268E8]">01</div>
              <h3 className="text-lg font-bold text-[#0B245B]">Create an Account</h3>
              <p className="text-xs sm:text-sm text-[#49638F] leading-relaxed">
                Sign up as a Donor, Receiver, or NGO partner in a few quick steps.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm relative space-y-4">
              <div className="text-3xl font-extrabold text-[#1268E8]">02</div>
              <h3 className="text-lg font-bold text-[#0B245B]">Connect / Give Support</h3>
              <p className="text-xs sm:text-sm text-[#49638F] leading-relaxed">
                Browse verified financial requests or contribute essential items directly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm relative space-y-4">
              <div className="text-3xl font-extrabold text-[#1268E8]">03</div>
              <h3 className="text-lg font-bold text-[#0B245B]">Verified Assistance</h3>
              <p className="text-xs sm:text-sm text-[#49638F] leading-relaxed">
                Admin and field officers verify every case for genuine impact distribution.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm relative space-y-4">
              <div className="text-3xl font-extrabold text-[#1268E8]">04</div>
              <h3 className="text-lg font-bold text-[#0B245B]">Track the Impact</h3>
              <p className="text-xs sm:text-sm text-[#49638F] leading-relaxed">
                Receive proof of delivery, receipts, and live status reports transparently.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            8. IMPACT SECTION
           ========================================== */}
        <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-4">
            <span>OUR IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B245B] tracking-tight mb-3">
            Real impact. Real people. Real change.
          </h2>
          <p className="text-base text-[#49638F] font-medium max-w-2xl mx-auto mb-12">
            Every donation on Aja Abayahastham creates a lasting difference in someone's life. Together, we build stronger communities and a better tomorrow.
          </p>

          {/* Impact Main Illustration */}
          <div className="w-full max-w-md mx-auto mb-12">
            <img
              src="/assets/images/Impact_Heart_Hands.png"
              alt="Real Impact Illustration"
              className="w-full h-auto object-contain rounded-2xl drop-shadow-md"
            />
          </div>

          {/* 4 Impact Counters Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col items-center">
              <Users className="w-8 h-8 text-[#1268E8] mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">12,450+</div>
              <div className="text-xs sm:text-sm text-[#49638F] font-semibold">Happy Donors</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-[#1268E8] mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">25,780+</div>
              <div className="text-xs sm:text-sm text-[#49638F] font-semibold">Donations Delivered</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col items-center">
              <Heart className="w-8 h-8 text-[#1268E8] mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">18,600+</div>
              <div className="text-xs sm:text-sm text-[#49638F] font-semibold">Lives Impacted</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-[#1268E8] mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B245B]">320+</div>
              <div className="text-xs sm:text-sm text-[#49638F] font-semibold">Verified NGOs &amp; Partners</div>
            </div>
          </div>

          {/* Where Your Kindness Reaches */}
          <div className="mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B245B] mb-2">Where your kindness reaches</h3>
            <p className="text-sm text-[#49638F] font-medium mb-8">We work across multiple causes to bring hope and change.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {/* Education */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0B245B]">Education</h4>
                <p className="text-xs text-[#49638F]">Supporting quality education for all children.</p>
              </div>

              {/* Healthcare */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0B245B]">Healthcare</h4>
                <p className="text-xs text-[#49638F]">Providing medical care and essential health support.</p>
              </div>

              {/* Food & Shelter */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0B245B]">Food &amp; Shelter</h4>
                <p className="text-xs text-[#49638F]">Ensuring no one sleeps hungry or without shelter.</p>
              </div>

              {/* Women Empowerment */}
              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FF] text-[#1268E8] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0B245B]">Women Empowerment</h4>
                <p className="text-xs text-[#49638F]">Empowering women to build independent futures.</p>
              </div>
            </div>
          </div>

          {/* Voices of Change */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B245B] mb-2">Voices of change</h3>
            <p className="text-sm text-[#49638F] font-medium mb-8">Stories from people whose lives have been touched.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {VOICES_OF_CHANGE.map((v) => (
                <div key={v.name} className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-4">
                  <p className="text-sm text-[#49638F] font-medium italic leading-relaxed">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                  <div>
                    <div className="text-sm font-bold text-[#0B245B]">— {v.name}</div>
                    <div className="text-xs text-[#1268E8] font-semibold">{v.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            9. CONTACT US SECTION
           ========================================== */}
        <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5FF] text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-4">
              <span>CONTACT US</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B245B] tracking-tight mb-2">
              We're here to help and connect. Let's make a difference together.
            </h2>
            <p className="text-sm sm:text-base text-[#49638F] font-medium">
              Have questions or need assistance? Reach out to us — we're happy to help!
            </p>
          </div>

          {/* Contact Support Illustration Top/Center */}
          <div className="w-full max-w-xs mx-auto mb-10">
            <img
              src="/assets/images/Contact_Us_Support_Illustration.png"
              alt="Contact Support Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Contact Form & Contact Info Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE8FA] shadow-sm">
              <h3 className="text-xl font-bold text-[#0B245B] mb-6">Send us a message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="text-xs sm:text-sm font-semibold text-[#0B245B] block mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full h-11 bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-xl px-4 text-sm text-[#0B245B] outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs sm:text-sm font-semibold text-[#0B245B] block mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full h-11 bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-xl px-4 text-sm text-[#0B245B] outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="text-xs sm:text-sm font-semibold text-[#0B245B] block mb-1.5">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-11 bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-xl px-4 text-sm text-[#0B245B] outline-none transition cursor-pointer"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="donation">Donation Question</option>
                    <option value="partnership">NGO Partnership</option>
                    <option value="support">Support Request</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs sm:text-sm font-semibold text-[#0B245B] block mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    className="w-full bg-white border border-[#DCE8FA] focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8] rounded-xl p-4 text-sm text-[#0B245B] outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: '#1268E8' }}
                  className="w-full h-12 hover:bg-[#0f54be] text-white font-semibold text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  <span>{submitting ? 'Sending message…' : 'Send Message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right: Contact Information */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE8FA] shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#0B245B] mb-6">Contact Information</h3>
                <div className="space-y-5 text-xs sm:text-sm font-medium text-[#49638F]">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0B245B]">Email</div>
                      <a href="mailto:info@ajaabayahastham.org" className="hover:text-[#1268E8] transition">
                        info@ajaabayahastham.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0B245B]">Phone</div>
                      <a href="tel:+919876543210" className="hover:text-[#1268E8] transition">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0B245B]">Address</div>
                      <p className="leading-relaxed">
                        Aja Abayahastham Foundation<br />
                        123, Kindness Street, Hyderabad, Telangana - 500001, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#1268E8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0B245B]">Office Hours</div>
                      <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                      <p className="text-slate-400">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Banner */}
              <div className="p-4 rounded-xl bg-[#EEF5FF] border border-[#DCE8FA] text-xs text-[#0B245B] font-medium flex items-center gap-3">
                <Users className="w-5 h-5 text-[#1268E8] shrink-0" />
                <span>We value your time and trust. Your message helps us improve and serve you better.</span>
              </div>
            </div>
          </div>

          {/* Other Ways to Reach Us */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold text-[#0B245B] mb-8">Other ways to reach us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-2">
                <Mail className="w-6 h-6 text-[#1268E8]" />
                <h4 className="text-base font-bold text-[#0B245B]">General Inquiries</h4>
                <p className="text-xs text-[#1268E8] font-semibold">info@ajaabayahastham.org</p>
                <p className="text-xs text-[#49638F]">For general questions</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-2">
                <Briefcase className="w-6 h-6 text-[#1268E8]" />
                <h4 className="text-base font-bold text-[#0B245B]">Partnerships</h4>
                <p className="text-xs text-[#1268E8] font-semibold">partnerships@ajaabayahastham.org</p>
                <p className="text-xs text-[#49638F]">For collaborations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-2">
                <Headphones className="w-6 h-6 text-[#1268E8]" />
                <h4 className="text-base font-bold text-[#0B245B]">Donor Support</h4>
                <p className="text-xs text-[#1268E8] font-semibold">support@ajaabayahastham.org</p>
                <p className="text-xs text-[#49638F]">For donation assistance</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#DCE8FA] shadow-sm space-y-2">
                <Newspaper className="w-6 h-6 text-[#1268E8]" />
                <h4 className="text-base font-bold text-[#0B245B]">Media &amp; Press</h4>
                <p className="text-xs text-[#1268E8] font-semibold">media@ajaabayahastham.org</p>
                <p className="text-xs text-[#49638F]">For press &amp; media</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================
          10. FOOTER (NO DONATE NAV)
         ========================================== */}
      <footer className="bg-white border-t border-[#DCE8FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
          {/* Logo & Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/GiveAway_Aja_Abayahastham_Logo.png"
                alt="Aja Abayahastham Logo"
                className="w-10 h-10 object-contain shrink-0"
              />
              <span className="text-xl font-extrabold text-[#0B245B]">Aja Abayahastham</span>
            </div>
            <p className="text-xs text-[#49638F] font-medium max-w-sm">
              Trust &amp; Transparency in Every Gift. Connecting generous donors with verified receivers and NGO partners to create real impact.
            </p>
          </div>

          {/* Quick Links (NO DONATE LINK) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0B245B]">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#49638F]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('hero');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1268E8] transition bg-transparent border-none p-0 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1268E8] transition bg-transparent border-none p-0 cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1268E8] transition bg-transparent border-none p-0 cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('impact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1268E8] transition bg-transparent border-none p-0 cursor-pointer"
                >
                  Impact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1268E8] transition bg-transparent border-none p-0 cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0B245B]">Account</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#49638F]">
              <li>
                <Link to="/login" className="hover:text-[#1268E8] transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#1268E8] transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-[#DCE8FA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#49638F]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1268E8]" />
            <span className="text-[#0B245B] font-bold">Secure</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#20B878]" />
            <span>Transparent</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#20B878]" />
            <span>Verified</span>
          </div>
          <p>© 2026 Aja Abayahastham. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
