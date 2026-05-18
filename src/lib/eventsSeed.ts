/**
 * Initial events. Auto-imported on first admin Events page load when the
 * `events` collection is empty. Skips any name that already exists.
 */

export type SeedEvent = {
  name: string;
  description: string;
  startDate: string;
  status: 'upcoming' | 'active' | 'completed';
  category: string;
  kind: 'program' | 'event';
  eventDate?: string;
  time?: string;
  location?: string;
  seats?: string;
  price?: string;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export const SEED_EVENTS: SeedEvent[] = [
  // ── Completed (home: Completed column) ──
  {
    name: 'Summer of Code 2025',
    description: 'Intensive summer coding bootcamp across 3 continents: 500+ students graduated.',
    startDate: '2025-06-01',
    status: 'completed',
    category: 'Learning Hub',
    kind: 'program',
  },
  {
    name: 'Build for Ramadan 2026',
    description: 'Special program blending tech education with community service during Ramadan.',
    startDate: '2026-03-01',
    status: 'completed',
    category: 'Community',
    kind: 'program',
  },
  {
    name: 'AI Track Launch 2025',
    description: 'Launch of AI Developer and Product Builder tracks with first cohort of 120 students.',
    startDate: '2025-09-01',
    status: 'completed',
    category: 'Learning Hub',
    kind: 'program',
  },
  // ── Upcoming program (home: Upcoming column) ──
  {
    name: 'Idea2MVP. From Spark to Shipped Product',
    description: '10-week AI-native course plus a public Capstone Demo Day for ages 11 to 22. No coding background needed. Ship a real MVP with users using free-tier AI builders. Capstone, certificate, prizes.',
    startDate: '2026-05-31',
    status: 'upcoming',
    category: 'Accelerator',
    kind: 'program',
    ctaHref: '/idea2mvp-2026',
    ctaLabel: 'Program details',
  },
  {
    name: 'Summer Coding Bootcamp 2026',
    description: '6-week live bootcamp for ages 5+ and 9+. Two tracks: Logic Builders and Code Masters. Capstone project, certificate, and Demo Day. Early-bird registration open.',
    startDate: '2026-06-29',
    status: 'upcoming',
    category: 'Bootcamp',
    kind: 'program',
    ctaHref: '/summer-coding-2026',
    ctaLabel: 'Program details',
  },
];
