'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, ArrowRight, Sparkles,
  Trophy, Mic2, BookOpen, Ticket,
  Brain, Building2, Video, DollarSign, Filter, Rocket
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { useEvents, isPast, feeLabel, isFree, isVisible } from '@/lib/events';
import type { EventDoc } from '@/lib/events';
import InfoSessionPopup from '@/components/InfoSessionPopup';

const CATEGORY_ICON: Record<string, React.ElementType> = {
  'Learning Hub': BookOpen,
  'Spotlight Media': Mic2,
  'Code Prodigy': Brain,
  'Edutainment': Trophy,
  'Community': Users,
  'Hackathon': Brain,
  'Competition': Trophy,
  'Workshop': Sparkles,
  'Bootcamp': BookOpen,
  'Conference': Mic2,
  'Accelerator': Rocket,
};
function iconFor(category?: string): React.ElementType {
  return (category && CATEGORY_ICON[category]) || Sparkles;
}

const pastHighlights = [
  { title: '2025 Youth Tech Hackathon', participants: '340', projects: '82', winner: 'AI Farm Monitor by Aisha N.', color: 'from-brand-400 to-purple-500' },
  { title: '2025 Millionaire Game Show Tour', participants: '2,400', schools: '48', cities: '6', color: 'from-emerald-400 to-teal-600' },
  { title: 'Research Summit 2025', researchers: '12', orgs: '35', partnerships: '8', color: 'from-amber-400 to-orange-500' },
];

function parseEventDateLabel(p: EventDoc): { month: string; day: string; year: string } {
  if (p.eventDate) {
    const parts = p.eventDate.split(' ');
    return { month: parts[0] || '', day: (parts[1] || '').replace(',', ''), year: parts[2] || '' };
  }
  if (p.startDate) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(p.startDate);
    if (m) {
      const [, y, mo, d] = m;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return { month: months[parseInt(mo, 10) - 1] || '', day: String(parseInt(d, 10)), year: y };
    }
  }
  return { month: '', day: '', year: '' };
}

