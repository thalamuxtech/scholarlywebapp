'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import {
  FolderKanban, Plus, X, Users, CheckCircle2, Trash2,
  ArrowRight, Search, Calendar, Loader2, Pencil, UserMinus,
  Clock, Link2, Copy, ExternalLink, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/Toast';

type Program = { id: string; name: string; description: string; startDate: string; status: string; createdAt: any };
type Submission = { id: string; formType: string; email?: string; name?: string; program?: string; assignedProgram?: string; createdAt: any; read: boolean; [key: string]: any };
type OfficeHour = { id: string; programId: string; title: string; date: string; startTime: string; endTime: string; slots: number; bookings: any[]; createdAt: any };

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
  // Office hours
  const [showOH, setShowOH] = useState(false);
  const [ohProgId, setOhProgId] = useState<string | null>(null);
  const [newOH, setNewOH] = useState({ title: '', date: '', startTime: '09:00', endTime: '10:00', slots: '5' });
  const [creatingOH, setCreatingOH] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'programs'), orderBy('createdAt', 'desc')), (s) => setPrograms(s.docs.map((d) => ({ id: d.id, ...d.data() } as Program))));
    const u2 = onSnapshot(query(collection(db, 'submissions'), orderBy('createdAt', 'desc')), (s) => setSubmissions(s.docs.map((d) => ({ id: d.id, ...d.data() } as Submission))));
    const u3 = onSnapshot(query(collection(db, 'office_hours'), orderBy('date', 'asc')), (s) => setOfficeHours(s.docs.map((d) => ({ id: d.id, ...d.data() } as OfficeHour))));
    return () => { u1(); u2(); u3(); };
  }, []);

  const closeModal = () => { setShowCreate(false); setEditingProg(null); setNewProg({ name: '', description: '', startDate: '', status: 'upcoming' }); };

  const createOrUpdateProgram = async () => {
    if (!newProg.name) return;
    setCreating(true);
    if (editingProg) {
      await updateDoc(doc(db, 'programs', editingProg.id), { name: newProg.name, description: newProg.description, startDate: newProg.startDate, status: newProg.status });
    } else {
      await addDoc(collection(db, 'programs'), { ...newProg, createdAt: serverTimestamp() });
    }
    closeModal();
    setCreating(false);
  };

  const startEdit = (prog: Program) => {
    setEditingProg(prog);
    setNewProg({ name: prog.name, description: prog.description || '', startDate: prog.startDate || '', status: prog.status || 'upcoming' });
    setShowCreate(true);
  };

  const deleteProgram = async (id: string) => {
    const prog = programs.find((p) => p.id === id);
    if (prog) {
      for (const sub of submissions.filter((s) => s.assignedProgram === prog.name)) {
        await updateDoc(doc(db, 'submissions', sub.id), { assignedProgram: '' });
      }
    }
    await deleteDoc(doc(db, 'programs', id));
    showToast('success', 'Program deleted. Students unassigned and available for reassignment.');
  };

  const assignSubmissions = async () => {
    if (!assigningTo || selectedSubs.size === 0) return;
    const prog = programs.find((p) => p.id === assigningTo);
    for (const subId of Array.from(selectedSubs)) {
      await updateDoc(doc(db, 'submissions', subId), { assignedProgram: prog?.name || assigningTo });
    }
    showToast('success', `${selectedSubs.size} student(s) assigned to ${prog?.name}.`);
    setSelectedSubs(new Set());
    setAssigningTo(null);
  };

  const removeFromProgram = async (subId: string) => {
    await updateDoc(doc(db, 'submissions', subId), { assignedProgram: '' });
    showToast('success', 'Student removed from program.');
  };

  const toggleSub = (id: string) => {
    const next = new Set(selectedSubs);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSubs(next);
  };

  // Office hours
  const createOfficeHour = async () => {
    if (!newOH.title || !newOH.date || !ohProgId) return;
    setCreatingOH(true);
    await addDoc(collection(db, 'office_hours'), {
      programId: ohProgId, title: newOH.title, date: newOH.date,
      startTime: newOH.startTime, endTime: newOH.endTime,
      slots: parseInt(newOH.slots) || 5, bookings: [], createdAt: serverTimestamp(),
    });
    setNewOH({ title: '', date: '', startTime: '09:00', endTime: '10:00', slots: '5' });
    setShowOH(false);
    setCreatingOH(false);
    showToast('success', 'Office hour created. Share the booking link with students.');
  };

  const deleteOH = async (id: string) => { await deleteDoc(doc(db, 'office_hours', id)); };

  const copyLink = (ohId: string) => {
    const url = `${window.location.origin}/book?id=${ohId}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Booking link copied to clipboard.');
  };

  const unassigned = submissions.filter((s) => !s.assignedProgram && s.formType === 'enrollment');
  const filteredUnassigned = unassigned.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  // Find orphaned assignments — students assigned to programs that don't exist
  const programNames = new Set(programs.map((p) => p.name));
  const orphanedGroups: Record<string, Submission[]> = {};
  submissions.filter((s) => s.assignedProgram && !programNames.has(s.assignedProgram)).forEach((s) => {
    const key = s.assignedProgram!;
    if (!orphanedGroups[key]) orphanedGroups[key] = [];
    orphanedGroups[key].push(s);
  });
  const orphanedNames = Object.keys(orphanedGroups);

  const createFromOrphan = async (name: string) => {
    await addDoc(collection(db, 'programs'), { name, description: '', startDate: '', status: 'active', createdAt: serverTimestamp() });
    showToast('success', `Program "${name}" created. Students are now linked.`);
  };

  const unassignOrphans = async (name: string) => {
    for (const sub of orphanedGroups[name]) {
      await updateDoc(doc(db, 'submissions', sub.id), { assignedProgram: '' });
    }
    showToast('success', `${orphanedGroups[name].length} student(s) unassigned from "${name}".`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Programs</h2>
          <p className="text-slate-400 text-sm mt-1">Manage programs, assign students, and schedule office hours.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> New Program
          </button>
        )}
      </div>

      {/* ── Create/Edit Program Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={closeModal} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div drag dragMomentum={false} dragElastic={0.1}
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] pointer-events-auto">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 cursor-grab active:cursor-grabbing select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 rounded-full bg-slate-200" />
                    <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {editingProg ? 'Edit Program' : 'Create Program'}
                    </h3>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Program Name *</label>
                    <input value={newProg.name} onChange={(e) => setNewProg({ ...newProg, name: e.target.value })} placeholder="e.g. Summer of Code 2026"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Description</label>
                    <textarea value={newProg.description} onChange={(e) => setNewProg({ ...newProg, description: e.target.value })} rows={2} placeholder="Brief description..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Start Date</label>
                      <input type="date" value={newProg.startDate} onChange={(e) => setNewProg({ ...newProg, startDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Status</label>
                      <select value={newProg.status} onChange={(e) => setNewProg({ ...newProg, status: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white">
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={createOrUpdateProgram} disabled={creating || !newProg.name}
                    className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{editingProg ? 'Save Changes' : 'Create Program'} <ArrowRight className="w-4 h-4" /></>}
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
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Students assigned to programs that don&apos;t exist ({orphanedNames.length})
          </p>
          {orphanedNames.map((name) => (
            <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-[14px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{name}</h4>
                  <p className="text-xs text-amber-600">{orphanedGroups[name].length} student{orphanedGroups[name].length !== 1 ? 's' : ''} assigned</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <button onClick={() => createFromOrphan(name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:-translate-y-0.5 transition-all flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Create Program
                    </button>
                  )}
                  {isAdmin && (
                    <button onClick={() => unassignOrphans(name)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1">
                      <UserMinus className="w-3 h-3" /> Unassign All
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {orphanedGroups[name].slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-700">
                      {(sub.name || sub.email || '?')[0].toUpperCase()}
                    </div>
                    <span className="truncate">{sub.name || sub.email || 'Anonymous'}</span>
                  </div>
                ))}
                {orphanedGroups[name].length > 5 && (
                  <p className="text-[11px] text-amber-500 mt-1">+{orphanedGroups[name].length - 5} more</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Programs List ── */}
      <div className="space-y-4 mb-10">
        {programs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No programs yet. Create one to start assigning students.</p>
          </div>
        ) : (
          programs.map((prog, i) => {
            const assigned = submissions.filter((s) => s.assignedProgram === prog.name);
            const progOH = officeHours.filter((oh) => oh.programId === prog.id);
            const isExpanded = viewingStudents === prog.id;
            return (
              <motion.div key={prog.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                {/* Header bar */}
                <div className={`h-[3px] ${prog.status === 'active' ? 'bg-emerald-500' : prog.status === 'completed' ? 'bg-slate-300' : 'bg-brand-500'}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{prog.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prog.status === 'active' ? 'bg-emerald-50 text-emerald-600' : prog.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-brand-50 text-brand-600'
                        }`}>{prog.status}</span>
                      </div>
                      {prog.description && <p className="text-slate-400 text-xs">{prog.description}</p>}
                    </div>
                    <div className="flex gap-1">
                      {isAdmin && <button onClick={() => startEdit(prog)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-brand-500 hover:bg-brand-50 transition-all"><Pencil className="w-3.5 h-3.5" /></button>}
                      {isAdmin && <button onClick={() => deleteProgram(prog.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    {prog.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {prog.startDate}</span>}
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {assigned.length} enrolled</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {progOH.length} office hours</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setAssigningTo(prog.id === assigningTo ? null : prog.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        assigningTo === prog.id ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600'
                      }`}>
                      <Plus className="w-3 h-3" /> Assign Students
                    </button>
                    <button onClick={() => setViewingStudents(isExpanded ? null : prog.id)}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> View Students ({assigned.length})
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isAdmin && (
                      <button onClick={() => { setOhProgId(prog.id); setShowOH(true); }}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Schedule Office Hour
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded: Assigned Students */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100">
                      <div className="p-4 bg-slate-50/50">
                        {assigned.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">No students assigned yet.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {assigned.map((sub) => (
                              <div key={sub.id} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-slate-100 group/row">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                                  {(sub.name || sub.email || '?')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-700 truncate">{sub.name || 'No name'}</p>
                                  <p className="text-[11px] text-slate-400 truncate">{sub.email}</p>
                                </div>
                                {isAdmin && (
                                  <button onClick={() => removeFromProgram(sub.id)} title="Remove from program"
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/row:opacity-100">
                                    <UserMinus className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Office Hours for this program */}
                {progOH.length > 0 && (
                  <div className="px-5 pb-4 pt-2 border-t border-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Office Hours</p>
                    <div className="space-y-1.5">
                      {progOH.map((oh) => (
                        <div key={oh.id} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg text-xs group/oh">
                          <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-700">{oh.title}</span>
                            <span className="text-slate-400 ml-2">{oh.date} · {oh.startTime}–{oh.endTime} · {oh.bookings?.length || 0}/{oh.slots} booked</span>
                          </div>
                          <button onClick={() => copyLink(oh.id)} title="Copy booking link"
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-brand-500 transition-colors">
                            <Copy className="w-3 h-3" />
                          </button>
                          <a href={`/book?id=${oh.id}`} target="_blank" rel="noopener noreferrer"
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-brand-500 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {isAdmin && (
                            <button onClick={() => deleteOH(oh.id)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/oh:opacity-100">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Assign Panel ── */}
      <AnimatePresence>
        {assigningTo && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="bg-white rounded-2xl border-2 border-brand-200 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Assign to: {programs.find((p) => p.id === assigningTo)?.name}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{selectedSubs.size} selected · {filteredUnassigned.length} unassigned</p>
              </div>
              <div className="flex gap-2">
                <button onClick={assignSubmissions} disabled={selectedSubs.size === 0}
                  className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold disabled:opacity-40 transition-all hover:-translate-y-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Assign ({selectedSubs.size})
                </button>
                <button onClick={() => { setAssigningTo(null); setSelectedSubs(new Set()); }}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enrollments..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-300" />
            </div>
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50 rounded-xl border border-slate-100">
              {filteredUnassigned.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No unassigned enrollments found</div>
              ) : (
                filteredUnassigned.map((sub) => (
                  <label key={sub.id} className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50/30 transition-colors cursor-pointer">
                    <input type="checkbox" checked={selectedSubs.has(sub.id)} onChange={() => toggleSub(sub.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{sub.name || 'No name'}</p>
                      <p className="text-xs text-slate-400 truncate">{sub.email} {sub.program ? `· ${sub.program}` : ''}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Office Hour Create Modal ── */}
      <AnimatePresence>
        {showOH && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowOH(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div drag dragMomentum={false} dragElastic={0.1}
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] pointer-events-auto">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 cursor-grab active:cursor-grabbing select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 rounded-full bg-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Schedule Office Hour</h3>
                  </div>
                  <button onClick={() => setShowOH(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-xs text-slate-400">For: <strong className="text-slate-600">{programs.find((p) => p.id === ohProgId)?.name}</strong></p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Session Title *</label>
                    <input value={newOH.title} onChange={(e) => setNewOH({ ...newOH, title: e.target.value })} placeholder="e.g. Week 3 Office Hour"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Date *</label>
                    <input type="date" value={newOH.date} onChange={(e) => setNewOH({ ...newOH, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Start</label>
                      <input type="time" value={newOH.startTime} onChange={(e) => setNewOH({ ...newOH, startTime: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">End</label>
                      <input type="time" value={newOH.endTime} onChange={(e) => setNewOH({ ...newOH, endTime: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Slots</label>
                      <input type="number" min="1" value={newOH.slots} onChange={(e) => setNewOH({ ...newOH, slots: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                    </div>
                  </div>
                  <button onClick={createOfficeHour} disabled={creatingOH || !newOH.title || !newOH.date}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {creatingOH ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create & Get Link <Link2 className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
