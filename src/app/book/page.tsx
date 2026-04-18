'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Clock, Calendar, Users, CheckCircle2, Loader2, User, AlertCircle, Mail, ArrowRight, ArrowLeft
} from 'lucide-react';

type OfficeHour = { id: string; title: string; day?: string; days?: string[]; startTime: string; endTime: string; slotMinutes: number; dateFrom: string; dateTo: string; bookings: any[] };
type Student = { id: string; name: string; email: string };

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseLocalDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function fmtDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildAvailableDates(dateFrom: string, dateTo: string, allowedDays: string[]): { key: string; label: string; weekday: string }[] {
  const start = parseLocalDate(dateFrom);
  const end = parseLocalDate(dateTo);
  if (!start || !end) return [];
  const allowed = new Set(allowedDays);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out: { key: string; label: string; weekday: string }[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const wd = WEEKDAYS[cur.getDay()];
    if ((allowed.size === 0 || allowed.has(wd)) && cur >= today) {
      out.push({
        key: fmtDateKey(cur),
        label: cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: wd,
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function generateSlots(start: string, end: string, mins: number) {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let t = sh * 60 + sm; const endT = eh * 60 + em;
  while (t + mins <= endT) {
    const h1 = Math.floor(t / 60), m1 = t % 60, h2 = Math.floor((t + mins) / 60), m2 = (t + mins) % 60;
    slots.push(`${String(h1).padStart(2, '0')}:${String(m1).padStart(2, '0')}–${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`);
    t += mins;
  }
  return slots;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [oh, setOh] = useState<OfficeHour | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'date' | 'slot' | 'details' | 'success'>('date');
  const [selectedDates, setSelectedDates] = useState<{ key: string; label: string; weekday: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmedDates, setConfirmedDates] = useState<{ key: string; label: string; weekday: string }[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getDoc(doc(db, 'office_hours', id)).then((snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as OfficeHour;
        setOh(data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), where('formType', '==', 'enrollment'));
    getDocs(q).then((snap) => {
      const seen = new Set<string>();
      const list: Student[] = [];
      snap.docs.forEach((d) => {
        const data: any = d.data();
        const name = (data.name || data.fullName || '').trim();
        const email = (data.email || '').trim().toLowerCase();
        if (!name || !email || seen.has(email)) return;
        seen.add(email);
        list.push({ id: d.id, name, email });
      });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(list);
    }).catch(() => {});
  }, []);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oh || !selectedStudent || !selectedSlot || selectedDates.length === 0) return;
    const existing = oh.bookings || [];
    const existingKey = (b: any) => `${b.email}|${b.slot}`;
    const existingSet = new Set(existing.map(existingKey));
    const nowIso = new Date().toISOString();
    const newEntries = selectedDates
      .map((d) => ({
        name: selectedStudent.name,
        email: selectedStudent.email,
        studentId: selectedStudent.id,
        slot: `${d.key} ${selectedSlot}`,
        date: d.key,
        day: d.weekday,
        time: selectedSlot,
        bookedAt: nowIso,
      }))
      .filter((b) => !existingSet.has(existingKey(b)));
    if (newEntries.length === 0) { setError('You already booked the selected slot(s).'); return; }
    setSubmitting(true); setError('');
    try {
      await updateDoc(doc(db, 'office_hours', id), {
        bookings: arrayUnion(...newEntries),
      });
      setOh({ ...oh, bookings: [...existing, ...newEntries] });
      setConfirmedDates([...selectedDates]);
      setStep('success');
    } catch { setError('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  if (!id || !oh) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-5"><div className="text-center">
      <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Session Not Found</h2>
      <p className="text-slate-400 text-sm">This link may have expired.</p>
    </div></div>
  );

  const days = oh.days || (oh.day ? [oh.day] : []);
  const slots = generateSlots(oh.startTime, oh.endTime, oh.slotMinutes || 30);
  const bookings = oh.bookings || [];
  const availableDates = buildAvailableDates(oh.dateFrom, oh.dateTo, days);
  const getCount = (dateKey: string, slot: string) => bookings.filter((b: any) => (b.date || b.day) === dateKey && b.time === slot).length;
  const getDateCount = (dateKey: string) => bookings.filter((b: any) => (b.date || b.day) === dateKey).length;
  const slotStudents = bookings.filter((b: any) => selectedDates.some((d) => b.slot === `${d.key} ${selectedSlot}`));
  const displayTitle = 'Instructor Office Hour';
  const toggleDate = (d: { key: string; label: string; weekday: string }) => {
    setSelectedDates((prev) => prev.some((x) => x.key === d.key) ? prev.filter((x) => x.key !== d.key) : [...prev, d].sort((a, b) => a.key.localeCompare(b.key)));
  };
  const selectAllDates = () => setSelectedDates(availableDates);
  const clearDates = () => setSelectedDates([]);
  const fmtDateList = (list: { weekday: string; label: string }[]) =>
    list.map((d) => `${d.weekday.slice(0, 3)} ${d.label}`).join(', ');

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative w-10 h-10"><Image src="/logo-black.png" alt="ScholarlyEcho" fill className="object-contain" /></div>
          <span className="font-bold text-lg text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>ScholarlyEcho</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold mb-2"><Clock className="w-3.5 h-3.5" /> Office Hour Booking</div>
            <h1 className="text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{displayTitle}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {days.map((d) => d.slice(0, 3)).join(', ')}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {oh.startTime}–{oh.endTime}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {oh.slotMinutes || 30}min slots</span>
            </div>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">

              {/* Step 1: Pick Dates (multi-select) */}
              {step === 'date' && (
                <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Select Dates</h3>
                  <p className="text-xs text-slate-400 mb-3">Tap one or more dates. The same time slot will be booked for every date you pick.</p>
                  {availableDates.length === 0 ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> No upcoming dates available for this session.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-slate-500">{selectedDates.length} selected</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={selectAllDates} className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">Select all</button>
                          {selectedDates.length > 0 && (
                            <button type="button" onClick={clearDates} className="text-[11px] font-semibold text-slate-400 hover:text-slate-600">Clear</button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4 max-h-72 overflow-y-auto pr-1">
                        {availableDates.map((d) => {
                          const count = getDateCount(d.key);
                          const isSel = selectedDates.some((x) => x.key === d.key);
                          return (
                            <motion.button type="button" key={d.key} whileTap={{ scale: 0.97 }} onClick={() => toggleDate(d)}
                              className={`relative px-3 py-3 rounded-xl border-2 transition-all text-center group ${isSel ? 'border-emerald-400 bg-emerald-50' : 'border-slate-150 hover:border-emerald-300 hover:bg-emerald-50'}`}>
                              <div className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-600">{d.weekday.slice(0, 3)}</div>
                              <div className={`text-sm font-bold ${isSel ? 'text-emerald-700' : 'text-slate-700 group-hover:text-emerald-700'}`}>{d.label}</div>
                              {count > 0 && <div className="text-[10px] text-emerald-600 mt-1">{count} booked</div>}
                              {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute top-1.5 right-1.5" />}
                            </motion.button>
                          );
                        })}
                      </div>
                      <button type="button" onClick={() => { if (selectedDates.length > 0) { setSelectedSlot(''); setStep('slot'); } }} disabled={selectedDates.length === 0}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 2: Pick Slot */}
              {step === 'slot' && selectedDates.length > 0 && (
                <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => { setStep('date'); setSelectedSlot(''); }} className="text-xs text-slate-400 hover:text-slate-600 mb-3 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Change dates</button>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Pick a Slot</h3>
                  <p className="text-xs text-slate-500 mb-1">Applies to: <span className="font-semibold text-slate-700">{fmtDateList(selectedDates)}</span></p>
                  <p className="text-xs text-slate-400 mb-3">The same slot will be booked for each date selected.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mb-4">
                    {slots.map((slot) => {
                      const count = Math.max(...selectedDates.map((d) => getCount(d.key, slot)));
                      const isSel = selectedSlot === slot;
                      return (
                        <motion.button key={slot} whileTap={{ scale: 0.96 }} onClick={() => setSelectedSlot(slot)}
                          className={`relative px-2 py-2.5 rounded-xl border-2 text-center transition-all ${
                            isSel ? 'border-emerald-400 bg-emerald-50' : count > 0 ? 'border-emerald-100 bg-emerald-50/30 hover:border-emerald-300' : 'border-slate-100 hover:border-slate-200'
                          }`}>
                          <div className={`text-xs font-bold ${isSel ? 'text-emerald-700' : 'text-slate-700'}`}>{slot.split('–')[0]}</div>
                          <div className="text-[9px] text-slate-400">{slot.split('–')[1]}</div>
                          {count > 0 && (
                            <div className="mt-1 flex items-center justify-center gap-0.5">
                              <div className="flex -space-x-1">
                                {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                                  <div key={i} className="w-3 h-3 rounded-full bg-emerald-400 border border-white" />
                                ))}
                              </div>
                              <span className="text-[8px] font-bold text-emerald-600 ml-0.5">{count}</span>
                            </div>
                          )}
                          {isSel && <CheckCircle2 className="w-3 h-3 text-emerald-500 absolute top-1 right-1" />}
                        </motion.button>
                      );
                    })}
                  </div>
                  <button onClick={() => { if (selectedSlot) setStep('details'); }} disabled={!selectedSlot}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep('slot')} className="text-xs text-slate-400 hover:text-slate-600 mb-3 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Confirm Booking</h3>
                  <div className="rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-100 mt-1 mb-4 p-3">
                    <div className="flex items-center gap-1.5 font-bold mb-1.5"><Clock className="w-3 h-3" /> {selectedSlot} · {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDates.map((d) => (
                        <span key={d.key} className="px-2 py-0.5 rounded-md bg-white/70 border border-emerald-100 text-[11px] font-semibold">{d.weekday.slice(0, 3)} {d.label}</span>
                      ))}
                    </div>
                  </div>
                  {slotStudents.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mb-1.5"><Users className="w-3.5 h-3.5" /> {slotStudents.length} existing booking(s) across your selected dates</p>
                      <p className="text-[10px] text-emerald-600">Joining a group session is encouraged!</p>
                    </div>
                  )}
                  {error && <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs mb-4"><AlertCircle className="w-3.5 h-3.5" /> {error}</div>}
                  <form onSubmit={handleBook} className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Student Name *</label>
                      {students.length === 0 ? (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs">
                          <AlertCircle className="w-3.5 h-3.5" /> No registered students found. Please enroll first.
                        </div>
                      ) : (
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                          <select required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-emerald-400 bg-white appearance-none">
                            <option value="">Select your name…</option>
                            {students.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Email</label>
                      <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="email" readOnly value={selectedStudent?.email || ''} placeholder="Auto-filled from registration" className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm bg-slate-50 text-slate-600 focus:outline-none" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Email is auto-filled from your enrollment record.</p>
                    </div>
                    <button type="submit" disabled={submitting || !selectedStudent} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm Booking <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>You&apos;re Booked!</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 mb-3">
                    <Clock className="w-3 h-3" /> {selectedSlot} · {confirmedDates.length} date{confirmedDates.length > 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {confirmedDates.map((d) => (
                      <span key={d.key} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">{d.weekday.slice(0, 3)} {d.label}</span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm">{displayTitle}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-center text-slate-300 text-xs mt-6">Powered by ScholarlyEcho</p>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