export default function EventsPage() {
  const { events: allEvents, loaded } = useEvents();
  const upcoming = useMemo(() => allEvents.filter((p) => isVisible(p) && !isPast(p)), [allEvents]);
  const [infoSessionEvent, setInfoSessionEvent] = useState<EventDoc | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    upcoming.forEach((e) => { if (e.category) set.add(e.category); });
    return ['All', ...Array.from(set)];
  }, [upcoming]);

  const events = useMemo(() => {
    if (activeCategory === 'All') return upcoming;
    return upcoming.filter((e) => e.category === activeCategory);
  }, [upcoming, activeCategory]);

  return (
    <div className="overflow-hidden">
      <InfoSessionPopup
        open={!!infoSessionEvent}
        onClose={() => setInfoSessionEvent(null)}
        source={`events-${infoSessionEvent?.id || 'unknown'}`}
        dateIso={infoSessionEvent?.infoSessionDate}
        timeLabel={infoSessionEvent?.infoSessionTime}
        eventName={infoSessionEvent?.name}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay text-center overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        {/* Aurora orbs */}
        <motion.div aria-hidden
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[8%] w-[480px] h-[480px] rounded-full opacity-[0.16] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.25, 1], x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[5%] right-[8%] w-[420px] h-[420px] rounded-full opacity-[0.14] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[35%] right-[25%] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-3xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-white/70 text-[13px] font-medium mb-6 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-amber-300" /> Events, Hackathons & Competitions
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-[-0.03em] leading-[1.05]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Where Learning <span className="gradient-text-animated">Goes Live</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg mb-8 leading-[1.75] max-w-2xl mx-auto">
            Hackathons, game shows, research summits, continental competitions: ScholarlyEcho events
            are where knowledge meets adrenaline, globally.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
            <Link href="/contact" className="btn-primary">
              Sponsor an Event <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.18] text-white font-semibold hover:bg-white/[0.08] hover:border-white/30 transition-all backdrop-blur-md">
              Book Game Show for School
            </Link>
          </motion.div>
        </div>

        {/* Bottom seam: animated gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.5) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ═══ EVENTS LIST ═══ */}
      <section className="py-14 sm:py-18 md:py-24 mesh-bg relative overflow-hidden">
        {/* Ambient orb behind list */}
        <div aria-hidden className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <SectionWrapper className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-600 text-[12px] font-bold mb-5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Upcoming
            </div>
            <h2 className="section-heading mb-4">
              Events <span className="gradient-text-animated">2026</span>
            </h2>
            <p className="section-subheading mx-auto">Register early: spaces fill fast. Many events are free.</p>
          </SectionWrapper>

          {/* Category filter chips */}
          {loaded && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-center flex-wrap gap-2 mb-10">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                <Filter className="w-3 h-3" /> Filter
              </span>
              {categories.map((c) => {
                const active = activeCategory === c;
                return (
                  <motion.button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                      active
                        ? 'text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700'
                    }`}>
                    {active && (
                      <motion.span layoutId="active-cat-pill"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }} />
                    )}
                    <span className="relative">{c}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!loaded ? (
                <motion.div key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="premium-card text-slate-400 text-sm text-center py-14">
                  <Sparkles className="w-6 h-6 mx-auto mb-3 text-slate-300 animate-pulse" />
                  Loading events…
                </motion.div>
              ) : events.length === 0 ? (
                <motion.div key="empty"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="premium-card text-slate-400 text-sm text-center py-14">
                  <Calendar className="w-7 h-7 mx-auto mb-3 text-slate-300" />
                  No upcoming events in this category. Check back soon.
                </motion.div>
              ) : events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i}
                  onOpenInfoSession={() => setInfoSessionEvent(event)} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══ PAST HIGHLIGHTS ═══ */}
      <section className="py-14 sm:py-18 md:py-24 bg-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <SectionWrapper className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[12px] font-bold mb-5">
              <Trophy className="w-3.5 h-3.5" /> Past Highlights
            </div>
            <h2 className="section-heading mb-4">
              Where We&apos;ve <span className="gradient-text-animated">Been</span>
            </h2>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            {pastHighlights.map(({ title, color, ...stats }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 20 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl bg-gradient-to-br ${color} p-7 overflow-hidden group`}>

                {/* Animated radial glow */}
                <motion.div aria-hidden
                  animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  className="absolute -top-10 -right-10 w-48 h-48 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />

                {/* Shimmer sweep on hover */}
                <motion.div aria-hidden
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '120%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />

                <div className="relative z-10">
                  <h4 className="text-white font-bold text-[15px] mb-5 group-hover:translate-x-0.5 transition-transform"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {title}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats).map(([key, val]) => (
                      <div key={key} className="bg-white/[0.18] backdrop-blur-md rounded-xl p-3 border border-white/[0.12]">
                        <div className="text-white font-extrabold text-lg leading-tight">{val as string}</div>
                        <div className="text-white/75 text-[10px] capitalize mt-0.5">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPONSOR CTA ═══ */}
      <section className="py-14 sm:py-18 md:py-24 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>

        {/* Aurora */}
        <motion.div aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(110,66,255,0.4) 0%, transparent 60%)' }} />

        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <SectionWrapper>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_8px_32px_rgba(245,158,11,0.4)] mb-6">
              <Building2 className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Sponsor or <span className="gradient-text-animated">Co-Host</span> an Event
            </h2>
            <p className="text-white/55 max-w-xl mx-auto mb-8 text-[15px] leading-relaxed">
              Put your brand at the forefront of global youth development. Co-brand events,
              reach thousands of learners, parents, and educators: and make a measurable difference.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
              <Link href="/contact" className="btn-primary">Discuss Sponsorship <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-white">Book Game Show for School</Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}

/* ─────────── Event Card (premium, animated) ─────────── */
type EventCardProps = {
  event: EventDoc;
  index: number;
  onOpenInfoSession: () => void;
};

/** Shared animated aurora used by Info Session button — also drives the date panel and Register button. */
const AURORA_BG = 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)';
const AURORA_BG_ANIMATED: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899, #3b82f6, #6e42ff)',
  backgroundSize: '300% 300%',
  animation: 'aurora 6s ease infinite',
};

