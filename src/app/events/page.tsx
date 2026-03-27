'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, ArrowRight, Sparkles,
  Trophy, Mic2, BookOpen, Gamepad2, Ticket, Globe,
  Brain, Rocket, Building2, Star
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

const events = [
  {
    date: 'April 12, 2026', time: '9:00 AM – 5:00 PM UTC',
    title: 'Global Holiday Coding Bootcamp — AI Edition',
    type: 'Learning Hub', icon: BookOpen,
    location: 'Online (Worldwide) + Lagos Hub',
    seats: '120 seats', price: '$29 / Free on scholarship',
    color: 'from-brand-500 to-purple-600',
    tagColor: 'bg-brand-50 text-brand-600',
    desc: '10-day Easter bootcamp — learners choose from Web Dev, AI Foundations, or Product Builder sprint tracks. Live sessions, mentors, final project demo.',
    badge: 'Multi-track',
  },
  {
    date: 'April 26, 2026', time: '10:00 AM – 3:00 PM (Local)',
    title: 'Millionaire Game Show — Continental Tour 2026',
    type: 'Edutainment', icon: Trophy,
    location: 'Lagos · Accra · Nairobi · London (Livestreamed)',
    seats: '500 per city', price: 'Free to attend',
    color: 'from-emerald-400 to-teal-600',
    tagColor: 'bg-emerald-50 text-emerald-600',
    desc: 'Our flagship educational game show returns — now across 4 cities simultaneously with a live global leaderboard. Schools compete for the continental title.',
    badge: 'Multi-city',
  },
  {
    date: 'May 8–9, 2026', time: 'All Day (UTC)',
    title: 'Research-to-Impact Global Summit',
    type: 'Spotlight Media', icon: Mic2,
    location: 'Virtual — Zoom (Global)',
    seats: 'Unlimited virtual', price: 'Free',
    color: 'from-amber-400 to-orange-500',
    tagColor: 'bg-amber-50 text-amber-600',
    desc: '2-day virtual event featuring 10 thesis spotlights, implementation workshops, panel discussions, and community matchmaking for researchers and NGOs.',
    badge: '2-day Summit',
  },
  {
    date: 'May 24–25, 2026', time: '48 Hours',
    title: 'ScholarlyEcho AI Hackathon 2026',
    type: 'Code Prodigy', icon: Brain,
    location: 'Maryland, USA + Online (Global)',
    seats: '80 teams globally', price: '$15/team',
    color: 'from-purple-500 to-indigo-600',
    tagColor: 'bg-purple-50 text-purple-600',
    desc: '48-hour global hackathon for youth 13–25. Build AI-powered solutions for real community challenges. $5,000 in prizes + mentorship from industry leaders.',
    badge: '$5K prizes',
  },
  {
    date: 'June 14, 2026', time: '10:00 AM – 2:00 PM WAT',
    title: 'World Flag Challenge — African Continental Finals',
    type: 'Edutainment', icon: Globe,
    location: 'Abuja, Nigeria + Livestream',
    seats: '300 seats', price: 'Free',
    color: 'from-teal-400 to-cyan-500',
    tagColor: 'bg-teal-50 text-teal-600',
    desc: 'Top school teams from 12 African countries compete in the Continental Finals of the World National Flag Challenge. Certificates, trophies, and scholarships on offer.',
    badge: 'Continental',
  },
  {
    date: 'July 5, 2026', time: '10:00 AM – 4:00 PM',
    title: 'ScholarlyEcho Open Day — Global Edition',
    type: 'Community', icon: Users,
    location: 'Maryland, USA + Lagos, Nigeria + Virtual',
    seats: 'Open registration', price: 'Free',
    color: 'from-violet-400 to-purple-600',
    tagColor: 'bg-violet-50 text-violet-600',
    desc: 'Meet the team, watch live student project demos, attend free workshops in AI, coding, and product design, and learn everything about our programs for 2026–27.',
    badge: 'Free',
  },
];

const pastHighlights = [
  { title: '2025 Youth Tech Hackathon', participants: '340', projects: '82', winner: 'AI Farm Monitor by Aisha N.', color: 'from-brand-400 to-purple-500' },
  { title: '2025 Millionaire Game Show Tour', participants: '2,400', schools: '48', cities: '6', color: 'from-emerald-400 to-teal-600' },
  { title: 'Research Summit 2025', researchers: '12', orgs: '35', partnerships: '8', color: 'from-amber-400 to-orange-500' },
];

export default function EventsPage() {
  return (
    <div className="overflow-hidden">

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
            Hackathons, game shows, research summits, continental competitions — ScholarlyEcho events
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
            <p className="section-subheading mx-auto">Register early — spaces fill fast. Many events are free.</p>
          </SectionWrapper>

          <div className="space-y-5">
            {events.map((event, i) => {
              const Icon = event.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="premium-card overflow-hidden group hover:border-transparent hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Date panel */}
                    <div className={`md:w-28 h-24 md:h-auto rounded-2xl bg-gradient-to-br ${event.color} flex flex-col items-center justify-center text-white flex-shrink-0 relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent)' }} />
                      <div className="relative z-10 text-center px-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{event.date.split(' ')[0]}</div>
                        <div className="text-3xl font-extrabold">{event.date.split(' ')[1]?.replace(',', '')}</div>
                        <div className="text-[10px] opacity-80">{event.date.split(' ')[2]}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${event.tagColor}`}>
                          <Icon className="w-3 h-3" /> {event.type}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${event.price.startsWith('$') || event.price === 'Free' || event.price.includes('Free') ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {event.price}
                        </span>
                        {(event as any).badge && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                            {(event as any).badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {event.title}
                      </h3>
                      <p className="text-slate-500 text-[13px] mb-3.5 leading-relaxed">{event.desc}</p>

                      <div className="flex flex-wrap gap-4 text-[12px] text-slate-400">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" /> {event.seats}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center flex-shrink-0">
                      <Link href="/contact"
                        className={`px-6 py-3 rounded-xl font-bold text-[13px] whitespace-nowrap flex items-center gap-2 bg-gradient-to-r ${event.color} text-white hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-md`}>
                        Register <ArrowRight className="w-4 h-4" />
                      </Link>
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
              reach thousands of learners, parents, and educators — and make a measurable difference.
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
