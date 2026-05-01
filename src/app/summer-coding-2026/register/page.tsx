'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap, Loader2, Sparkles,
  Tag, X as XIcon, Percent, ShieldCheck, CheckCircle2, ArrowRight,
  Sun, Cpu, Lightbulb, Calendar, Trophy, Award, Gift, Rocket, ArrowLeft
} from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { COUNTRIES, US_STATES, US_COUNTRY, OTHER_OPTION } from '@/lib/locations';
import { lookupCoupon, incrementCouponUse, type Coupon } from '@/lib/coupons';

// ── Summer 2026 plan catalog (one-time, per child) ────────────────
const SUMMER_PROGRAM_ID = 'summer-coding-2026';
const SUMMER_BASE_PRICE = 350;
const SUMMER_DISCOUNT_PCT = 30;          // headline 30% off => $245
const SUMMER_PRICE = 245;                // SUMMER_BASE_PRICE * (1 - 0.30) = 245
const SIBLING_PCT = [0, 10, 15, 15];     // additional sibling discount per child position

const TRACKS = [
  { id: 'logic-builders', name: 'Logic Builders', age: 'Ages 5+', icon: Lightbulb, color: 'from-amber-400 via-orange-500 to-rose-500' },
  { id: 'code-masters', name: 'Code Masters', age: 'Ages 9+', icon: Cpu, color: 'from-brand-500 via-purple-600 to-pink-600' },
];

const SIBLING_OPTIONS = [
  'Just one child',
  '1 sibling (additional 10% off)',
  '2 siblings (additional 10% + 15% off)',
  '3+ siblings (contact us)',
];

