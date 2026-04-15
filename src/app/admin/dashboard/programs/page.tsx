'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import {
  FolderKanban, Plus, X, Users, CheckCircle2, Trash2,
  ArrowRight, Search, Calendar, Loader2, Pencil, UserMinus,
  Clock, Copy, ExternalLink, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/Toast';

type Program = { id: string; name: string; description: string; startDate: string; status: string; createdAt: any };
type Submission = { id: string; formType: string; email?: string; name?: string; program?: string; assignedProgram?: string; officeHourSlot?: string; createdAt: any; read: boolean; [key: string]: any };
type OfficeHour = { id: string; programId: string; title: string; day?: string; days?: string[]; startTime: string; endTime: string; slotMinutes: number; dateFrom: string; dateTo: string; bookings: any[]; createdAt: any };

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function generateSlots(start: string, end: string, mins: number) {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let t = sh * 60 + sm;
  const endT = eh * 60 + em;
  while (t + mins <= endT) {
    const h1 = Math.floor(t / 60), m1 = t % 60;
    const h2 = Math.floor((t + mins) / 60), m2 = (t + mins) % 60;
    slots.push(`${String(h1).padStart(2, '0')}:${String(m1).padStart(2, '0')}–${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`);
    t += mins;
  }
  return slots;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [officeHours, setOfficeHours] = useState<OfficeHour[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProg, setEditingProg] = useState<Program | null>(null);
  const [newProg, setNewProg] = useState({ name: '', description: '', startDate: '', status: 'upcoming' });
  const [creating, setCreating] = useState(false);
  const { isAdmin } = useRole();
  const { showToast } = useToast();
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [viewingStudents, setViewingStudents] = useState<string | null>(null);
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [showOH, setShowOH] = useState(false);
  const [editingOH, setEditingOH] = useState<OfficeHour | null>(null);
  const [ohProgId, setOhProgId] = useState<string | null>(null);
  const [newOH, setNewOH] = useState({ title: 'Instructor Office Hour', days: ['Monday'] as string[], startTime: '09:00', endTime: '11:00', slotMinutes: '30', dateFrom: '', dateTo: '' });
  const [creatingOH, setCreatingOH] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'programs'), orderBy('createdAt', 'desc')), (s) => setPrograms(s.docs.map((d) => ({ id: d.id, ...d.data() } as Program))));
    const u2 = onSnapshot(query(collection(db, 'submissions'), orderBy('createdAt', 'desc')), (s) => setSubmissions(s.docs.map((d) => ({ id: d.id, ...d.data() } as Submission))));
    const u3 = onSnapshot(query(collection(db, 'office_hours'), orderBy('createdAt', 'desc')), (s) => setOfficeHours(s.docs.map((d) => ({ id: d.id, ...d.data() } as OfficeHour))));
    return () => { u1(); u2(); u3(); };
  }, []);

  // Program CRUD
  const closeModal = () => { setShowCreate(false); setEditingProg(null); setNewProg({ name: '', description: '', startDate: '', status: 'upcoming' }); };
  const createOrUpdateProgram = async () => {
    if (!newProg.name) return; setCreating(true);
    if (editingProg) await updateDoc(doc(db, 'programs', editingProg.id), { name: newProg.name, description: newProg.description, startDate: newProg.startDate, status: newProg.status });
    else await addDoc(collection(db, 'programs'), { ...newProg, createdAt: serverTimestamp() });
    closeModal(); setCreating(false);
  };
  const startEdit = (p: Program) => { setEditingProg(p); setNewProg({ name: p.name, description: p.description || '', startDate: p.startDate || '', status: p.status || 'upcoming' }); setShowCreate(true); };
  const deleteProgram = async (id: string) => {
    const p = programs.find((x) => x.id === id);
    if (p) for (const s of submissions.filter((x) => x.assignedProgram === p.name)) await updateDoc(doc(db, 'submissions', s.id), { assignedProgram: '' });
    await deleteDoc(doc(db, 'programs', id));
    showToast('success', 'Program deleted. Students unassigned.');
  };

  // Assignments
  const assignSubmissions = async () => {
    if (!assigningTo || selectedSubs.size === 0) return;
    const p = programs.find((x) => x.id === assigningTo);
    for (const id of Array.from(selectedSubs)) await updateDoc(doc(db, 'submissions', id), { assignedProgram: p?.name || assigningTo });
    showToast('success', `${selectedSubs.size} student(s) assigned.`);
    setSelectedSubs(new Set()); setAssigningTo(null);
  };
  const removeFromProgram = async (id: string) => { await updateDoc(doc(db, 'submissions', id), { assignedProgram: '', officeHourSlot: '' }); showToast('success', 'Student removed.'); };
  const toggleSub = (id: string) => { const n = new Set(selectedSubs); n.has(id) ? n.delete(id) : n.add(id); setSelectedSubs(n); };

  // Office Hours
  const closeOH = () => { setShowOH(false); setEditingOH(null); setNewOH({ title: 'Instructor Office Hour', days: ['Monday'], startTime: '09:00', endTime: '11:00', slotMinutes: '30', dateFrom: '', dateTo: '' }); };
  const toggleDay = (d: string) => { const n = newOH.days.includes(d) ? newOH.days.filter((x) => x !== d) : [...newOH.days, d]; setNewOH({ ...newOH, days: n }); };
  const saveOH = async () => {
    if (!newOH.title || !ohProgId || newOH.days.length === 0) return; setCreatingOH(true);
    const data = { programId: ohProgId, title: newOH.title, days: newOH.days, startTime: newOH.startTime, endTime: newOH.endTime, slotMinutes: parseInt(newOH.slotMinutes) || 30, dateFrom: newOH.dateFrom, dateTo: newOH.dateTo, bookings: editingOH?.bookings || [] };
    if (editingOH) await updateDoc(doc(db, 'office_hours', editingOH.id), data);
    else await addDoc(collection(db, 'office_hours'), { ...data, createdAt: serverTimestamp() });
    closeOH(); setCreatingOH(false);
    showToast('success', editingOH ? 'Office hour updated.' : 'Office hour created. Share the link with students.');
  };
  const startEditOH = (oh: OfficeHour) => {
    setEditingOH(oh); setOhProgId(oh.programId);
    const days = oh.days || (oh.day ? [oh.day] : ['Monday']);
    setNewOH({ title: oh.title, days, startTime: oh.startTime, endTime: oh.endTime, slotMinutes: String(oh.slotMinutes || 30), dateFrom: oh.dateFrom || '', dateTo: oh.dateTo || '' });
    setShowOH(true);
  };
  const deleteOH = async (id: string) => { await deleteDoc(doc(db, 'office_hours', id)); showToast('success', 'Office hour deleted.'); };
  const copyLink = (id: string) => { navigator.clipboard.writeText(`${window.location.origin}/book?id=${id}`); showToast('success', 'Booking link copied.'); };

  // Orphans
  const unassigned = submissions.filter((s) => !s.assignedProgram && s.formType === 'enrollment');
  const filteredUnassigned = unassigned.filter((s) => !search || (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.email || '').toLowerCase().includes(search.toLowerCase()));
  const programNames = new Set(programs.map((p) => p.name));
  const orphanedGroups: Record<string, Submission[]> = {};
  submissions.filter((s) => s.assignedProgram && !programNames.has(s.assignedProgram)).forEach((s) => { const k = s.assignedProgram!; if (!orphanedGroups[k]) orphanedGroups[k] = []; orphanedGroups[k].push(s); });
  const orphanedNames = Object.keys(orphanedGroups);
  const createFromOrphan = async (n: string) => { await addDoc(collection(db, 'programs'), { name: n, description: '', startDate: '', status: 'active', createdAt: serverTimestamp() }); showToast('success', `Program "${n}" created.`); };
  const unassignOrphans = async (n: string) => { for (const s of orphanedGroups[n]) await updateDoc(doc(db, 'submissions', s.id), { assignedProgram: '' }); showToast('success', 'Students unassigned.'); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Programs</h2>
          <p className="text-slate-400 text-sm mt-1">Manage programs, students, and weekly office hours.</p>
        </div>
        {isAdmin && <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"><Plus className="w-4 h-4" /> New Program</button>}
      </div>

      {/* ── Create/Edit Program Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={closeModal} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div drag dragMomentum={false} dragElastic={0.1} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] pointer-events-auto">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 cursor-grab active:cursor-grabbing select-none">
                  <div className="flex items-center gap-3"><div className="w-1 h-5 rounded-full bg-slate-200" /><h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{editingProg ? 'Edit Program' : 'Create Program'}</h3></div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Program Name *</label><input value={newProg.name} onChange={(e) => setNewProg({ ...newProg, name: e.target.value })} placeholder="e.g. Summer of Code 2026" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Description</label><textarea value={newProg.description} onChange={(e) => setNewProg({ ...newProg, description: e.target.value })} rows={2} placeholder="Brief description..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 resize-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Start Date</label><input type="date" value={newProg.startDate} onChange={(e) => setNewProg({ ...newProg, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Status</label><select value={newProg.status} onChange={(e) => setNewProg({ ...newProg, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white"><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed</option></select></div>
                  </div>
                  <button onClick={createOrUpdateProgram} disabled={creating || !newProg.name} className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{editingProg ? 'Save Changes' : 'Create Program'} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Office Hour Modal ── */}
      <AnimatePresence>
        {showOH && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={closeOH} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div drag dragMomentum={false} dragElastic={0.1} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] pointer-events-auto">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 cursor-grab active:cursor-grabbing select-none">
                  <div className="flex items-center gap-3"><div className="w-1 h-5 rounded-full bg-emerald-400" /><h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{editingOH ? 'Edit Office Hour' : 'Schedule Office Hour'}</h3></div>
                  <button onClick={closeOH} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-xs text-slate-400">For: <strong className="text-slate-600">{programs.find((p) => p.id === ohProgId)?.name}</strong></p>
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Session Title *</label><input value={newOH.title} onChange={(e) => setNewOH({ ...newOH, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                  <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Days *</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS.map((d) => (
                        <button key={d} type="button" onClick={() => toggleDay(d)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${newOH.days.includes(d) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Start</label><input type="time" value={newOH.startTime} onChange={(e) => setNewOH({ ...newOH, startTime: e.target.value })} className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">End</label><input type="time" value={newOH.endTime} onChange={(e) => setNewOH({ ...newOH, endTime: e.target.value })} className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Slot (min)</label><input type="number" min="15" step="15" value={newOH.slotMinutes} onChange={(e) => setNewOH({ ...newOH, slotMinutes: e.target.value })} className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Active From</label><input type="date" value={newOH.dateFrom} onChange={(e) => setNewOH({ ...newOH, dateFrom: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Active Until</label><input type="date" value={newOH.dateTo} onChange={(e) => setNewOH({ ...newOH, dateTo: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" /></div>
                  </div>
                  {/* Slot preview */}
                  {newOH.startTime && newOH.endTime && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Slot Preview — {generateSlots(newOH.startTime, newOH.endTime, parseInt(newOH.slotMinutes) || 30).length} slots</p>
                      <div className="flex flex-wrap gap-1.5">
                        {generateSlots(newOH.startTime, newOH.endTime, parseInt(newOH.slotMinutes) || 30).map((s) => (
                          <span key={s} className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={saveOH} disabled={creatingOH || !newOH.title} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {creatingOH ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{editingOH ? 'Save Changes' : 'Create Schedule'} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Orphaned Assignments ── */}
      {orphanedNames.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Students assigned to missing programs ({orphanedNames.length})</p>
          {orphanedNames.map((name) => (
            <div key={name} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div><h4 className="font-bold text-slate-900 text-[14px]">{name}</h4><p className="text-xs text-amber-600">{orphanedGroups[name].length} student(s)</p></div>
                <div className="flex gap-2">
                  {isAdmin && <button onClick={() => createFromOrphan(name)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:-translate-y-0.5 transition-all flex items-center gap-1"><Plus className="w-3 h-3" /> Create Program</button>}
                  {isAdmin && <button onClick={() => unassignOrphans(name)} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1"><UserMinus className="w-3 h-3" /> Unassign All</button>}
                </div>
              </div>
              <div className="space-y-1">{orphanedGroups[name].slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs text-slate-600"><div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-700">{(s.name || s.email || '?')[0].toUpperCase()}</div><span className="truncate">{s.name || s.email || 'Anonymous'}</span></div>
              ))}{orphanedGroups[name].length > 5 && <p className="text-[11px] text-amber-500">+{orphanedGroups[name].length - 5} more</p>}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Programs List ── */}
      <div className="space-y-4 mb-10">
        {programs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center"><FolderKanban className="w-10 h-10 mx-auto text-slate-200 mb-3" /><p className="text-slate-400 text-sm">No programs yet.</p></div>
        ) : programs.map((prog, i) => {
          const assigned = submissions.filter((s) => s.assignedProgram === prog.name);
          const progOH = officeHours.filter((oh) => oh.programId === prog.id);
          const isExp = viewingStudents === prog.id;
          return (
            <motion.div key={prog.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`h-[3px] ${prog.status === 'active' ? 'bg-emerald-500' : prog.status === 'completed' ? 'bg-slate-300' : 'bg-brand-500'}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{prog.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prog.status === 'active' ? 'bg-emerald-50 text-emerald-600' : prog.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-brand-50 text-brand-600'}`}>{prog.status}</span>
                    </div>
                    {prog.description && <p className="text-slate-400 text-xs">{prog.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    {isAdmin && <button onClick={() => startEdit(prog)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-brand-500 hover:bg-brand-50 transition-all"><Pencil className="w-3.5 h-3.5" /></button>}
                    {isAdmin && <button onClick={() => deleteProgram(prog.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  {prog.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {prog.startDate}</span>}
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {assigned.length} students</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {progOH.length} schedule(s)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setAssigningTo(prog.id === assigningTo ? null : prog.id)} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${assigningTo === prog.id ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600'}`}><Plus className="w-3 h-3" /> Assign</button>
                  <button onClick={() => setViewingStudents(isExp ? null : prog.id)} className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1.5"><Users className="w-3 h-3" /> Students ({assigned.length}) {isExp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>
                  {isAdmin && <button onClick={() => { setOhProgId(prog.id); setShowOH(true); }} className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center gap-1.5"><Clock className="w-3 h-3" /> Office Hours</button>}
                </div>
              </div>

              {/* Students */}
              <AnimatePresence>{isExp && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                  <div className="p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Students</p>
                      <p className="text-[10px] text-emerald-500 font-semibold">Group sessions encouraged for better learning</p>
                    </div>
                    {assigned.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">No students assigned.</p> : (
                      <div className="space-y-1.5">{assigned.map((s) => (
                        <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-slate-100 group/row">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">{(s.name || s.email || '?')[0].toUpperCase()}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{s.name || 'No name'}</p>
                            <p className="text-[11px] text-slate-400 truncate">{s.email}</p>
                          </div>
                          {(() => {
                            const booking = progOH.flatMap((oh) => (oh.bookings || []).filter((b: any) => b.email === s.email).map((b: any) => b.slot || `${b.day} ${b.time}`)).filter(Boolean);
                            return booking.length > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 flex-shrink-0"><Clock className="w-2.5 h-2.5 inline mr-1" />{booking[0]}</span>
                            ) : null;
                          })()}
                          {isAdmin && <button onClick={() => removeFromProgram(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/row:opacity-100"><UserMinus className="w-3.5 h-3.5" /></button>}
                        </div>
                      ))}</div>
                    )}
                  </div>
                </motion.div>
              )}</AnimatePresence>

              {/* Office Hours */}
              {progOH.length > 0 && (
                <div className="px-5 pb-4 pt-2 border-t border-slate-50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Weekly Office Hours</p>
                  <div className="space-y-1.5">{progOH.map((oh) => {
                    const slots = generateSlots(oh.startTime, oh.endTime, oh.slotMinutes || 30);
                    const bookings = oh.bookings || [];
                    return (
                      <div key={oh.id} className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 group/oh">
                        <div className="flex items-center gap-3 mb-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-700 text-xs">{oh.title}</span>
                            <span className="text-slate-400 text-xs ml-2">{(oh.days || [oh.day]).filter(Boolean).map((d) => d!.slice(0, 3)).join(', ')} · {oh.startTime}–{oh.endTime} · {slots.length} slots</span>
                            {oh.dateFrom && <span className="text-slate-300 text-[10px] ml-2">({oh.dateFrom} → {oh.dateTo || '∞'})</span>}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">{bookings.length} booked</span>
                          <button onClick={() => copyLink(oh.id)} title="Copy link" className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-brand-500"><Copy className="w-3 h-3" /></button>
                          <a href={`/book?id=${oh.id}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-brand-500"><ExternalLink className="w-3 h-3" /></a>
                          {isAdmin && <button onClick={() => startEditOH(oh)} className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-brand-500 opacity-0 group-hover/oh:opacity-100"><Pencil className="w-3 h-3" /></button>}
                          {isAdmin && <button onClick={() => deleteOH(oh.id)} className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover/oh:opacity-100"><Trash2 className="w-3 h-3" /></button>}
                        </div>
                        {/* Slot utilization mini-view */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {slots.map((slot) => {
                            const count = bookings.filter((b: any) => b.slot === slot).length;
                            return <span key={slot} className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{slot} {count > 0 && `(${count})`}</span>;
                          })}
                        </div>
                      </div>
                    );
                  })}</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Assign Panel ── */}
      <AnimatePresence>{assigningTo && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="bg-white rounded-2xl border-2 border-brand-200 p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-bold text-slate-900 text-[15px]">Assign to: {programs.find((p) => p.id === assigningTo)?.name}</h3><p className="text-slate-400 text-xs mt-0.5">{selectedSubs.size} selected · {filteredUnassigned.length} unassigned</p></div>
            <div className="flex gap-2">
              <button onClick={assignSubmissions} disabled={selectedSubs.size === 0} className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold disabled:opacity-40 transition-all hover:-translate-y-0.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Assign ({selectedSubs.size})</button>
              <button onClick={() => { setAssigningTo(null); setSelectedSubs(new Set()); }} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold">Cancel</button>
            </div>
          </div>
          <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-300" /></div>
          <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50 rounded-xl border border-slate-100">
            {filteredUnassigned.length === 0 ? <div className="py-8 text-center text-slate-400 text-xs">No unassigned enrollments</div> : filteredUnassigned.map((s) => (
              <label key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50/30 cursor-pointer"><input type="checkbox" checked={selectedSubs.has(s.id)} onChange={() => toggleSub(s.id)} className="w-4 h-4 rounded border-slate-300 text-brand-600" /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{s.name || 'No name'}</p><p className="text-xs text-slate-400 truncate">{s.email}</p></div></label>
            ))}
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
