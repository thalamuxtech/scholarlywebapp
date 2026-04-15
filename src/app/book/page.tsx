'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Clock, Calendar, Users, CheckCircle2, Loader2, User, AlertCircle, Mail, ArrowRight, ArrowLeft
} from 'lucide-react';

type OfficeHour = { id: string; title: string; day?: string; days?: string[]; startTime: string; endTime: string; slotMinutes: number; dateFrom: string; dateTo: string; bookings: any[] };

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
  const [step, setStep] = useState<'day' | 'slot' | 'details' | 'success'>('day');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getDoc(doc(db, 'office_hours', id)).then((snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as OfficeHour;
        setOh(data);
        const days = data.days || (data.day ? [data.day] : []);
        if (days.length === 1) { setSelectedDay(days[0]); setStep('slot'); }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oh || !name || !email || !selectedSlot || !selectedDay) return;
    const bookings = oh.bookings || [];
    const fullSlot = `${selectedDay} ${selectedSlot}`;
    if (bookings.some((b: any) => b.email === email && b.slot === fullSlot)) { setError('You already booked this slot.'); return; }
    setSubmitting(true); setError('');
    try {
      await updateDoc(doc(db, 'office_hours', id), {
        bookings: arrayUnion({ name, email, slot: fullSlot, day: selectedDay, time: selectedSlot, bookedAt: new Date().toISOString() }),
      });
      setOh({ ...oh, bookings: [...bookings, { name, email, slot: fullSlot, day: selectedDay, time: selectedSlot }] });
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
  const getCount = (day: string, slot: string) => bookings.filter((b: any) => b.day === day && b.time === slot).length;
  const getDayCount = (day: string) => bookings.filter((b: any) => b.day === day).length;
  const fullSlot = `${selectedDay} ${selectedSlot}`;
  const slotStudents = bookings.filter((b: any) => b.slot === fullSlot);

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
            <h1 className="text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{oh.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {days.map((d) => d.slice(0, 3)).join(', ')}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {oh.startTime}–{oh.endTime}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {oh.slotMinutes || 30}min slots</span>
            </div>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">

              {/* Step 1: Pick Day */}
              {step === 'day' && (
                <motion.div key="day" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Select a Day</h3>
                  <p className="text-xs text-slate-400 mb-4">Choose your preferred day for the office hour.</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {days.map((d) => {
                      const count = getDayCount(d);
                      return (
                        <motion.button key={d} whileTap={{ scale: 0.97 }} onClick={() => { setSelectedDay(d); setStep('slot'); }}
                          className="px-3 py-4 rounded-xl border-2 border-slate-150 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center group">
                          <div className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">{d}</div>
                          {count > 0 && <div className="text-[10px] text-emerald-600 mt-1">{count} booked</div>}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Pick Slot */}
              {step === 'slot' && (
                <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {days.length > 1 && (
                    <button onClick={() => { setStep('day'); setSelectedSlot(''); }} className="text-xs text-slate-400 hover:text-slate-600 mb-3 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Change day</button>
                  )}
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{selectedDay} — Pick a Slot</h3>
                  <p className="text-xs text-slate-400 mb-3">Group sessions are encouraged for better learning.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mb-4">
                    {slots.map((slot) => {
                      const count = getCount(selectedDay, slot);
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 mt-1 mb-4">
                    <Clock className="w-3 h-3" /> {selectedDay} · {selectedSlot}
                  </div>
                  {slotStudents.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mb-1.5"><Users className="w-3.5 h-3.5" /> {slotStudents.length} student(s) already in this slot</p>
                      <p className="text-[10px] text-emerald-600">Joining a group session is encouraged!</p>
                    </div>
                  )}
                  {error && <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs mb-4"><AlertCircle className="w-3.5 h-3.5" /> {error}</div>}
                  <form onSubmit={handleBook} className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Name *</label>
                      <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-emerald-400" />
                      </div>
                    </div>
                    <div><label className="text-xs font-bold text-slate-700 mb-1.5 block">Email *</label>
                      <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-emerald-400" />
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
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
                    <Clock className="w-3 h-3" /> {selectedDay} · {selectedSlot}
                  </div>
                  <p className="text-slate-400 text-sm">{oh.title}</p>
                  {slotStudents.length > 1 && <p className="text-emerald-600 text-xs font-medium mt-2">You&apos;re in a group of {slotStudents.length}!</p>}
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
