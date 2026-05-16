'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export type EventDoc = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: 'upcoming' | 'active' | 'completed' | string;
  category?: string;
  kind?: 'program' | 'event' | string;
  // Optional display fields
  eventDate?: string;
  time?: string;
  location?: string;
  seats?: string;
  price?: string;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
  // Registration fee (preferred over the legacy `price` text field)
  registrationFeeType?: 'free' | 'paid' | string;
  registrationFeeAmount?: string;
  // Prizes shown on the card, e.g. "$5,000 in prizes" or "Trophy + Scholarship"
  prizes?: string;
  // Per-event info session add-on
  infoSessionEnabled?: boolean;
  infoSessionDate?: string;
  infoSessionTime?: string;
  // Visibility: when true the event is hidden from the public site (admin-only)
  hidden?: boolean;
  createdAt?: { toDate?: () => Date } | Date | null;
};

const CATEGORY_TAG_COLOR: Record<string, string> = {
  'Learning Hub': 'bg-brand-50 text-brand-600',
  'Spotlight Media': 'bg-amber-50 text-amber-600',
  'Code Prodigy': 'bg-purple-50 text-purple-600',
  'Edutainment': 'bg-emerald-50 text-emerald-600',
  'Community': 'bg-emerald-50 text-emerald-600',
  'Accelerator': 'bg-rose-50 text-rose-600',
};
const CATEGORY_GRADIENT: Record<string, string> = {
  'Learning Hub': 'from-brand-500 to-purple-600',
  'Spotlight Media': 'from-amber-400 to-orange-500',
  'Code Prodigy': 'from-purple-500 to-indigo-600',
  'Edutainment': 'from-emerald-400 to-teal-600',
  'Community': 'from-violet-400 to-purple-600',
  'Accelerator': 'from-rose-500 to-pink-600',
};
const FALLBACK_TAG = 'bg-slate-100 text-slate-600';
const FALLBACK_GRADIENT = 'from-slate-400 to-slate-600';

export function tagColorFor(category?: string) {
  return (category && CATEGORY_TAG_COLOR[category]) || FALLBACK_TAG;
}
export function gradientFor(category?: string) {
  return (category && CATEGORY_GRADIENT[category]) || FALLBACK_GRADIENT;
}

function toMillis(value: EventDoc['createdAt']): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof (value as any).toDate === 'function') return (value as any).toDate().getTime();
  return 0;
}

/**
 * Subscribe to the `events` Firestore collection.
 * `loaded` flips to true after the first snapshot.
 */
export function useEvents() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventDoc, 'id'>) }));
      docs.sort((a, b) => {
        const aD = a.startDate || '';
        const bD = b.startDate || '';
        if (aD && bD && aD !== bD) return aD.localeCompare(bD);
        if (aD && !bD) return -1;
        if (bD && !aD) return 1;
        return toMillis(b.createdAt) - toMillis(a.createdAt);
      });
      setEvents(docs);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  return { events, loaded };
}

export function isPast(p: EventDoc) {
  return (p.status || '').toLowerCase() === 'completed';
}
export function isUpcoming(p: EventDoc) {
  return !isPast(p);
}
/** Public pages should hide events flagged as hidden by admin. */
export function isVisible(p: EventDoc) {
  return !p.hidden;
}

/** Resolves the registration fee to a display label. Prefers structured fields, falls back to legacy `price`. */
export function feeLabel(p: EventDoc): string | null {
  if (p.registrationFeeType === 'free') return 'Free';
  if (p.registrationFeeType === 'paid' && p.registrationFeeAmount) return p.registrationFeeAmount;
  if (p.price) return p.price;
  return null;
}
export function isFree(p: EventDoc): boolean {
  if (p.registrationFeeType === 'free') return true;
  if (p.registrationFeeType === 'paid') return false;
  return !!(p.price && /free/i.test(p.price));
}
