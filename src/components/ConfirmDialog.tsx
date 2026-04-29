'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';

type Tone = 'danger' | 'warning' | 'info';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  itemName?: string;        // shows in a highlighted chip — e.g. coupon code, program name
  requireTyping?: string;   // user must type this string to enable confirm
};

type Pending = ConfirmOptions & {
  resolve: (v: boolean) => void;
};

const ConfirmContext = createContext<{
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}>({ confirm: async () => false });

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [typed, setTyped] = useState('');
  const [working, setWorking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setTyped('');
      setWorking(false);
      setPending({ ...opts, resolve });
    });
  }, []);

  const close = (result: boolean) => {
    if (!pending) return;
    pending.resolve(result);
    setPending(null);
    setTyped('');
    setWorking(false);
  };

  // Esc to cancel; focus the typed input when present.
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter' && canConfirm()) close(true);
    };
    window.addEventListener('keydown', onKey);
    if (pending.requireTyping) setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, typed]);

  const canConfirm = () => {
    if (!pending) return false;
    if (pending.requireTyping) return typed.trim() === pending.requireTyping;
    return true;
  };

  const tone: Tone = pending?.tone || 'danger';
  const toneStyles = {
    danger: {
      ring: 'from-rose-500 via-rose-400 to-orange-400',
      iconBg: 'from-rose-500 to-rose-600',
      iconHalo: 'bg-rose-100',
      btn: 'from-rose-500 to-rose-600 hover:shadow-rose-500/30',
      chip: 'bg-rose-50 text-rose-700 border-rose-100',
      Icon: Trash2,
    },
    warning: {
      ring: 'from-amber-500 via-amber-400 to-orange-400',
      iconBg: 'from-amber-500 to-orange-500',
      iconHalo: 'bg-amber-100',
      btn: 'from-amber-500 to-orange-500 hover:shadow-amber-500/30',
      chip: 'bg-amber-50 text-amber-700 border-amber-100',
      Icon: AlertTriangle,
    },
    info: {
      ring: 'from-brand-500 via-purple-500 to-pink-500',
      iconBg: 'from-brand-500 to-purple-600',
      iconHalo: 'bg-brand-100',
      btn: 'from-brand-500 to-purple-600 hover:shadow-brand-500/30',
      chip: 'bg-brand-50 text-brand-700 border-brand-100',
      Icon: AlertTriangle,
    },
  }[tone];

  const Icon = toneStyles.Icon;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {pending && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !working && close(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]" />

            {/* Dialog */}
            <div className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="relative w-full max-w-md pointer-events-auto rounded-3xl p-[1.5px] overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                {/* gradient ring backdrop */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${toneStyles.ring} opacity-60`} />

                <div className="relative bg-white rounded-[22px] p-7">
                  {/* Close */}
                  <button
                    onClick={() => !working && close(false)}
                    aria-label="Cancel"
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>

                  {/* Icon */}
                  <div className="relative w-fit mx-auto mb-5">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.05 }}
                      className={`absolute inset-0 ${toneStyles.iconHalo} rounded-3xl blur-xl opacity-70`} />
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                      className={`relative w-16 h-16 rounded-3xl bg-gradient-to-br ${toneStyles.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-center text-[19px] font-extrabold text-slate-900 tracking-tight"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {pending.title || 'Are you sure?'}
                  </motion.h3>

                  {/* Item chip */}
                  {pending.itemName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.13 }}
                      className="flex justify-center mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border ${toneStyles.chip} max-w-full`}>
                        <span className="truncate max-w-[260px]">{pending.itemName}</span>
                      </span>
                    </motion.div>
                  )}

                  {/* Description */}
                  {pending.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="text-center text-slate-500 text-[14px] leading-relaxed mt-3 max-w-sm mx-auto">
                      {pending.description}
                    </motion.p>
                  )}

                  {/* Type-to-confirm */}
                  {pending.requireTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="mt-5">
                      <label className="block text-center text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">
                        Type <span className="font-mono text-slate-700">{pending.requireTyping}</span> to confirm
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        className="w-full text-center font-mono tracking-wider px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-rose-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px] uppercase"
                        placeholder={pending.requireTyping}
                        autoComplete="off" />
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                    className="flex gap-3 mt-6">
                    <button
                      onClick={() => !working && close(false)}
                      disabled={working}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-colors disabled:opacity-50">
                      {pending.cancelLabel || 'Cancel'}
                    </button>
                    <motion.button
                      onClick={() => {
                        if (!canConfirm() || working) return;
                        setWorking(true);
                        // Resolve immediately; caller handles its async work.
                        close(true);
                      }}
                      disabled={!canConfirm() || working}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 px-4 py-3 rounded-xl text-white text-[13px] font-bold bg-gradient-to-r ${toneStyles.btn} shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2`}>
                      {working ? <Loader2 className="w-4 h-4 animate-spin" /> : (pending.confirmLabel || 'Delete')}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
