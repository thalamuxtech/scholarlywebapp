'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/Toast';
import {
  Tag, Plus, X, Trash2, Copy, CheckCircle2, AlertCircle,
  Percent, DollarSign, Calendar, Power, PowerOff, Sparkles, Loader2
} from 'lucide-react';
import { PLAN_CATALOG, type Coupon } from '@/lib/coupons';

const PROGRAMS = [
  { id: 'learning-hub', label: 'Learning Hub' },
  { id: 'code-prodigy', label: 'Code Prodigy' },
  { id: 'inspire-media', label: 'Inspire Media' },
  { id: 'ai-assessment', label: 'AI Assessment' },
];

function genCode(len = 8) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '20',
    appliesTo: ['all'] as string[],
    programs: ['learning-hub'] as string[],
    maxUses: '',
    expiresAt: '',
  });

  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'coupons'), orderBy('createdAt', 'desc')),
      (s) => setCoupons(s.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon))));
    return () => u();
  }, []);

  const reset = () => {
    setShowCreate(false);
    setForm({ code: '', description: '', discountType: 'percent', discountValue: '20', appliesTo: ['all'], programs: ['learning-hub'], maxUses: '', expiresAt: '' });
  };

  const create = async () => {
    const code = (form.code.trim() || genCode()).toUpperCase();
    const value = parseFloat(form.discountValue);
    if (!value || value <= 0) { showToast('error', 'Enter a valid discount value.'); return; }
    if (form.discountType === 'percent' && value > 100) { showToast('error', 'Percent discount cannot exceed 100.'); return; }
    if (!form.programs.length) { showToast('error', 'Select at least one program.'); return; }
    setCreating(true);
    try {
      await addDoc(collection(db, 'coupons'), {
        code,
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: value,
        appliesTo: form.appliesTo.length ? form.appliesTo : ['all'],
        programs: form.programs,
        active: true,
        uses: 0,
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
        expiresAt: form.expiresAt || null,
        createdAt: serverTimestamp(),
      });
      showToast('success', `Coupon ${code} created.`);
      reset();
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to create coupon.');
    }
    setCreating(false);
  };

  const toggle = async (c: Coupon) => {
    await updateDoc(doc(db, 'coupons', c.id), { active: !c.active });
    showToast('success', `Coupon ${!c.active ? 'activated' : 'deactivated'}.`);
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`Delete coupon ${c.code}? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'coupons', c.id));
    showToast('success', 'Coupon deleted.');
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      showToast('error', 'Could not copy to clipboard.');
    }
  };

  const togglePlan = (id: string) => {
    setForm((f) => {
      if (id === 'all') return { ...f, appliesTo: ['all'] };
      const without = f.appliesTo.filter((x) => x !== 'all');
      const next = without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
      return { ...f, appliesTo: next.length ? next : ['all'] };
    });
  };

  const toggleProgram = (id: string) => {
    setForm((f) => {
      const next = f.programs.includes(id) ? f.programs.filter((x) => x !== id) : [...f.programs, id];
      return { ...f, programs: next };
    });
  };

  const isExpired = (c: Coupon) => c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
  const isExhausted = (c: Coupon) => c.maxUses && c.uses >= c.maxUses;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Coupons</h2>
          <p className="text-slate-400 text-sm mt-1">Generate discount codes for active programs.</p>
        </div>
        <motion.button onClick={() => setShowCreate(true)} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white text-[13px] font-bold shadow-sm hover:shadow-md transition-all">
          <Plus className="w-4 h-4" /> New Coupon
        </motion.button>
      </div>

      {/* List */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
          <Tag className="w-10 h-10 mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No coupons yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c, i) => {
            const expired = isExpired(c);
            const exhausted = isExhausted(c);
            const inactive = !c.active || expired || exhausted;
            return (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`relative rounded-2xl p-[1.5px] overflow-hidden ${inactive ? 'opacity-60' : ''}`}
                style={{ background: inactive ? '#e2e8f0' : 'linear-gradient(135deg, rgba(110,66,255,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6))' }}>
                <div className="bg-white rounded-[14px] p-5 relative">
                  {/* Ticket notches */}
                  <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#f5f6fa]" />
                  <div className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#f5f6fa]" />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.discountType === 'percent' ? 'bg-gradient-to-br from-brand-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                        {c.discountType === 'percent' ? <Percent className="w-4 h-4 text-white" /> : <DollarSign className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <div className="text-[18px] font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`} off
                        </div>
                        {c.description && <div className="text-[11px] text-slate-400 line-clamp-1">{c.description}</div>}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      expired ? 'bg-rose-50 text-rose-500' :
                      exhausted ? 'bg-amber-50 text-amber-600' :
                      c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {expired ? 'EXPIRED' : exhausted ? 'USED UP' : c.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  {/* Code */}
                  <button onClick={() => copyCode(c.code)}
                    className="w-full group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors mb-3">
                    <span className="font-mono font-bold tracking-[0.18em] text-slate-700 text-[14px]">{c.code}</span>
                    {copied === c.code ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 text-[11px] text-slate-400 mb-3">
                    <div>Programs: <span className="text-slate-600 font-medium">{c.programs?.includes('all') ? 'All' : (c.programs || []).map((p) => PROGRAMS.find((x) => x.id === p)?.label || p).join(', ')}</span></div>
                    <div>Plans: <span className="text-slate-600 font-medium">{c.appliesTo?.includes('all') ? 'All' : (c.appliesTo || []).join(', ')}</span></div>
                    <div className="flex items-center gap-3">
                      <span>Uses: <span className="text-slate-600 font-medium">{c.uses || 0}{c.maxUses ? `/${c.maxUses}` : ''}</span></span>
                      {c.expiresAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button onClick={() => toggle(c)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                      {c.active ? <><PowerOff className="w-3 h-3" /> Disable</> : <><Power className="w-3 h-3" /> Enable</>}
                    </button>
                    <button onClick={() => remove(c)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={reset}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <h3 className="text-[15px] font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>New Coupon</h3>
                  </div>
                  <button onClick={reset} className="text-slate-300 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Code */}
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Code <span className="text-slate-300 font-normal">(leave blank to auto-generate)</span></label>
                    <div className="flex gap-2">
                      <input type="text" value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        placeholder="SUMMER25"
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[13px] font-mono tracking-wider" />
                      <button type="button" onClick={() => setForm({ ...form, code: genCode() })}
                        className="px-3 py-2.5 rounded-lg border-2 border-slate-200 hover:border-brand-300 text-[12px] font-semibold text-slate-500 hover:text-brand-600 transition-colors">
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Description <span className="text-slate-300 font-normal">(internal note)</span></label>
                    <input type="text" value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Summer 2026 promotion"
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[13px]" />
                  </div>

                  {/* Discount type + value */}
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Discount</label>
                    <div className="flex gap-2">
                      <div className="flex rounded-lg overflow-hidden border-2 border-slate-200">
                        <button type="button" onClick={() => setForm({ ...form, discountType: 'percent' })}
                          className={`px-3 py-2.5 text-[12px] font-bold transition-colors ${form.discountType === 'percent' ? 'bg-brand-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                          <Percent className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setForm({ ...form, discountType: 'fixed' })}
                          className={`px-3 py-2.5 text-[12px] font-bold transition-colors border-l-2 border-slate-200 ${form.discountType === 'fixed' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input type="number" min="1" value={form.discountValue}
                        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 text-slate-800 text-[13px]" />
                      <span className="self-center text-[12px] font-bold text-slate-400 px-1">{form.discountType === 'percent' ? '% off' : 'USD off'}</span>
                    </div>
                  </div>

                  {/* Programs */}
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Applies to programs</label>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAMS.map((p) => {
                        const sel = form.programs.includes(p.id);
                        return (
                          <button type="button" key={p.id} onClick={() => toggleProgram(p.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all ${sel ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-500 border-slate-200 hover:border-brand-300'}`}>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plans */}
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Applies to pricing plans</label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => togglePlan('all')}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all ${form.appliesTo.includes('all') ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300'}`}>
                        All plans
                      </button>
                      {PLAN_CATALOG.map((p) => {
                        const sel = form.appliesTo.includes(p.id);
                        return (
                          <button type="button" key={p.id} onClick={() => togglePlan(p.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all ${sel ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-500 border-slate-200 hover:border-brand-300'}`}>
                            {p.id} (${p.price})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Max uses</label>
                      <input type="number" min="1" value={form.maxUses}
                        onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                        placeholder="Unlimited"
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 text-slate-800 placeholder:text-slate-300 text-[13px]" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Expires on</label>
                      <input type="date" value={form.expiresAt}
                        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-brand-400 text-slate-800 text-[13px]" />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <p>Coupons are applied at enrollment. Share the code with applicants — they enter it during checkout.</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                  <button onClick={reset}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <motion.button onClick={create} disabled={creating}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white text-[13px] font-bold shadow-sm hover:shadow-md disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Create Coupon</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
