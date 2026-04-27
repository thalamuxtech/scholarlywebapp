'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Loader2,
  CheckCircle2, ArrowRight, Sparkles, X, Calendar, HelpCircle,
  Clock, MessageCircle, BookOpen
} from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { COUNTRIES, US_STATES, US_COUNTRY, OTHER_OPTION } from '@/lib/locations';

const URGENCY_OPTIONS = [
  'Immediately (this week)',
  'Within 1 week',
  'This month',
  'Next month',
  'Just exploring',
];

const DAY_OPTIONS = ['Weekdays', 'Weekends', 'Any day'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];

const PROGRAM_OPTIONS = [
  'Weekend Coding',
  'Summer Program',
  'Help me choose',
];

const HEAR_OPTIONS = [
  'Google search',
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'WhatsApp / Friend referral',
  'Parent / Family referral',
  'School / Teacher',
  'Event or workshop',
  'Podcast or news article',
  'Other',
];

type Status = 'idle' | 'loading' | 'success';

export type FreeTrialFormProps = {
  variant?: 'card' | 'modal';
  onClose?: () => void;
  compact?: boolean;
};

export default function FreeTrialForm({ variant = 'card', onClose, compact = false }: FreeTrialFormProps) {
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const { showToast } = useToast();

  const countrySel = data.countrySelect || '';
  const isCountryOther = countrySel === OTHER_OPTION;
  const isUS = countrySel === US_COUNTRY;
  const stateSel = data.stateSelect || '';
  const isStateOther = stateSel === OTHER_OPTION;

  const toggle = (key: string, value: string) => {
    const current = (data[key] || '').split(',').filter(Boolean);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setData({ ...data, [key]: next.join(',') });
  };
  const has = (key: string, value: string) => (data[key] || '').split(',').includes(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.contactPreference) {
      showToast('error', 'Please select how we can contact you.');
      return;
    }
    if (!data.availableDays) {
      showToast('error', 'Please pick at least one available day.');
      return;
    }
    if (!data.availableTimes) {
      showToast('error', 'Please pick at least one time of day.');
      return;
    }
    setStatus('loading');
    const { countrySelect, stateSelect, countryOther, stateOther, ...clean } = data;
    void countrySelect; void stateSelect; void countryOther; void stateOther;
    const payload: Record<string, string> = { ...clean, program: 'Free Trial / Assessment Class' };
    const result = await submitForm('free-trial', payload);
    if (result.success) {
      setStatus('success');
      showToast('success', "You're booked! We'll email your free class details within 24 hours.");
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  const reset = () => {
    setData({});
    setStatus('idle');
  };

  const inputBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm bg-white';

  const Form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Parent name */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Parent / Guardian Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" required value={data.parentName || ''}
            onChange={(e) => setData({ ...data, parentName: e.target.value })}
            placeholder="Full name" className={inputBase} />
        </div>
      </div>

      <div className={compact ? '' : 'grid sm:grid-cols-2 gap-4'}>
        {/* Email */}
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="email" required value={data.email || ''}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="your@email.com" className={inputBase} />
          </div>
        </div>
        {/* Phone */}
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone (WhatsApp preferred)</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="tel" required value={data.phone || ''}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="+1 234 567 8900" className={inputBase} />
          </div>
        </div>
      </div>

      {/* Student DOB */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Student&apos;s Date of Birth</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="date" required value={data.studentDob || ''}
            onChange={(e) => setData({ ...data, studentDob: e.target.value })}
            className={inputBase} />
        </div>
      </div>

      {/* Country & State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Country</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <select value={countrySel} required
              onChange={(e) => {
                const v = e.target.value;
                setData({
                  ...data,
                  countrySelect: v,
                  country: v === OTHER_OPTION ? (data.countryOther || '') : v,
                  stateSelect: '', state: '', stateOther: '',
                });
              }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none">
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value={OTHER_OPTION}>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">State / Region</label>
          {isUS ? (
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              <select value={stateSel} required
                onChange={(e) => {
                  const v = e.target.value;
                  setData({
                    ...data,
                    stateSelect: v,
                    state: v === OTHER_OPTION ? (data.stateOther || '') : v,
                  });
                }}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none">
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

      {/* Program of Intent */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Program of Intent</label>
        <div className="relative">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
          <select required value={data.programIntent || ''}
            onChange={(e) => setData({ ...data, programIntent: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none">
            <option value="">Select a program...</option>
            {PROGRAM_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* How did you find us */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">How did you find us?</label>
        <div className="relative">
          <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
          <select required value={data.hearAbout || ''}
            onChange={(e) => setData({ ...data, hearAbout: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none">
            <option value="">Select an option...</option>
            {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Contact preference */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
            How can we contact you?
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Email', 'Phone', 'Both'].map((opt) => {
            const active = has('contactPreference', opt);
            return (
              <label key={opt}
                className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all select-none ${
                  active
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}>
                <input type="checkbox" className="sr-only"
                  checked={active}
                  onChange={() => {
                    if (opt === 'Both') {
                      const turningOn = !active;
                      setData({ ...data, contactPreference: turningOn ? 'Email,Phone,Both' : '' });
                    } else {
                      toggle('contactPreference', opt);
                      const next = (data.contactPreference || '').split(',').filter(Boolean);
                      const set = new Set(next.includes(opt) ? next.filter((v) => v !== opt) : [...next, opt]);
                      if (set.has('Email') && set.has('Phone')) set.add('Both'); else set.delete('Both');
                      setData({ ...data, contactPreference: Array.from(set).join(',') });
                    }
                  }} />
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                  {active && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                {opt}
              </label>
            );
          })}
        </div>
      </div>

      {/* Urgency / when */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            When are you hoping to start?
          </span>
        </label>
        <div className="relative">
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
          <select required value={data.urgency || ''}
            onChange={(e) => setData({ ...data, urgency: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white appearance-none">
            <option value="">Select timing...</option>
            {URGENCY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Availability — days */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">Which days work for you?</label>
        <div className="grid grid-cols-3 gap-2">
          {DAY_OPTIONS.map((opt) => {
            const active = has('availableDays', opt);
            return (
              <button key={opt} type="button"
                onClick={() => toggle('availableDays', opt)}
                className={`px-3 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all ${
                  active
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability — time of day */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">What time of day?</label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_OPTIONS.map((opt) => {
            const active = has('availableTimes', opt);
            return (
              <button key={opt} type="button"
                onClick={() => toggle('availableTimes', opt)}
                className={`px-3 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all ${
                  active
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust / reassurance */}
      <div className="flex items-center gap-2 text-[12px] text-slate-500 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        100% free · No credit card · No obligation · Private 1-on-1 assessment
      </div>

      <motion.button type="submit" disabled={status === 'loading'}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-white text-[15px] gradient-bg shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5"
        style={{ boxShadow: '0 8px 32px rgba(110,66,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
        {status === 'loading'
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <>Reserve My Free Class <ArrowRight className="w-4 h-4" /></>}
      </motion.button>
    </form>
  );

  const Success = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </motion.div>
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2.5"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        You&apos;re booked! 🎉
      </h3>
      <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto leading-relaxed">
        Our admissions team will reach out within 24 hours to confirm your FREE no-obligation assessment class and match your child with the right mentor.
      </p>
      <button onClick={reset} className="btn-secondary text-sm">
        Book Another Class <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );

  const Header = (
    <div className="relative mb-6">
      {variant === 'modal' && onClose && (
        <button type="button" onClick={onClose}
          className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          aria-label="Close">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      )}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-3 border border-emerald-100">
        <Sparkles className="w-3 h-3" /> 100% FREE · No Credit Card Needed
      </div>
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight tracking-[-0.02em] mb-2"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Schedule Your FREE <span className="gradient-text">No-Obligation</span> Assessment Class
      </h3>
      <p className="text-slate-500 text-[13px] leading-relaxed">
        Meet a certified mentor, get a personalized skill pathway, and see why learners from 20+ countries love ScholarlyEcho — at zero cost.
      </p>
    </div>
  );

  return (
    <div className={variant === 'modal'
      ? 'bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative'
      : 'bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative'}>
      {Header}
      <AnimatePresence mode="wait">
        {status === 'success'
          ? <div key="s">{Success}</div>
          : <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{Form}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

export function FreeTrialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}>
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl"
            onClick={(e) => e.stopPropagation()}>
            <FreeTrialForm variant="modal" onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
