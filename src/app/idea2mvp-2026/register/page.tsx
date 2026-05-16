'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap, Loader2, Sparkles,
  Tag, X as XIcon, Percent, ShieldCheck, CheckCircle2, ArrowRight,
  Rocket, Trophy, Award, Gift, Calendar, ArrowLeft, HandHeart, Heart, Lightbulb
} from 'lucide-react';

import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { COUNTRIES, US_STATES, US_COUNTRY, OTHER_OPTION } from '@/lib/locations';
import { lookupCoupon, incrementCouponUse, type Coupon } from '@/lib/coupons';

// ── Idea2MVP catalog (one-time, per learner) ──────────────────
const IDEA2MVP_PROGRAM_ID = 'idea2mvp-2026';
const BASE_PRICE = 500;
const DISCOUNT_PCT = 30;     // headline 30% off => $350
const PRICE = 350;

const HEAR_OPTIONS = [
  'Google search', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn',
  'WhatsApp / Friend referral', 'Family / Parent referral', 'School / Teacher',
  'Event or workshop', 'Podcast or news', 'Other',
];

const EXPERIENCE_OPTIONS = [
  'No prior experience',
  'I have used ChatGPT or similar tools casually',
  'I have built a small project with AI tools',
  'I have shipped something (site, app, hackathon)',
  'I code regularly',
];

const BUILD_INTENT = [
  'I have a problem in mind already',
  'I have a few rough ideas',
  'I want help finding a problem worth solving',
];

