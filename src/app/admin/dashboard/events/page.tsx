'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import {
  Calendar, Plus, X, Trash2, ArrowRight, Loader2, Pencil,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';
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
  createdAt?: any;
};

const CATEGORIES = ['Learning Hub', 'Spotlight Media', 'Code Prodigy', 'Edutainment', 'Community'];
const KINDS = [
  { value: 'program', label: 'Program' },
  { value: 'event', label: 'Event' },
];

const EMPTY = { name: '', description: '', startDate: '', status: 'upcoming', category: 'Learning Hub', kind: 'event', eventDate: '', time: '', location: '', seats: '', price: '', badge: '', ctaHref: '', ctaLabel: '' };

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

  // Auto-seed on first load if collection is empty (one-shot, idempotent)
  useEffect(() => {
    if (!loaded || seededRef.current) return;
    seededRef.current = true;
    (async () => {
      const snap = await getDocs(collection(db, 'events'));
      if (!snap.empty) return; // already populated
      for (const seed of SEED_EVENTS) {
        await addDoc(collection(db, 'events'), { ...seed, createdAt: serverTimestamp() });
      }
      showToast('success', `Imported ${SEED_EVENTS.length} initial entries.`);
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
    });
    const hasOptional = !!(e.eventDate || e.time || e.location || e.seats || e.price || e.badge || e.ctaHref || e.ctaLabel);
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
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white"><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed (Past)</option></select></div>
                  </div>

                  {/* Optional display details */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/40">
                    <button type="button" onClick={() => setShowOptional((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
                      <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Optional display details</span>
                      {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <AnimatePresence>{showOptional && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-1 space-y-3">
                          <p className="text-[11px] text-slate-400 leading-relaxed">All optional. Add or update them after the event has passed (e.g. switch CTA to a recap link).</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Display date</label><input value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} placeholder="e.g. June 14, 2026" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Time</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM – 2:00 PM WAT" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          </div>
                          <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Abuja, Nigeria + Livestream" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          <div className="grid grid-cols-3 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Seats</label><input value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} placeholder="300 seats" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Price</label><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Free / $29" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">Badge</label><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="$5K prizes / Past event" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">CTA link</label><input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} placeholder="/summer-coding-2026 or https://…" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
                            <div><label className="text-[11px] font-bold text-slate-600 mb-1 block">CTA label</label><input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Register / Watch recap" className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 text-xs focus:outline-none focus:border-brand-400" /></div>
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
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-[3px] ${e.status === 'active' ? 'bg-emerald-500' : e.status === 'completed' ? 'bg-slate-300' : 'bg-brand-500'}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{e.name}</h4>
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
                    {e.price && <span>💵 {e.price}</span>}
                    {e.badge && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">{e.badge}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
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
