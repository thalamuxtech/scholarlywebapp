'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Loader2, CheckCircle2, Mail, Calendar, Clock } from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';

const DEFAULT_DATE_ISO = '2026-05-23';

function formatDateLabel(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const idx = parseInt(m[2], 10) - 1;
  return `${months[idx] || m[2]} ${parseInt(m[3], 10)}, ${m[1]}`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  source?: string;
  /** ISO date (YYYY-MM-DD). Defaults to 2026-05-23 (the original Summer Coding info session). */
  dateIso?: string;
  /** Free-text time label, e.g. '4:00 PM WAT · 11:00 AM EST'. */
  timeLabel?: string;
  /** Event name to mention in the popup body. Defaults to a generic line. */
  eventName?: string;
};

export default function InfoSessionPopup({ open, onClose, source = 'info-session-popup', dateIso, timeLabel, eventName }: Props) {
  const effectiveDateIso = dateIso || DEFAULT_DATE_ISO;
  const dateLabel = formatDateLabel(effectiveDateIso);
  const showTime = !!timeLabel;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setError('');
    const result = await submitForm('info-session', {
      name: name.trim(),
      email: email.trim(),
      infoSessionDate: effectiveDateIso,
      ...(eventName ? { eventName } : {}),
      source,
    });
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          aria-modal="true" role="dialog"
          onClick={onClose}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[440px] overflow-hidden rounded-3xl shadow-2xl bg-white">

            {/* Gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899, #f59e0b)' }}>
              <div className="absolute inset-[2px] rounded-[22px] bg-white" />
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center transition-all">
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-4 shadow-md">
                <Video className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1.5"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Free Info Session
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {eventName
                  ? `Meet the team, see what's in store, and ask anything about ${eventName}.`
                  : 'Meet the team, see what’s in store, and ask any questions before you commit.'}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-[11.5px] font-bold">
                  <Calendar className="w-3.5 h-3.5" /> {dateLabel}
                </span>
                {showTime && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[11.5px] font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {timeLabel}
                  </span>
                )}
              </div>

              {status === 'success' ? (
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-extrabold text-emerald-700 mb-0.5">You&apos;re on the list!</div>
                    <div className="text-[12px] text-emerald-600/90 leading-relaxed">We&apos;ll email you the join link before the session.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-2.5">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[13px]"
                  />
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[13px]"
                    />
                  </div>
                  {error && (
                    <p className="text-[11.5px] text-rose-500 font-medium px-1">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email.trim()}
                    className="w-full py-3.5 rounded-xl text-white text-[13.5px] font-extrabold shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899, #f59e0b)' }}>
                    {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save My Spot'}
                  </button>
                  <p className="text-[10.5px] text-slate-400 text-center pt-1">
                    No spam. We&apos;ll only email about this session.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