const HEAR_OPTIONS = [
  'Google search', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn',
  'WhatsApp / Friend referral', 'Family / Parent referral', 'School / Teacher',
  'Event or workshop', 'Podcast or news', 'Other',
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

type Student = {
  index: number;
  label: string;
  trackId: string;
  trackName: string;
  basePrice: number;
  siblingPct: number;
  siblingDiscount: number;
  subtotal: number;
};

function computeSummerFee(primaryTrackId: string, siblingTracks: string[], coupon: Coupon | null) {
  const all = [primaryTrackId, ...siblingTracks];
  const students: Student[] = all.map((trackId, i) => {
    const t = TRACKS.find((x) => x.id === trackId);
    const base = trackId ? SUMMER_PRICE : 0;
    const pct = SIBLING_PCT[Math.min(i, SIBLING_PCT.length - 1)];
    const disc = Math.round((base * pct) / 100);
    return {
      index: i,
      label: i === 0 ? 'Primary student' : `Sibling ${i}`,
      trackId,
      trackName: t?.name || '',
      basePrice: base,
      siblingPct: pct,
      siblingDiscount: disc,
      subtotal: Math.max(0, base - disc),
    };
  });
  const subtotal = students.reduce((s, x) => s + x.subtotal, 0);

  let couponAmount = 0;
  let couponLabel: string | null = null;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === 'percent') {
      couponAmount = Math.round((subtotal * coupon.discountValue) / 100);
      couponLabel = `${coupon.code} (-${coupon.discountValue}%)`;
    } else {
      couponAmount = Math.min(subtotal, coupon.discountValue);
      couponLabel = `${coupon.code} (-$${coupon.discountValue})`;
    }
  }
  return {
    students,
    subtotal,
    couponAmount,
    couponLabel,
    total: Math.max(0, subtotal - couponAmount),
  };
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialTrack = searchParams.get('track') || '';

  const [data, setData] = useState<Record<string, string>>(initialTrack ? { track: initialTrack } : {});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponState, setCouponState] = useState<'idle' | 'checking' | 'error'>('idle');
  const [couponError, setCouponError] = useState('');
  const [submittedFee, setSubmittedFee] = useState<{ total: number; coupon: string | null } | null>(null);
  const { showToast } = useToast();

  const sibCount = (() => {
    const v = data.siblings || '';
    if (v.startsWith('1 sibling')) return 1;
    if (v.startsWith('2 siblings')) return 2;
    if (v.startsWith('3+')) return 3;
    return 0;
  })();

  const siblingTracks = Array.from({ length: sibCount }, (_, i) => data[`sibling${i + 1}_track`] || '');
  const fee = useMemo(() => computeSummerFee(data.track || '', siblingTracks, coupon),
    [data.track, sibCount, JSON.stringify(siblingTracks), coupon]); // eslint-disable-line react-hooks/exhaustive-deps

  const countrySel = data.countrySelect || '';
  const isCountryOther = countrySel === OTHER_OPTION;
  const isUS = countrySel === US_COUNTRY;
  const stateSel = data.stateSelect || '';
  const isStateOther = stateSel === OTHER_OPTION;

  const clearCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError(''); setCouponState('idle'); };

  const applyCoupon = async () => {
    setCouponState('checking'); setCouponError('');
    // Use 'all' as planLabel — the lookupCoupon plan check is permissive when appliesTo is 'all'.
    const result = await lookupCoupon(couponInput, SUMMER_PROGRAM_ID, 'all');
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
    if (!data.track) { showToast('error', 'Please pick a track for the primary student.'); return; }
    setStatus('loading');

    const { countrySelect, stateSelect, countryOther, stateOther, ...clean } = data;
    void countrySelect; void stateSelect; void countryOther; void stateOther;
    Object.keys(clean).forEach((k) => {
      const m = k.match(/^sibling(\d+)_/);
      if (m && parseInt(m[1], 10) > sibCount) delete clean[k];
    });

    const payload: Record<string, string> = {
      program: 'Summer Coding Program 2026',
      programStart: '2026-06-29',
      ...clean,
    };
    if (data.dob) payload.age = String(calculateAge(data.dob));
    for (let i = 1; i <= sibCount; i++) {
      const dob = data[`sibling${i}_dob`];
      if (dob) payload[`sibling${i}_age`] = String(calculateAge(dob));
    }
    if (sibCount > 0) payload.siblingCount = String(sibCount);

    // Fee breakdown
    fee.students.forEach((s, i) => {
      const prefix = i === 0 ? 'student0' : `student${i}`;
      payload[`${prefix}_track`] = s.trackName;
      payload[`${prefix}_basePrice`] = String(s.basePrice);
      payload[`${prefix}_siblingPct`] = String(s.siblingPct);
      payload[`${prefix}_siblingDiscount`] = String(s.siblingDiscount);
      payload[`${prefix}_subtotal`] = String(s.subtotal);
    });
    payload.headlineDiscountPct = String(SUMMER_DISCOUNT_PCT);
    payload.basePerChild = String(SUMMER_BASE_PRICE);
    payload.pricePerChild = String(SUMMER_PRICE);
    payload.householdSubtotal = String(fee.subtotal);
    payload.couponCode = coupon?.code || '';
    payload.couponDiscountAmount = String(fee.couponAmount);
    payload.totalFee = String(fee.total);
    payload.feeSummary = `$${fee.total}${coupon ? ` (with coupon ${coupon.code})` : ''}`;

    const result = await submitForm('summer-coding', payload);
    if (result.success) {
      if (coupon) await incrementCouponUse(coupon.id);
      setSubmittedFee({ total: fee.total, coupon: fee.couponLabel });
      setStatus('success');
      showToast('success', "You're registered! We'll email cohort details within 48 hours.");
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  const reset = () => {
    setData({}); setStatus('idle'); clearCoupon(); setSubmittedFee(null);
  };

  const inputBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm bg-white';
  const selectBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-700 text-sm bg-white appearance-none';

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #1a0d2e 35%, #2a0d1f 70%, #070c1b 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[10%] w-[420px] h-[420px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[5%] right-[10%] w-[380px] h-[380px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <Link href="/summer-coding-2026"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[12px] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to overview
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-300/20 text-amber-200 text-[13px] mb-5 backdrop-blur-md">
            <Sun className="w-3.5 h-3.5 text-amber-300" /> Summer 2026 · June 29 Start
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Register Your <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300 bg-clip-text text-transparent">Child</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Two minutes to secure a seat. Sibling pricing computes live as you fill it out.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 30%, rgba(236,72,153,0.5) 50%, rgba(110,66,255,0.4) 70%, transparent 100%)' }} />
      </section>

      {/* FORM */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/30 via-white to-white">
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
                  Welcome to ScholarlyEcho Summer 2026. Our team will email cohort schedule, payment instructions, and onboarding links within 48 hours.
                </p>
                {submittedFee && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="max-w-md mx-auto mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 text-left shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700 text-[12px] font-bold uppercase tracking-[0.1em] mb-2">
                      <ShieldCheck className="w-4 h-4" /> Tuition Confirmed
                    </div>
                    <div className="text-slate-500 text-sm">Total summer tuition</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      ${submittedFee.total}
                    </div>
                    {submittedFee.coupon && <div className="text-xs text-emerald-600 mt-1 font-semibold">Coupon applied: {submittedFee.coupon}</div>}
                  </motion.div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)' }}>
                    Register Another <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/" className="btn-secondary">Back to Home</Link>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} className="space-y-5">

                {/* Track Picker */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Pick a track for your child *
                    </span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {TRACKS.map((t) => {
                      const Icon = t.icon;
                      const active = data.track === t.id;
                      return (
                        <motion.button key={t.id} type="button" whileTap={{ scale: 0.98 }}
                          onClick={() => setData({ ...data, track: t.id })}
                          className={`relative text-left rounded-2xl p-4 border-2 transition-all overflow-hidden ${active ? 'border-amber-400 bg-amber-50/60 shadow-md' : 'border-slate-200 bg-white hover:border-amber-200'}`}>
                          {active && <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.color}`} />}
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-[14px]">{t.name}</div>
                              <div className="text-[11px] font-bold text-amber-600">{t.age}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">$245 · 7 weeks · 2× per week</div>
                            </div>
                            {active && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute top-3 right-3" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Parent name */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Parent / Guardian Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" required value={data.parentName || ''}
                      onChange={(e) => setData({ ...data, parentName: e.target.value })}
                      placeholder="Full name" className={inputBase} />
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

                {/* Student name + DOB */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Student Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" required value={data.name || ''}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="Child's full name" className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Student Date of Birth *</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="date" required value={data.dob || ''}
                        onChange={(e) => setData({ ...data, dob: e.target.value })}
                        className={inputBase} />
                    </div>
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

                {/* Prior experience */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Prior Coding Experience</label>
                  <select value={data.priorExperience || ''} required
                    onChange={(e) => setData({ ...data, priorExperience: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-700 text-sm bg-white">
                    <option value="">Select...</option>
                    {['No prior experience', 'Some Scratch / block coding', 'A bit of Python or JavaScript', 'Built websites or small projects', 'Comfortable building real apps'].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Siblings selector */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Number of Children Enrolling</label>
                  <select value={data.siblings || ''} required
                    onChange={(e) => setData({ ...data, siblings: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-700 text-sm bg-white">
                    <option value="">Select...</option>
                    {SIBLING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>

                  {/* Sibling sub-forms */}
                  <AnimatePresence>
                    {sibCount > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
                        className="mt-4 space-y-3 overflow-hidden">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-600">
                          <Sparkles className="w-3 h-3" /> Sibling Details
                        </div>
                        {Array.from({ length: sibCount }).map((_, idx) => {
                          const n = idx + 1;
                          const discPct = SIBLING_PCT[Math.min(n, SIBLING_PCT.length - 1)];
                          return (
                            <motion.div key={n}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.06 }}
                              className="rounded-xl border-2 border-slate-100 bg-amber-50/40 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[12px] font-extrabold text-slate-700">Sibling {n}</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">extra {discPct}% off</span>
                              </div>
                              <div className="space-y-2.5">
                                <div className="relative">
                                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                  <input type="text" required value={data[`sibling${n}_name`] || ''}
                                    onChange={(e) => setData({ ...data, [`sibling${n}_name`]: e.target.value })}
                                    placeholder={`Sibling ${n} full name`}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 text-slate-800 placeholder:text-slate-300 text-[13px]" />
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <div className="relative">
                                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                                    <input type="date" required value={data[`sibling${n}_dob`] || ''}
                                      onChange={(e) => setData({ ...data, [`sibling${n}_dob`]: e.target.value })}
                                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 text-slate-800 text-[13px]" />
                                  </div>
                                  <select value={data[`sibling${n}_track`] || ''} required
                                    onChange={(e) => setData({ ...data, [`sibling${n}_track`]: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 text-slate-700 text-[13px]">
                                    <option value="">Pick track...</option>
                                    {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.age})</option>)}
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        {sibCount >= 3 && (
                          <p className="text-[11px] text-slate-400 italic px-1">For 4+ children, register the first three here — we&apos;ll follow up to capture the rest.</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* How heard */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">How did you hear about us?</label>
                  <select value={data.hearAbout || ''}
                    onChange={(e) => setData({ ...data, hearAbout: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-700 text-sm bg-white">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
                </div>

                {/* ─── Fee Summary + Coupon ─── */}
                <AnimatePresence>
                  {fee.subtotal > 0 && (
                    <motion.div key="fee"
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                      className="relative overflow-hidden rounded-2xl p-[1.5px]"
                      style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.7), rgba(236,72,153,0.7), rgba(110,66,255,0.7))' }}>
                      <div className="relative bg-white rounded-[14px] p-5">
                        <motion.div aria-hidden
                          initial={{ x: '-120%' }} animate={{ x: '120%' }}
                          transition={{ repeat: Infinity, repeatDelay: 4, duration: 2.4, ease: 'easeInOut' }}
                          className="pointer-events-none absolute inset-y-0 w-1/2"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.10), transparent)' }} />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-600 flex items-center justify-center shadow-sm">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Your Tuition</span>
                          </div>
                          <motion.div key={fee.total}
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                            className="text-right">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</div>
                            <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-pink-600 bg-clip-text text-transparent"
                              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              ${fee.total}
                            </div>
                          </motion.div>
                        </div>

                        {/* Headline saved row */}
                        <div className="mb-3 flex items-center justify-between text-[12px] px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 relative z-10">
                          <span className="flex items-center gap-1.5 font-semibold"><Percent className="w-3 h-3" /> 30% off already applied</span>
                          <span className="font-extrabold">${SUMMER_BASE_PRICE - SUMMER_PRICE}/child saved</span>
                        </div>

                        <div className="space-y-2.5 text-[13px] relative z-10">
                          {fee.students.map((s) => (
                            <motion.div key={s.index} layout
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              className="rounded-lg bg-slate-50/70 px-3 py-2.5 border border-slate-100">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold flex-shrink-0 ${s.index === 0 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {s.index + 1}
                                  </span>
                                  <span className="font-bold text-slate-700 text-[12px] truncate">{s.label}</span>
                                </div>
                                {s.basePrice > 0 ? (
                                  <span className="font-extrabold text-slate-900 text-[13px]">${s.subtotal}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pick track</span>
                                )}
                              </div>
                              {s.basePrice > 0 && (
                                <div className="flex items-center justify-between text-[11px] text-slate-400 pl-7">
                                  <span className="truncate pr-2">{s.trackName} · ${s.basePrice}</span>
                                  {s.siblingDiscount > 0 && (
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1 flex-shrink-0">
                                      <Percent className="w-2.5 h-2.5" /> {s.siblingPct}% off · −${s.siblingDiscount}
                                    </span>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                          {fee.students.length > 1 && (
                            <div className="flex justify-between text-slate-600 pt-1.5 border-t border-slate-100">
                              <span>Household subtotal</span>
                              <span className="font-semibold text-slate-700">${fee.subtotal}</span>
                            </div>
                          )}
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
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-amber-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[13px] font-mono tracking-wider uppercase" />
                                </div>
                                <motion.button type="button" onClick={applyCoupon}
                                  disabled={!couponInput.trim() || couponState === 'checking'}
                                  whileTap={{ scale: 0.96 }}
                                  className="px-4 py-2.5 rounded-lg text-white text-[12px] font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
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
                  )}
                </AnimatePresence>

                {/* What you get reminder */}
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-100 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-700 mb-2 flex items-center gap-1.5">
                    <Gift className="w-3 h-3" /> Every seat includes
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-700">
                    {[
                      { i: Calendar, t: '2× weekly live sessions' },
                      { i: Trophy, t: 'Capstone project' },
                      { i: Award, t: 'Official certificate' },
                      { i: Rocket, t: 'Demo Day + prizes' },
                    ].map(({ i: Icon, t }) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button type="submit" disabled={status === 'loading'}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full py-4 rounded-xl font-extrabold text-white text-[15px] shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)', boxShadow: '0 8px 32px rgba(245,158,11,0.45)' }}>
                  <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
                  {status === 'loading'
                    ? <Loader2 className="w-5 h-5 animate-spin relative" />
                    : <><Rocket className="w-4 h-4 relative" /><span className="relative">Reserve My Seat{fee.subtotal > 0 ? ` · $${fee.total}` : ''}</span> <ArrowRight className="w-4 h-4 relative" /></>}
                </motion.button>

                <p className="text-center text-[11px] text-slate-400">
                  By registering you agree to our{' '}
                  <Link href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link> ·{' '}
                  <Link href="/terms" className="text-amber-600 hover:underline">Terms</Link>.
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

export default function SummerRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