function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function Idea2MVPRegisterPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponState, setCouponState] = useState<'idle' | 'checking' | 'error'>('idle');
  const [couponError, setCouponError] = useState('');
  const [submittedFee, setSubmittedFee] = useState<{ total: number; coupon: string | null; scholarship: boolean } | null>(null);
  const { showToast } = useToast();

  const fee = useMemo(() => {
    const subtotal = PRICE;
    let couponAmount = 0;
    let couponLabel: string | null = null;
    if (coupon) {
      if (coupon.discountType === 'percent') {
        couponAmount = Math.round((subtotal * coupon.discountValue) / 100);
        couponLabel = `${coupon.code} (-${coupon.discountValue}%)`;
      } else {
        couponAmount = Math.min(subtotal, coupon.discountValue);
        couponLabel = `${coupon.code} (-$${coupon.discountValue})`;
      }
    }
    return { subtotal, couponAmount, couponLabel, total: Math.max(0, subtotal - couponAmount) };
  }, [coupon]);

  const countrySel = data.countrySelect || '';
  const isCountryOther = countrySel === OTHER_OPTION;
  const isUS = countrySel === US_COUNTRY;
  const stateSel = data.stateSelect || '';
  const isStateOther = stateSel === OTHER_OPTION;

  const clearCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError(''); setCouponState('idle'); };

  const applyCoupon = async () => {
    setCouponState('checking'); setCouponError('');
    const result = await lookupCoupon(couponInput, IDEA2MVP_PROGRAM_ID, 'all');
    if (result.ok) {
      setCoupon(result.coupon);
      setCouponState('idle');
      showToast('success', `Coupon "${result.coupon.code}" applied!`);
    } else {
      setCoupon(null);
      setCouponState('error');
      setCouponError(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const { countrySelect, stateSelect, countryOther, stateOther, ...clean } = data;
    void countrySelect; void stateSelect; void countryOther; void stateOther;

    const payload: Record<string, string> = {
      program: 'Idea2MVP — From Spark to Shipped Product',
      programStart: '2026-05-31',
      ...clean,
    };
    if (data.dob) payload.age = String(calculateAge(data.dob));

    payload.headlineDiscountPct = String(DISCOUNT_PCT);
    payload.basePrice = String(BASE_PRICE);
    payload.priceAfterDiscount = String(PRICE);
    payload.couponCode = coupon?.code || '';
    payload.couponDiscountAmount = String(fee.couponAmount);
    payload.totalFee = String(fee.total);
    payload.feeSummary = `$${fee.total}${coupon ? ` (with coupon ${coupon.code})` : ''}`;

    const result = await submitForm('idea2mvp', payload);
    if (result.success) {
      if (coupon) await incrementCouponUse(coupon.id);
      setSubmittedFee({ total: fee.total, coupon: fee.couponLabel, scholarship: data.scholarshipRequest === 'yes' });
      setStatus('success');
      showToast('success', "You're registered! We'll email cohort details within 48 hours.");
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  const reset = () => { setData({}); setStatus('idle'); clearCoupon(); setSubmittedFee(null); };

  const inputBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm bg-white';
  const selectBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none';

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 35%, #1a0d2e 70%, #070c1b 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[10%] w-[420px] h-[420px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[5%] right-[10%] w-[380px] h-[380px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <Link href="/idea2mvp-2026"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[12px] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to overview
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-pink-500/20 border border-brand-300/20 text-brand-200 text-[13px] mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" /> Idea2MVP · May 31 Start
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Reserve Your <span className="bg-gradient-to-r from-brand-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">Seat</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Two minutes to lock in your spot. We&apos;ll email cohort details and payment instructions within 48 hours.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.4) 30%, rgba(236,72,153,0.5) 50%, rgba(245,158,11,0.4) 70%, transparent 100%)' }} />
      </section>

      {/* FORM */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-brand-50/30 via-white to-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Seat Reserved! 🎉
                </h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Welcome to Idea2MVP 2026. Our team will email cohort schedule, payment instructions, and onboarding links within 48 hours.
                </p>
                {submittedFee?.scholarship && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="max-w-md mx-auto mb-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-brand-50 p-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <HandHeart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-rose-700 text-[13px] mb-0.5">Scholarship request received</div>
                        <p className="text-[12px] text-slate-600 leading-relaxed">
                          Our admissions team will personally review your request and reply within <strong>3–5 business days</strong>. Please keep an eye on your inbox.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {submittedFee && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="max-w-md mx-auto mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 text-left shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700 text-[12px] font-bold uppercase tracking-[0.1em] mb-2">
                      <ShieldCheck className="w-4 h-4" /> Tuition Confirmed
                    </div>
                    <div className="text-slate-500 text-sm">Total tuition</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      ${submittedFee.total}
                    </div>
                    {submittedFee.coupon && <div className="text-xs text-emerald-600 mt-1 font-semibold">Coupon applied: {submittedFee.coupon}</div>}
                  </motion.div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
                    style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }}>
                    Register Another <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/" className="btn-secondary">Back to Home</Link>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} className="space-y-5">

                {/* Learner name */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Your Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" required value={data.name || ''}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="Builder's full name" className={inputBase} />
                  </div>
                </div>

                {/* Email + phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="email" required value={data.email || ''}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="your@email.com" className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone (WhatsApp ok) *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="tel" required value={data.phone || ''}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        placeholder="+1 234 567 8900" className={inputBase} />
                    </div>
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Date of Birth *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="date" required value={data.dob || ''}
                      onChange={(e) => setData({ ...data, dob: e.target.value })}
                      className={inputBase} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">Under 13? A parent/guardian must complete sign-up with you.</p>
                </div>

                {/* Parent/guardian (optional unless under 18) */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Parent / Guardian (required if under 18)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" value={data.parentName || ''}
                      onChange={(e) => setData({ ...data, parentName: e.target.value })}
                      placeholder="Parent / Guardian full name" className={inputBase} />
                  </div>
                </div>

                {/* Country + State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Country *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                      <select value={countrySel} required
                        onChange={(e) => {
                          const v = e.target.value;
                          setData({
                            ...data, countrySelect: v,
                            country: v === OTHER_OPTION ? (data.countryOther || '') : v,
                            stateSelect: '', state: '', stateOther: '',
                          });
                        }} className={selectBase}>
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value={OTHER_OPTION}>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">State / Region *</label>
                    {isUS ? (
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select value={stateSel} required
                          onChange={(e) => {
                            const v = e.target.value;
                            setData({ ...data, stateSelect: v, state: v === OTHER_OPTION ? (data.stateOther || '') : v });
                          }} className={selectBase}>
                          <option value="">Select state...</option>
                          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          <option value={OTHER_OPTION}>Other</option>
                        </select>
                      </div>
                    ) : (
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="text" required value={data.state || ''}
                          onChange={(e) => setData({ ...data, state: e.target.value, stateOther: e.target.value })}
                          placeholder="e.g. Lagos, London" className={inputBase} />
                      </div>
                    )}
                  </div>
                </div>
                {isCountryOther && (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" required value={data.countryOther || ''}
                      onChange={(e) => setData({ ...data, countryOther: e.target.value, country: e.target.value })}
                      placeholder="Enter your country" className={inputBase} />
                  </div>
                )}
                {isUS && isStateOther && (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" required value={data.stateOther || ''}
                      onChange={(e) => setData({ ...data, stateOther: e.target.value, state: e.target.value })}
                      placeholder="Enter your state" className={inputBase} />
                  </div>
                )}

                {/* Experience */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Experience with AI / coding tools</label>
                  <select value={data.priorExperience || ''} required
                    onChange={(e) => setData({ ...data, priorExperience: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white">
                    <option value="">Select...</option>
                    {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* Build intent */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                    Where are you at with your idea?
                  </label>
                  <select value={data.buildIntent || ''} required
                    onChange={(e) => setData({ ...data, buildIntent: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white">
                    <option value="">Select...</option>
                    {BUILD_INTENT.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* Idea sketch */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Your idea (one sentence is fine, optional)</label>
                  <textarea rows={2} value={data.ideaSketch || ''}
                    onChange={(e) => setData({ ...data, ideaSketch: e.target.value })}
                    placeholder="e.g. an app that helps students share class notes by subject"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
                </div>

                {/* How heard */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">How did you hear about us?</label>
                  <select value={data.hearAbout || ''}
                    onChange={(e) => setData({ ...data, hearAbout: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white">
                    <option value="">Select...</option>
                    {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Anything we should know? (optional)</label>
                  <textarea rows={3} value={data.notes || ''}
                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                    placeholder="Time-zone preferences, learning needs, questions..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
                </div>

                {/* Scholarship */}
                <div className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50/60 via-white to-brand-50/40 p-4 sm:p-5">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input type="checkbox"
                      checked={data.scholarshipRequest === 'yes'}
                      onChange={(e) => setData({
                        ...data,
                        scholarshipRequest: e.target.checked ? 'yes' : '',
                        ...(e.target.checked ? {} : { scholarshipReason: '' }),
                      })}
                      className="sr-only" />
                    <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.scholarshipRequest === 'yes' ? 'bg-gradient-to-br from-brand-500 to-pink-500 border-transparent' : 'border-slate-300 bg-white'}`}>
                      {data.scholarshipRequest === 'yes' && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <HandHeart className="w-4 h-4 text-rose-500" />
                        <span className="font-bold text-slate-800 text-[13.5px]">Apply for a need-based scholarship or discount</span>
                      </div>
                      <p className="text-[12px] text-slate-500 leading-relaxed">
                        Cost should never be the reason a great idea goes unbuilt. Tell us your story below: we&apos;ll review every request personally and reply within a few days.
                      </p>
                    </div>
                  </label>

                  <AnimatePresence>
                    {data.scholarshipRequest === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                          <Heart className="w-3 h-3 inline mr-1 text-rose-500" />
                          Why are you applying for a scholarship or discount? *
                        </label>
                        <textarea
                          required={data.scholarshipRequest === 'yes'}
                          rows={4}
                          value={data.scholarshipReason || ''}
                          onChange={(e) => setData({ ...data, scholarshipReason: e.target.value })}
                          placeholder="Share your situation honestly: circumstances, why this course matters to you, anything that helps us evaluate fairly. Everything you write stays confidential."
                          className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-white focus:outline-none focus:border-rose-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <span>Confidential · reviewed by our admissions team only · response within 3–5 days</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fee Summary + Coupon */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className="relative overflow-hidden rounded-2xl p-[1.5px]"
                  style={{ background: 'linear-gradient(135deg, rgba(110,66,255,0.7), rgba(236,72,153,0.7), rgba(245,158,11,0.7))' }}>
                  <div className="relative bg-white rounded-[14px] p-5">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-pink-600 flex items-center justify-center shadow-sm">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Your Tuition</span>
                      </div>
                      <motion.div key={fee.total}
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                        className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</div>
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-brand-500 to-pink-600 bg-clip-text text-transparent"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          ${fee.total}
                        </div>
                      </motion.div>
                    </div>

                    <div className="mb-3 flex items-center justify-between text-[12px] px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 relative z-10">
                      <span className="flex items-center gap-1.5 font-semibold"><Percent className="w-3 h-3" /> 30% off already applied</span>
                      <span className="font-extrabold">${BASE_PRICE - PRICE} saved</span>
                    </div>

                    <div className="space-y-2.5 text-[13px] relative z-10">
                      <div className="rounded-lg bg-slate-50/70 px-3 py-2.5 border border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-[12px]">Idea2MVP · 10 weeks + Capstone</span>
                        <span className="font-extrabold text-slate-900 text-[13px]">${PRICE}</span>
                      </div>
                      {fee.couponAmount > 0 && (
                        <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between text-emerald-600">
                          <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> Coupon {coupon?.code}</span>
                          <span className="font-semibold">−${fee.couponAmount}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Coupon input */}
                    <div className="mt-4 pt-4 border-t border-slate-100 relative z-10">
                      {coupon ? (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[12px] font-bold text-emerald-700 truncate">{coupon.code}</div>
                              {coupon.description && <div className="text-[11px] text-emerald-600/80 truncate">{coupon.description}</div>}
                            </div>
                          </div>
                          <button type="button" onClick={clearCoupon}
                            className="text-emerald-700/60 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-100 transition-colors flex-shrink-0">
                            <XIcon className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Have a coupon code?</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                              <input type="text" value={couponInput}
                                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); setCouponState('idle'); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                                placeholder="ENTER CODE"
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[13px] font-mono tracking-wider uppercase" />
                            </div>
                            <motion.button type="button" onClick={applyCoupon}
                              disabled={!couponInput.trim() || couponState === 'checking'}
                              whileTap={{ scale: 0.96 }}
                              className="px-4 py-2.5 rounded-lg text-white text-[12px] font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                              style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
                              {couponState === 'checking' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {couponError && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-[11px] text-rose-500 font-medium mt-1.5 ml-1">
                                {couponError}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Includes reminder */}
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-pink-50 border border-brand-100 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-700 mb-2 flex items-center gap-1.5">
                    <Gift className="w-3 h-3" /> Every seat includes
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-700">
                    {[
                      { i: Calendar, t: 'Weekly live lessons' },
                      { i: Trophy, t: 'Capstone Demo Day' },
                      { i: Award, t: 'Official certificate' },
                      { i: Rocket, t: 'Mentor + accountability pod' },
                    ].map(({ i: Icon, t }) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button type="submit" disabled={status === 'loading'}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full py-4 rounded-xl font-extrabold text-white text-[15px] shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)', boxShadow: '0 8px 32px rgba(110,66,255,0.45)' }}>
                  <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
                  {status === 'loading'
                    ? <Loader2 className="w-5 h-5 animate-spin relative" />
                    : <><Rocket className="w-4 h-4 relative" /><span className="relative">Reserve My Seat · ${fee.total}</span> <ArrowRight className="w-4 h-4 relative" /></>}
                </motion.button>

                <p className="text-center text-[11px] text-slate-400">
                  By registering you agree to our{' '}
                  <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link> ·{' '}
                  <Link href="/terms" className="text-brand-600 hover:underline">Terms</Link>.
                  We&apos;ll email payment instructions after registration.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
