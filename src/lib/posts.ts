'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export type PostStatus = 'draft' | 'published';

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string; // markdown
  category?: string;
  tags?: string[];
  imageUrl?: string;
  imagePath?: string; // Firebase Storage path for cleanup
  author?: string;
  readMinutes?: number;
  status?: PostStatus;
  featured?: boolean;
  publishedAt?: string; // ISO date
  createdAt?: { toDate?: () => Date } | Date | null;
  updatedAt?: { toDate?: () => Date } | Date | null;
};

export const POST_CATEGORIES = [
  'AI Education',
  'Learning',
  'Research',
  'Impact Stories',
  'Events',
  'Community',
  'Programs',
  'Parents & Homeschool',
] as const;

const CATEGORY_GRADIENT: Record<string, string> = {
  'AI Education': 'from-brand-500 to-purple-600',
  'Learning': 'from-emerald-400 to-teal-500',
  'Research': 'from-amber-400 to-orange-500',
  'Impact Stories': 'from-rose-400 to-pink-500',
  'Events': 'from-teal-400 to-cyan-500',
  'Community': 'from-blue-400 to-brand-500',
  'Programs': 'from-purple-500 to-indigo-600',
  'Parents & Homeschool': 'from-amber-400 to-pink-500',
};
const CATEGORY_TAG_COLOR: Record<string, string> = {
  'AI Education': 'bg-brand-50 text-brand-600',
  'Learning': 'bg-emerald-50 text-emerald-600',
  'Research': 'bg-amber-50 text-amber-600',
  'Impact Stories': 'bg-rose-50 text-rose-600',
  'Events': 'bg-teal-50 text-teal-600',
  'Community': 'bg-blue-50 text-blue-600',
  'Programs': 'bg-purple-50 text-purple-600',
  'Parents & Homeschool': 'bg-pink-50 text-pink-600',
};
const FALLBACK_GRADIENT = 'from-slate-400 to-slate-600';
const FALLBACK_TAG = 'bg-slate-100 text-slate-600';

export function gradientFor(category?: string) {
  return (category && CATEGORY_GRADIENT[category]) || FALLBACK_GRADIENT;
}
export function tagColorFor(category?: string) {
  return (category && CATEGORY_TAG_COLOR[category]) || FALLBACK_TAG;
}

function toMillis(value: Post['createdAt']): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  return 0;
}

/** Slug-safe version of a string: lowercase, dashes, ascii only. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/** Estimate read time in whole minutes (≈ 220 words/min). Minimum 1. */
export function estimateReadMinutes(markdown: string | undefined): number {
  if (!markdown) return 1;
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** Format a Date or ISO string as "Mon DD, YYYY". */
export function formatPostDate(value?: string | Date | null): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Subscribe to all posts ordered by publishedAt desc, fallback to createdAt. */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) }));
      docs.sort((a, b) => {
        const ap = a.publishedAt || '';
        const bp = b.publishedAt || '';
        if (ap && bp && ap !== bp) return bp.localeCompare(ap);
        if (ap && !bp) return -1;
        if (bp && !ap) return 1;
        return toMillis(b.createdAt) - toMillis(a.createdAt);
      });
      setPosts(docs);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  return { posts, loaded };
}

export function isPublished(p: Post) {
  return (p.status || 'draft') === 'published';
}
