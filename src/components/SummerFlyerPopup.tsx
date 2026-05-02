'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sun } from 'lucide-react';

const STORAGE_KEY = 'se_summer_flyer_2026_dismissed';

export default function SummerFlyerPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (dismissed) return;
    } catch { /* localStorage may be blocked: fall through */ }

    // Slight delay so it doesn't fight the page-load paint.
    const t = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
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
            className="relative w-full max-w-[420px] sm:max-w-[460px] max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl">

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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
