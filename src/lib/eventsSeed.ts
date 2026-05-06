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
  // ── Past programs (home: Completed column) ──
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
    name: 'Summer Coding Bootcamp 2026',
    description: '6-week live bootcamp for ages 5+ and 9+. Two tracks: Logic Builders and Code Masters. Capstone project, certificate, and Demo Day. Early-bird registration open.',
    startDate: '2026-06-29',
    status: 'upcoming',
    category: 'Learning Hub',
    kind: 'program',
    ctaHref: '/summer-coding-2026',
    ctaLabel: 'Program details',
  },
  // ── Upcoming events (events page) ──
  {
    name: 'Global Holiday Coding Bootcamp: AI Edition',
    description: '10-day Easter bootcamp: learners choose from Web Dev, AI Foundations, or Product Builder sprint tracks. Live sessions, mentors, final project demo.',
    startDate: '2026-04-12',
    status: 'upcoming',
    category: 'Learning Hub',
    kind: 'event',
    eventDate: 'April 12, 2026',
    time: '9:00 AM – 5:00 PM UTC',
    location: 'Online (Worldwide) + Lagos Hub',
    seats: '120 seats',
    price: '$29 / Free on scholarship',
    badge: 'Multi-track',
  },
  {
    name: 'ScholarlyEcho AI Hackathon 2026',
    description: '48-hour global hackathon for youth 13–25. Build AI-powered solutions for real community challenges. $5,000 in prizes + mentorship from industry leaders.',
    startDate: '2026-05-24',
    status: 'upcoming',
    category: 'Code Prodigy',
    kind: 'event',
    eventDate: 'May 24–25, 2026',
    time: '48 Hours',
    location: 'Maryland, USA + Online (Global)',
    seats: '80 teams globally',
    price: '$15/team',
    badge: '$5K prizes',
  },
  {
    name: 'World Flag Challenge: African Continental Finals',
    description: 'Top school teams from 12 African countries compete in the Continental Finals of the World National Flag Challenge. Certificates, trophies, and scholarships on offer.',
    startDate: '2026-06-14',
    status: 'upcoming',
    category: 'Edutainment',
    kind: 'event',
    eventDate: 'June 14, 2026',
    time: '10:00 AM – 2:00 PM WAT',
    location: 'Abuja, Nigeria + Livestream',
    seats: '300 seats',
    price: 'Free',
    badge: 'Continental',
  },
  {
    name: 'ScholarlyEcho Open Day: Global Edition',
    description: 'Meet the team, watch live student project demos, attend free workshops in AI, coding, and product design, and learn everything about our programs for 2026–27.',
    startDate: '2026-07-05',
    status: 'upcoming',
    category: 'Community',
    kind: 'event',
    eventDate: 'July 5, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Maryland, USA + Lagos, Nigeria + Virtual',
    seats: 'Open registration',
    price: 'Free',
    badge: 'Free',
  },
];
