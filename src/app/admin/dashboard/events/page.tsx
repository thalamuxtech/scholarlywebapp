'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import {
  Calendar, Plus, X, Trash2, ArrowRight, Loader2, Pencil,
  ChevronDown, ChevronUp, Sparkles, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';
import ComboInput from '@/components/ComboInput';
import { SEED_EVENTS } from '@/lib/eventsSeed';

type EventDoc = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: string;
  category?: string;
  kind?: string;
  eventDate?: string;
  time?: string;
  location?: string;
  seats?: string;
  price?: string;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
  registrationFeeType?: string;
  registrationFeeAmount?: string;
  prizes?: string;
  infoSessionEnabled?: boolean;
  infoSessionDate?: string;
  infoSessionTime?: string;
  hidden?: boolean;
  createdAt?: any;
};

const CATEGORIES = [
  'Learning Hub',
  'Spotlight Media',
  'Code Prodigy',
  'Edutainment',
  'Community',
  'Hackathon',
  'Competition',
  'Workshop',
  'Bootcamp',
  'Conference',
  'Accelerator',
];
const KINDS = [
  { value: 'program', label: 'Program' },
  { value: 'event', label: 'Event' },
];

const EMPTY = {
  name: '', description: '', startDate: '', status: 'upcoming', category: 'Learning Hub', kind: 'event',
  eventDate: '', time: '', location: '', seats: '', price: '', badge: '', ctaHref: '', ctaLabel: '',
  registrationFeeType: 'free', registrationFeeAmount: '', prizes: '',
  infoSessionEnabled: false, infoSessionDate: '', infoSessionTime: '',
  hidden: false,
};

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<EventDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [showOptional, setShowOptional] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterKind, setFilterKind] = useState<'all' | 'program' | 'event'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all');
  const { isAdmin } = useRole();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const seededRef = useRef(false);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventDoc, 'id'>) })));
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // Auto-seed missing entries on load (idempotent: matches existing docs by name).
  useEffect(() => {
    if (!loaded || seededRef.current) return;
    seededRef.current = true;
    (async () => {
      const snap = await getDocs(collection(db, 'events'));
      const existingNames = new Set(snap.docs.map((d) => (d.data() as { name?: string }).name).filter(Boolean));
      const missing = SEED_EVENTS.filter((s) => !existingNames.has(s.name));
      if (missing.length === 0) return;
      for (const seed of missing) {
        await addDoc(collection(db, 'events'), { ...seed, createdAt: serverTimestamp() });
      }
      showToast('success', `Imported ${missing.length} new entr${missing.length === 1 ? 'y' : 'ies'}.`);
    })().catch((err) => console.error('Auto-seed failed:', err));
  }, [loaded, showToast]);

  const closeModal = () => { setShowCreate(false); setEditing(null); setForm({ ...EMPTY }); setShowOptional(false); };

  const startEdit = (e: EventDoc) => {
    setEditing(e);
    setForm({
      name: e.name,
      description: e.description || '',
      startDate: e.startDate || '',
      status: e.status || 'upcoming',
      category: e.category || 'Learning Hub',
      kind: e.kind || 'event',
      eventDate: e.eventDate || '',
      time: e.time || '',
      location: e.location || '',
      seats: e.seats || '',
      price: e.price || '',
      badge: e.badge || '',
      ctaHref: e.ctaHref || '',
      ctaLabel: e.ctaLabel || '',
      registrationFeeType: e.registrationFeeType || 'free',
      registrationFeeAmount: e.registrationFeeAmount || '',
      prizes: e.prizes || '',
      infoSessionEnabled: !!e.infoSessionEnabled,
      infoSessionDate: e.infoSessionDate || '',
      infoSessionTime: e.infoSessionTime || '',
      hidden: !!e.hidden,
    });
    const hasOptional = !!(e.eventDate || e.time || e.location || e.seats || e.price || e.badge || e.ctaHref || e.ctaLabel || e.registrationFeeType === 'paid' || e.prizes || e.infoSessionEnabled);
    setShowOptional(hasOptional);
    setShowCreate(true);
  };

  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    const payload = { ...form };
    if (editing) await updateDoc(doc(db, 'events', editing.id), payload);
    else await addDoc(collection(db, 'events'), { ...payload, createdAt: serverTimestamp() });
    setSaving(false);
    closeModal();
    showToast('success', editing ? 'Event updated.' : 'Event created.');
  };

  const toggleHidden = async (e: EventDoc) => {
    const next = !e.hidden;
    await updateDoc(doc(db, 'events', e.id), { hidden: next });
    showToast('success', next ? 'Hidden from public site.' : 'Now visible on public site.');
  };

  const remove = async (e: EventDoc) => {
    const ok = await confirm({
      tone: 'danger',
      title: 'Delete event?',
      itemName: e.name,
      description: 'This entry will be permanently removed.',
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    await deleteDoc(doc(db, 'events', e.id));
    showToast('success', 'Event deleted.');
  };

  const filtered = events.filter((e) => {
    if (filterKind !== 'all' && (e.kind || 'event') !== filterKind) return false;
    if (filterStatus !== 'all' && (e.status || 'upcoming') !== filterStatus) return false;
    if (filterCategory !== 'all' && (e.category || '') !== filterCategory) return false;
    if (filterVisibility === 'visible' && e.hidden) return false;
    if (filterVisibility === 'hidden' && !e.hidden) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Events & Programs</h2>
          <p className="text-slate-400 text-sm mt-1">Public-facing events and programs surfaced on the home and events pages.</p>
        </div>
        {isAdmin && <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"><Plus className="w-4 h-4" /> New Event</button>}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={closeModal} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
              <motion.div drag dragMomentum={false} dragElastic={0.1} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] pointer-events-auto">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 cursor-grab active:cursor-grabbing select-none sticky top-0 bg-white/95 backdrop-blur z-10">
                  <div className="flex items-center gap-3"><div className="w-1 h-5 rounded-full bg-brand-400" /><h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{editing ? 'Edit Event' : 'New Event'}</h3></div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Coding Bootcamp 2026" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description shown on the public page..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 resize-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Type</label><select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white">{KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}</select></div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Category</label>
                      <ComboInput
                        value={form.category || ''}
                        options={CATEGORIES}
                        onChange={(v) => setForm({ ...form, category: v })}
                        placeholder="Pick or type a category"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white"><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed (Past)</option></select></div>
                  </div>

                  {/* Visibility */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer select-none transition-colors ${form.hidden ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-white'}`}>
                    <input type="checkbox" checked={!!form.hidden}
                      onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
                      className="sr-only" />
                    <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.hidden ? 'bg-amber-500 border-amber-500' : 'border-slate-300 bg-white'}`}>
                      {form.hidden && <EyeOff className="w-3 h-3 text-white" strokeWidth={3} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {form.hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
                        <span className="font-bold text-slate-800 text-[12.5px]">{form.hidden ? 'Hidden from public site' : 'Visible on public site'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {form.hidden
                          ? 'This entry will not appear on the home page or /events. Toggle off to publish.'
                          : 'Tick to hide while you’re editing or to retire an event without deleting it.'}
                      </p>
                    </div>
                  </label>

                  {/* Optional display details */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/40">
                    <button type="button" onClick={() => setShowOptional((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
                      <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Optional display details</span>
                      {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <AnimatePresence>{showOptional && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-1 space-y-4">
                          <p className="text-[11px] text-slate-400 leading-relaxed">All optional. Add or update them after the event has passed (e.g. switch CTA to a recap link).</p>

                          {/* When + where */}
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Display date</label><input value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} placeholder="e.g. June 14, 2026" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Time</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM – 2:00 PM WAT" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          </div>
                          <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Abuja, Nigeria + Livestream" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>

                          {/* Registration fee */}
                          <div className="rounded-lg border border-slate-100 bg-white p-3">
                            <div className="text-[11px] font-bold text-slate-600 mb-2">Registration fee</div>
                            <div className="flex gap-2 mb-2">
                              {[{ v: 'free', l: 'Free' }, { v: 'paid', l: 'Paid' }].map((opt) => (
                                <button key={opt.v} type="button" onClick={() => setForm({ ...form, registrationFeeType: opt.v })}
                                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${form.registrationFeeType === opt.v ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                  {opt.l}
                                </button>
                              ))}
                            </div>
                            {form.registrationFeeType === 'paid' && (
                              <input value={form.registrationFeeAmount} onChange={(e) => setForm({ ...form, registrationFeeAmount: e.target.value })} placeholder="e.g. $29 / $15 per team" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" />
                            )}
                          </div>

                          {/* Capacity & prizes */}
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Available seats</label><input value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} placeholder="e.g. 300 seats" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Prizes</label><input value={form.prizes} onChange={(e) => setForm({ ...form, prizes: e.target.value })} placeholder="e.g. $5,000 grand prize" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          </div>
                          <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Badge</label><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Multi-city / Continental / Past event" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>

                          {/* CTA */}
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">CTA link</label><input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} placeholder="/summer-coding-2026 or https://…" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">CTA label</label><input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Register / Watch recap" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          </div>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed">Leave both blank if there&apos;s no page to link to yet — the card will hide its CTA button.</p>

                          {/* Info Session add-on */}
                          <div className="rounded-lg border border-slate-100 bg-white p-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input type="checkbox" checked={!!form.infoSessionEnabled}
                                onChange={(e) => setForm({ ...form, infoSessionEnabled: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-purple-500" /> Add an info session for this event</span>
                            </label>
                            {form.infoSessionEnabled && (
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Info session date</label><input type="date" value={form.infoSessionDate} onChange={(e) => setForm({ ...form, infoSessionDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                                <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Info session time</label><input value={form.infoSessionTime} onChange={(e) => setForm({ ...form, infoSessionTime: e.target.value })} placeholder="e.g. 4:00 PM WAT" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </div>

                  <button onClick={save} disabled={saving || !form.name} className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{editing ? 'Save Changes' : 'Create Event'} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3 mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type:</span>
          {(['all', 'program', 'event'] as const).map((k) => (
            <button key={k} onClick={() => setFilterKind(k)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${filterKind === k ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {k}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-1 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visibility:</span>
          {(['all', 'visible', 'hidden'] as const).map((v) => (
            <button key={v} onClick={() => setFilterVisibility(v)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${filterVisibility === v ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-1 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status:</span>
          {(['all', 'upcoming', 'active', 'completed'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${filterStatus === s ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {s === 'completed' ? 'Past' : s}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-1 px-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category:</span>
          {['all', ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${filterCategory === c ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {!loaded ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center"><Loader2 className="w-6 h-6 mx-auto text-slate-300 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center"><Calendar className="w-10 h-10 mx-auto text-slate-200 mb-3" /><p className="text-slate-400 text-sm">{events.length === 0 ? 'No events yet.' : 'No items match the current filters.'}</p></div>
        ) : filtered.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow ${e.hidden ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
            <div className={`h-[3px] ${e.status === 'active' ? 'bg-emerald-500' : e.status === 'completed' ? 'bg-slate-300' : 'bg-brand-500'}`} />
            <div className={`p-5 ${e.hidden ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{e.name}</h4>
                    {e.hidden && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
                        <EyeOff className="w-2.5 h-2.5" /> Hidden
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${e.status === 'active' ? 'bg-emerald-50 text-emerald-600' : e.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-brand-50 text-brand-600'}`}>{e.status === 'completed' ? 'past' : (e.status || 'upcoming')}</span>
                    {e.kind === 'event' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600">Event</span>}
                    {e.kind === 'program' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500">Program</span>}
                    {e.category && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">{e.category}</span>}
                  </div>
                  {e.description && <p className="text-slate-500 text-xs leading-relaxed">{e.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                    {(e.eventDate || e.startDate) && <span>📅 {e.eventDate || e.startDate}</span>}
                    {e.time && <span>⏰ {e.time}</span>}
                    {e.location && <span>📍 {e.location}</span>}
                    {e.seats && <span>🪑 {e.seats}</span>}
                    {(e.registrationFeeType === 'paid' && e.registrationFeeAmount)
                      ? <span>💵 {e.registrationFeeAmount}</span>
                      : e.registrationFeeType === 'free'
                        ? <span>💵 Free</span>
                        : e.price && <span>💵 {e.price}</span>}
                    {e.prizes && <span>🏆 {e.prizes}</span>}
                    {e.infoSessionEnabled && e.infoSessionDate && <span>🎥 Info session {e.infoSessionDate}</span>}
                    {e.badge && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">{e.badge}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {isAdmin && (
                    <button onClick={() => toggleHidden(e)}
                      title={e.hidden ? 'Unhide (publish to public site)' : 'Hide from public site'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${e.hidden ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}>
                      {e.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  {isAdmin && <button onClick={() => startEdit(e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-brand-500 hover:bg-brand-50 transition-all"><Pencil className="w-3.5 h-3.5" /></button>}
                  {isAdmin && <button onClick={() => remove(e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