function EventCard({ event, index, onOpenInfoSession }: EventCardProps) {
  const Icon = iconFor(event.category);
  const dateLabel = parseEventDateLabel(event);
  const fee = feeLabel(event);
  const free = isFree(event);
  const hasInfoSession = !!(event.infoSessionEnabled && event.infoSessionDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 120, damping: 22 }}
      whileHover={{ y: -4 }}
      className="relative group">

      {/* Animated gradient ring border */}
      <div aria-hidden
        className="absolute -inset-[1.5px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(110,66,255,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(110,66,255,0.6))`,
          backgroundSize: '300% 300%',
          animation: 'aurora 6s ease infinite',
        }} />

      <div className="relative bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] group-hover:shadow-[0_24px_48px_rgba(110,66,255,0.12)] transition-shadow duration-500 overflow-hidden">

        {/* Aurora ambient glow */}
        <div aria-hidden
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none blur-3xl"
          style={{ background: AURORA_BG }} />

        <div className="flex flex-col md:flex-row gap-5 relative">
          {/* Date panel */}
          <div className="relative md:w-32 h-28 md:h-auto rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 overflow-hidden shadow-md"
            style={AURORA_BG_ANIMATED}>
            {/* Animated radial sparkle */}
            <motion.div aria-hidden
              animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
              className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.45), transparent 60%)' }} />
            {/* Shimmer */}
            <motion.div aria-hidden
              initial={{ x: '-120%' }} animate={{ x: '120%' }}
              transition={{ repeat: Infinity, repeatDelay: 6, duration: 2.4, ease: 'easeInOut', delay: index * 0.4 }}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />
            <div className="relative z-10 text-center px-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-90">{dateLabel.month}</div>
              <div className="text-4xl font-extrabold leading-none my-0.5"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {dateLabel.day}
              </div>
              <div className="text-[10px] opacity-80">{dateLabel.year}</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {event.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-900/[0.04] text-slate-700 border border-slate-200/60">
                  <Icon className="w-3 h-3" /> {event.category}
                </span>
              )}
              {fee && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  free
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  <DollarSign className="w-3 h-3" /> Fee: {fee}
                </span>
              )}
              {event.prizes && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100">
                  <Trophy className="w-3 h-3" /> Prize: {event.prizes}
                </span>
              )}
              {event.seats && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-50 text-brand-700 border border-brand-100">
                  <Ticket className="w-3 h-3" /> Seats: {event.seats}
                </span>
              )}
              {event.badge && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100">
                  {event.badge}
                </span>
              )}
            </div>

            <h3 className="text-[18px] font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {event.name}
            </h3>
            {event.description && (
              <p className="text-slate-500 text-[13.5px] mb-3.5 leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-400">
              {event.time && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {event.time}</span>}
              {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {event.location}</span>}
            </div>
          </div>

          {/* CTA column */}
          <div className="flex flex-col items-stretch md:items-end justify-center gap-2 flex-shrink-0 md:min-w-[180px]">
            {event.ctaHref && (
              <Link href={event.ctaHref}
                className="group/btn relative px-5 py-3 rounded-xl font-extrabold text-[13px] whitespace-nowrap flex items-center justify-center gap-2 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                style={AURORA_BG_ANIMATED}>
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                <span className="relative">{event.ctaLabel || 'Register'}</span>
                <ArrowRight className="w-4 h-4 relative group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            )}
            {hasInfoSession && (
              <button type="button" onClick={onOpenInfoSession}
                className="group/btn relative px-4 py-2.5 rounded-xl font-bold text-[12px] whitespace-normal text-center flex items-center justify-center gap-1.5 text-white transition-all hover:-translate-y-0.5 overflow-hidden shadow-sm border border-white/30"
                style={AURORA_BG_ANIMATED}>
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
                <Video className="w-3.5 h-3.5 flex-shrink-0 relative" />
                <span className="relative">Join Info Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
