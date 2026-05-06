'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, ArrowRight, Sparkles,
  Trophy, Mic2, BookOpen, Gamepad2, Ticket, Globe,
  Brain, Rocket, Building2, Star, Video, DollarSign
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { useEvents, gradientFor, tagColorFor, isPast, feeLabel, isFree } from '@/lib/events';
import type { EventDoc } from '@/lib/events';
import InfoSessionPopup from '@/components/InfoSessionPopup';

const CATEGORY_ICON: Record<string, React.ElementType> = {
  'Learning Hub': BookOpen,
  'Spotlight Media': Mic2,
  'Code Prodigy': Brain,
  'Edutainment': Trophy,
  'Community': Users,
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
  // /events is the catch-all listing for everything happening — show both events and upcoming programs.
  const events = allEvents.filter((p) => !isPast(p));
  const [infoSessionEvent, setInfoSessionEvent] = useState<EventDoc | null>(null);
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

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay text-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-3xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
            <Calendar className="w-3.5 h-3.5 text-amber-300" /> Events, Hackathons & Competitions
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Where Learning Goes Live
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg mb-8 leading-[1.75]">
            Hackathons, game shows, research summits, continental competitions: ScholarlyEcho events
            are where knowledge meets adrenaline, globally.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
            <Link href="/contact" className="btn-primary">
              Sponsor an Event <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/18 text-white font-semibold hover:bg-white/10 transition-all">
              Book Game Show for School
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Events List ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <h2 className="section-heading mb-4">Upcoming Events 2026</h2>
            <p className="section-subheading mx-auto">Register early: spaces fill fast. Many events are free.</p>
          </SectionWrapper>

          <div className="space-y-5">
            {!loaded ? (
              <div className="premium-card text-slate-400 text-sm text-center py-10">Loading…</div>
            ) : events.length === 0 ? (
              <div className="premium-card text-slate-400 text-sm text-center py-10">No upcoming events announced yet. Check back soon.</div>
            ) : events.map((event, i) => {
              const Icon = iconFor(event.category);
              const gradient = gradientFor(event.category);
              const tag = tagColorFor(event.category);
              const dateLabel = parseEventDateLabel(event);
              const fee = feeLabel(event);
              const free = isFree(event);
              const hasInfoSession = !!(event.infoSessionEnabled && event.infoSessionDate);
              return (
                <motion.div key={event.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="premium-card overflow-hidden group hover:border-transparent hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Date panel */}
                    <div className={`md:w-28 h-24 md:h-auto rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white flex-shrink-0 relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent)' }} />
                      <div className="relative z-10 text-center px-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{dateLabel.month}</div>
                        <div className="text-3xl font-extrabold">{dateLabel.day}</div>
                        <div className="text-[10px] opacity-80">{dateLabel.year}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        {event.category && (
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${tag}`}>
                            <Icon className="w-3 h-3" /> {event.category}
                          </span>
                        )}
                        {fee && (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${free ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {fee}
                          </span>
                        )}
                        {event.prizes && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> {event.prizes}
                          </span>
                        )}
                        {event.badge && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                            {event.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {event.name}
                      </h3>
                      {event.description && <p className="text-slate-500 text-[13px] mb-3.5 leading-relaxed">{event.description}</p>}

                      <div className="flex flex-wrap gap-4 text-[12px] text-slate-400">
                        {event.time && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>}
                        {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>}
                        {event.seats && <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" /> {event.seats}</span>}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col items-stretch md:items-end justify-center gap-2 flex-shrink-0">
                      {event.ctaHref ? (
                        <Link href={event.ctaHref}
                          className={`px-6 py-3 rounded-xl font-bold text-[13px] whitespace-nowrap flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} text-white hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-md`}>
                          {event.ctaLabel || 'Register'} <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : null}
                      {hasInfoSession && (
                        <button type="button" onClick={() => setInfoSessionEvent(event)}
                          className="px-4 py-2.5 rounded-xl font-bold text-[12px] whitespace-nowrap flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-all">
                          <Video className="w-3.5 h-3.5" /> Info Session
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Past Highlights ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-heading mb-4">Previous Event Highlights</h2>
          </SectionWrapper>
          <div className="grid md:grid-cols-3 gap-6">
            {pastHighlights.map(({ title, color, ...stats }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl bg-gradient-to-br ${color} p-7 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-15"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent)' }} />
                <div className="relative z-10">
                  <h4 className="text-white font-bold text-[15px] mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats).map(([key, val]) => (
                      <div key={key} className="bg-white/15 rounded-xl p-3">
                        <div className="text-white font-extrabold text-lg">{val as string}</div>
                        <div className="text-white/70 text-[10px] capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sponsor CTA ── */}
      <section className="py-14 sm:py-18 md:py-24 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(110,66,255,0.15) 0%, transparent 60%)' }} />
          <SectionWrapper>
            <Building2 className="w-12 h-12 mx-auto mb-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Sponsor or Co-Host an Event
            </h2>
            <p className="text-white/40 max-w-xl mx-auto mb-8 text-[15px] leading-relaxed">
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
