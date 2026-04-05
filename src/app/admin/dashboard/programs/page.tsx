'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/lib/useRole';
import {
  FolderKanban, Plus, X, Users, CheckCircle2, Trash2,
  ArrowRight, Search, Calendar, Loader2
} from 'lucide-react';

type Program = { id: string; name: string; description: string; startDate: string; status: string; createdAt: any };
type Submission = { id: string; formType: string; email?: string; name?: string; program?: string; assignedProgram?: string; createdAt: any; read: boolean; [key: string]: any };

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newProg, setNewProg] = useState({ name: '', description: '', startDate: '', status: 'upcoming' });
  const [creating, setCreating] = useState(false);
  const { isAdmin } = useRole();
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub1 = onSnapshot(query(collection(db, 'programs'), orderBy('createdAt', 'desc')), (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Program)));
    });
    const unsub2 = onSnapshot(query(collection(db, 'submissions'), orderBy('createdAt', 'desc')), (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const createProgram = async () => {
    if (!newProg.name) return;
    setCreating(true);
    await addDoc(collection(db, 'programs'), { ...newProg, createdAt: serverTimestamp() });
    setNewProg({ name: '', description: '', startDate: '', status: 'upcoming' });
    setShowCreate(false);
    setCreating(false);
  };

  const deleteProgram = async (id: string) => {
    await deleteDoc(doc(db, 'programs', id));
  };

  const assignSubmissions = async () => {
    if (!assigningTo || selectedSubs.size === 0) return;
    const prog = programs.find((p) => p.id === assigningTo);
    for (const subId of Array.from(selectedSubs)) {
      await updateDoc(doc(db, 'submissions', subId), { assignedProgram: prog?.name || assigningTo });
    }
    setSelectedSubs(new Set());
    setAssigningTo(null);
  };

  const toggleSub = (id: string) => {
    const next = new Set(selectedSubs);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSubs(next);
  };

  const unassigned = submissions.filter((s) => !s.assignedProgram && s.formType === 'enrollment');
  const filteredUnassigned = unassigned.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Programs</h2>
          <p className="text-slate-400 text-sm mt-1">Create programs and batch-assign enrollments.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> New Program
          </button>
        )}
      </div>

      {/* Create Program Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowCreate(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Create Program</h3>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
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
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors bg-white">
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <button onClick={createProgram} disabled={creating || !newProg.name}
                  className="w-full py-3.5 rounded-xl gradient-bg text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Program <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Programs List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {programs.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No programs yet. Create one to start batch-assigning signups.</p>
          </div>
        ) : (
          programs.map((prog, i) => {
            const assigned = submissions.filter((s) => s.assignedProgram === prog.name).length;
            return (
              <motion.div key={prog.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 p-5 relative group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${
                  prog.status === 'active' ? 'bg-emerald-500' : prog.status === 'completed' ? 'bg-slate-300' : 'bg-brand-500'
                }`} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{prog.name}</h4>
                    {prog.description && <p className="text-slate-400 text-xs mt-0.5">{prog.description}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prog.status === 'active' ? 'bg-emerald-50 text-emerald-600' : prog.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-brand-50 text-brand-600'
                  }`}>{prog.status}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  {prog.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {prog.startDate}</span>}
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {assigned} enrolled</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAssigningTo(prog.id === assigningTo ? null : prog.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      assigningTo === prog.id ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600'
                    }`}>
                    {assigningTo === prog.id ? 'Assigning...' : 'Assign Students'}
                  </button>
                  {isAdmin && <button onClick={() => deleteProgram(prog.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Assign Panel */}
      <AnimatePresence>
        {assigningTo && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="bg-white rounded-2xl border-2 border-brand-200 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Assign to: {programs.find((p) => p.id === assigningTo)?.name}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{selectedSubs.size} selected · {filteredUnassigned.length} unassigned enrollments</p>
              </div>
              <div className="flex gap-2">
                <button onClick={assignSubmissions} disabled={selectedSubs.size === 0}
                  className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold disabled:opacity-40 transition-all hover:-translate-y-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Assign ({selectedSubs.size})
                </button>
                <button onClick={() => { setAssigningTo(null); setSelectedSubs(new Set()); }}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enrollments..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-300 transition-colors" />
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
    </div>
  );
}
