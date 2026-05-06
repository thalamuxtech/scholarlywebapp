'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sun, Video, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';

const STORAGE_KEY = 'se_summer_flyer_2026_dismissed';
const INFO_SESSION_DATE_ISO = '2026-05-23';
const INFO_SESSION_LABEL = 'May 23, 2026';

type Props = {
  /** When true, popup is controlled externally (no auto-show, no localStorage dismissal). */
  controlled?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export default function SummerFlyerPopup({ controlled = false, open: openProp, onClose }: Props = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? !!openProp : internalOpen;
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [rsvpError, setRsvpError] = useState('');

  const submitInfoSessionRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEmail.trim()) return;
    setRsvpStatus('loading');
    setRsvpError('');
    const result = await submitForm('info-session', {
      name: rsvpName.trim(),
      email: rsvpEmail.trim(),
      infoSessionDate: INFO_SESSION_DATE_ISO,
      source: 'summer-flyer-popup',
    });
    if (result.success) {
      setRsvpStatus('success');
    } else {
      setRsvpStatus('error');
      setRsvpError(result.error || 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (controlled) return;
    if (typeof window === 'undefined') return;
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (dismissed) return;
    } catch { /* localStorage may be blocked: fall through */ }

    // Slight delay so it doesn't fight the page-load paint.
    const t = window.setTimeout(() => setInternalOpen(true), 1100);
    return () => window.clearTimeout(t);
  }, [controlled]);

  const close = () => {
    if (controlled) {
      onClose?.();
      return;
    }
    setInternalOpen(false);
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          aria-modal="true" role="dialog" aria-labelledby="summer-flyer-title"
          onClick={close}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] sm:max-w-[460px] max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-3xl shadow-2xl">

            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[2px]"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #6e42ff)' }}>
              <div className="absolute inset-[2px] rounded-[22px] bg-white" />
            </div>

            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center transition-all hover:scale-105 backdrop-blur">
              <X className="w-4 h-4" />
            </button>

            {/* Eyebrow */}
            <div className="relative z-10 px-5 pt-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-300/30 text-amber-700 text-[11px] font-bold backdrop-blur">
                <Sun className="w-3 h-3" /> Summer Bootcamp 2026
              </div>
            </div>

            {/* Flyer image (clickable) */}
            <Link href="/summer-coding-2026" onClick={close}
              className="relative z-10 block mt-3 mx-3 rounded-2xl overflow-hidden group">
              <Image
                src="/summer-bootcamp-2026.png"
                alt="ScholarlyEcho Summer Coding Bootcamp 2026: June 29 start, Logic Builders 5+ and Code Masters 9+"
                width={1200}
                height={1500}
                priority
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* Shimmer */}
              <motion.div aria-hidden
                initial={{ x: '-120%' }} animate={{ x: '120%' }}
                transition={{ repeat: Infinity, repeatDelay: 5, duration: 2.4, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 w-1/3"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />
            </Link>

            {/* CTA */}
            <div className="relative z-10 px-5 py-4 sm:py-5">
              <Link href="/summer-coding-2026" onClick={close}
                className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-extrabold text-white shadow-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)', boxShadow: '0 8px 28px rgba(245,158,11,0.45)' }}>
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                <span className="relative">View Summer Camp Details</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={close}
                className="block mx-auto mt-2 text-[11px] text-slate-400 hover:text-slate-600 font-semibold transition-colors">
                Maybe later
              </button>
            </div>

            {/* Info session RSVP */}
            <div className="relative z-10 mx-3 mb-4 rounded-2xl border-2 border-brand-100 bg-gradient-to-br from-brand-50/60 via-white to-purple-50/40 p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Video className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-extrabold text-slate-800 text-[13px]">Free Info Session</span>
                <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 text-[10px] font-extrabold uppercase tracking-wider">{INFO_SESSION_LABEL}</span>
              </div>
              <p className="text-[11.5px] text-slate-500 leading-relaxed mb-3">
                Not ready to sign up yet? Join our live info session — meet the instructors and get all your questions answered.
              </p>

              {rsvpStatus === 'success' ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] font-bold text-emerald-700">You&apos;re on the list! Check your email for the reminder.</span>
                </div>
              ) : (
                <form onSubmit={submitInfoSessionRsvp} className="space-y-2">
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[12.5px]"
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input
                        type="email"
                        required
                        value={rsvpEmail}
                        onChange={(e) => { setRsvpEmail(e.target.value); setRsvpError(''); }}
                        placeholder="your@email.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[12.5px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={rsvpStatus === 'loading' || !rsvpEmail.trim()}
                      className="px-4 py-2.5 rounded-lg text-white text-[12px] font-extrabold shadow-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                      style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
                      {rsvpStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Remind Me'}
                    </button>
                  </div>
                  {rsvpError && (
                    <p className="text-[11px] text-rose-500 font-medium ml-1">{rsvpError}</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
