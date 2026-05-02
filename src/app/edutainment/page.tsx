'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Trophy, Globe2, Zap, Users, Star,
  ArrowRight, Sparkles, Calendar, School, Bell,
  Target, Play, MapPin, CheckCircle2, Award, Globe,
  TrendingUp, Brain, Rocket, BarChart3, ChevronLeft, ChevronRight,
  ExternalLink, Smartphone, Loader2
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';

const products = [
  {
    id: 'millionaire',
    icon: Trophy,
    name: 'Millionaire Game Show',
    tag: 'Available Now',
    tagColor: 'bg-emerald-100 text-emerald-700',
    desc: 'An electrifying educational quiz show format inspired by "Who Wants to Be a Millionaire" — adapted for schools, communities, and global events. Students compete with knowledge as their currency, creating moments of genuine excitement and learning.',
    features: [
      'Curriculum-aligned question sets (Math, Science, History, Tech)',
      'Team or individual formats — 10 to 1,000 participants',
      'Live scoring + real-time global leaderboard',
      'School booking confirmed within 48hrs',
      'Custom branding & sponsor integration available',
      'Hosted virtually or in-person across all continents',
    ],
    cta: 'Book for Your School',
    ctaHref: '/contact',
    playUrl: 'https://millionaire-game-live.web.app',
    color: 'from-emerald-400 to-teal-600',
    stats: [
      { n: 120, s: '+', l: 'Schools Hosted' },
      { n: 8000, s: '+', l: 'Students Engaged' },
      { n: 4.9, s: '/5', l: 'School Rating' },
    ],
    leaderboard: [
      { rank: 1, name: 'St. Joseph\'s Academy · Lagos', score: '9,840', medal: '🥇' },
      { rank: 2, name: 'Thornton High · London', score: '8,920', medal: '🥈' },
      { rank: 3, name: 'Greenfield College · Accra', score: '8,450', medal: '🥉' },
    ],
  },
  {
    id: 'sezwor',
    icon: Gamepad2,
    name: 'Sezwor Mode',
    tag: 'Coming Soon · 2026',
    tagColor: 'bg-brand-100 text-brand-700',
    desc: 'An interactive group quiz and learning platform that makes education thrilling. Sezwor Mode brings classrooms alive with real-time multiplayer quizzes, subject-based leagues, and global leaderboards — turning every lesson into a game students actually want to play.',
    features: [
      'Real-time multiplayer group quizzes (up to 500 players)',
      'Teacher-hosted live sessions for classrooms & events',
      'Subject-based knowledge tracks: STEM, Humanities, Tech, AI',
      'Scholarship-linked reward system',
      'School league competitions with global leaderboards',
      'Progress analytics dashboard for parents & schools',
    ],
    cta: 'Join the Waitlist',
    ctaHref: '#waitlist',
    color: 'from-brand-400 to-purple-600',
    stats: [
      { n: 3200, s: '+', l: 'Waitlist Signups' },
      { n: 28, s: '+', l: 'Partner Schools' },
      { n: 2026, s: '', l: 'Launch Year' },
    ],
    leaderboard: [
      { rank: 1, name: 'Aisha K. · Kenya', score: '12,400', medal: '🥇' },
      { rank: 2, name: 'Marcus T. · USA', score: '11,850', medal: '🥈' },
      { rank: 3, name: 'Fatima O. · Senegal', score: '10,920', medal: '🥉' },
    ],
  },
  {
    id: 'flags',
    icon: Globe2,
    name: 'World National Flag Challenge',
    tag: 'Live · Continental Finals 2026',
    tagColor: 'bg-amber-100 text-amber-700',
    desc: 'A global knowledge challenge that turns world geography and cultural awareness into a thrilling competitive event. From classroom rounds to continental finals — building global citizens one flag at a time, one country at a time.',
    features: [
      'All 196 countries + territories covered',
      'Individual and school team categories',
      'Physical classroom + digital livestreamed format',
      'Certificates, trophies & scholarships for top performers',
      'Cultural deep-dives: capitals, languages, geography',
      'Continental Finals: Africa, Europe, Americas, Asia',
    ],
    cta: 'Register Your School',
    ctaHref: '/events',
    playUrl: 'https://national-flag-challenge.netlify.app/#/home',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.lukman.worldnationalflag',
    color: 'from-amber-400 to-orange-500',
    stats: [
      { n: 196, s: '', l: 'Countries Covered' },
      { n: 4200, s: '+', l: 'Participants' },
      { n: 60, s: '+', l: 'Schools Competing' },
    ],
    leaderboard: [
      { rank: 1, name: 'Nairobi Academy · Kenya', score: '196 flags', medal: '🥇' },
      { rank: 2, name: 'Unity College · UK', score: '193 flags', medal: '🥈' },
      { rank: 3, name: 'GBHS · Nigeria', score: '191 flags', medal: '🥉' },
    ],
  },
];

const impactStats = [
  { n: 20, s: '+', l: 'Countries Reached', icon: Globe, color: 'from-brand-500 to-purple-600' },
  { n: 8000, s: '+', l: 'Students Engaged', icon: Users, color: 'from-emerald-400 to-teal-600' },
  { n: 120, s: '+', l: 'Schools Hosted', icon: School, color: 'from-amber-400 to-orange-500' },
  { n: 3, s: '', l: 'Active Products', icon: Gamepad2, color: 'from-violet-400 to-purple-600' },
];

const testimonials = [
  {
    quote: "The Millionaire Game Show was the highlight of our school term. Students were reviewing notes at home the night before — without being asked. That never happens.",
    name: "Mrs. Adaeze Eze",
    role: "Vice Principal, Anchor International School",
    country: "🇳🇬 Lagos, Nigeria",
    color: 'from-emerald-400 to-teal-500',
  },
  {
    quote: "We booked the Flag Challenge for our International Day event. Every student — even the quietest ones — was fully engaged. The energy was incredible.",
    name: "Mr. David Clarke",
    role: "Head of Year 9, Thornton Academy",
    country: "🇬🇧 Birmingham, UK",
    color: 'from-brand-400 to-purple-500',
  },
  {
    quote: "ScholarlyEcho's edutainment approach is exactly what modern education needs. Competition + curriculum = students who actually care about learning.",
    name: "Dr. Amara Diallo",
    role: "Education Innovation Lead, UNESCO",
    country: "🇸🇳 Dakar, Senegal",
    color: 'from-amber-400 to-orange-500',
  },
];

const upcomingEvents = [
  { title: 'Millionaire Game Show — Continental Tour', date: 'April 26, 2026', cities: 'Lagos · Accra · Nairobi · London', badge: 'Multi-city', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { title: 'World Flag Challenge — African Continental Finals', date: 'June 14, 2026', cities: 'Abuja, Nigeria + Livestream', badge: 'Continental', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { title: 'Sezwor Mode Beta Launch + Tournament', date: 'August 2026', cities: 'Online · Global', badge: 'Coming Soon', color: 'bg-brand-50 text-brand-700 border-brand-100' },
];

function TestimonialsSlider({ testimonials }: { testimonials: { quote: string; name: string; role: string; country: string; color: string }[] }) {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % total), 5000);
    return () => clearInterval(id);
  }, [total]);

  const prev = () => setActive((p) => (p - 1 + total) % total);
  const next = () => setActive((p) => (p + 1) % total);

  return (
    <section className="py-14 sm:py-18 md:py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        <SectionWrapper className="text-center mb-12">
          <div className="section-tag mx-auto mb-5">
            <Star className="w-3.5 h-3.5" /> What Educators Say
          </div>
          <h2 className="section-heading mb-4">Trusted by Schools Worldwide</h2>
        </SectionWrapper>

        <div className="relative">
          {/* Slide */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="premium-card flex flex-col items-start gap-5 min-h-[220px]">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonials[active].color} flex items-center justify-center flex-shrink-0`}>
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <p className="text-slate-600 text-[15px] leading-relaxed flex-1 italic">
                "{testimonials[active].quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 w-full">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonials[active].color} flex items-center justify-center text-white font-extrabold text-[13px]`}>
                  {testimonials[active].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">{testimonials[active].name}</div>
                  <div className="text-slate-400 text-[12px]">{testimonials[active].role}</div>
                  <div className="text-slate-400 text-[11px]">{testimonials[active].country}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'bg-brand-500 w-6' : 'bg-slate-200 w-3'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev}
                className="w-9 h-9 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next}
                className="w-9 h-9 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const result = await submitForm('waitlist', { email });
    if (result.success) {
      setStatus('success');
      setEmail('');
      showToast('success', 'You\'re on the Sezwor Mode waitlist! We\'ll notify you at launch.');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Failed to join. Please try again.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="flex items-center justify-center gap-3 py-3.5">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-white" />
            </div>
          </motion.div>
          <span className="text-emerald-400 text-sm font-semibold">You're on the waitlist!</span>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3.5 rounded-xl border-2 border-white/[0.06] bg-white/[0.06] text-white placeholder-white/30 focus:outline-none focus:border-brand-400/60 focus:bg-white/[0.1] transition-all duration-300 text-[14px]"
          />
          <motion.button type="submit" disabled={status === 'loading'} whileTap={{ scale: 0.97 }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap shadow-lg disabled:opacity-60">
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join Waitlist <Zap className="w-4 h-4" /></>}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function EdutainmentPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {['🎮', '🏆', '🌍', '⚡', '🎯', '🧠', '🥇', '🌐'].map((emoji, i) => (
          <motion.div key={i}
            className="absolute text-2xl select-none pointer-events-none"
            style={{ left: `${8 + i * 12}%`, top: `${12 + (i % 3) * 22}%`, opacity: 0.12 }}
            animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" /> Edutainment — Where Learning Becomes Winning
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-[-0.03em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Knowledge Is the{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #34d399, #10b981)' }}>
                Ultimate Prize
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-white/45 text-base sm:text-lg leading-[1.75] mb-10">
              Game shows, digital tournaments, and global challenges that turn any classroom into an arena.
              When learning feels like winning, students absorb 3× more — and come back for more. A perfect enrichment fit for homeschooling families and co-ops looking to fuel curiosity and brain development.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-10">
              {impactStats.map(({ n, s, l, icon: Icon, color }) => (
                <div key={l} className="glass rounded-2xl p-4 text-center border border-white/10">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <AnimatedCounter end={n} suffix={s} />
                  </div>
                  <div className="text-white/50 text-[10px] mt-0.5">{l}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
              <Link href="/contact" className="btn-primary">
                Book for Your School <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/events" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/18 text-white font-semibold hover:bg-white/10 transition-all">
                View Upcoming Events
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Products ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-16 sm:space-y-20 md:space-y-28">
          {products.map((product, idx) => {
            const Icon = product.icon;
            const isEven = idx % 2 === 0;
            return (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-14 items-center`}>

                {/* Text */}
                <div className={!isEven ? 'lg:order-2' : ''}>
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-5 border ${product.tagColor}`}>
                    {product.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {product.name}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-7 text-[15px]">{product.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-slate-700 text-[13px]">
                        <CheckCircle2 className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-emerald-500`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={product.ctaHref}
                      className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[14px] text-white bg-gradient-to-r ${product.color} hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg`}>
                      {product.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                    {(product as any).playUrl && (
                      <a href={(product as any).playUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[13px] text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-slate-200">
                        <Play className="w-4 h-4 fill-slate-500 text-slate-500" /> Play Online <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                    {(product as any).storeUrl && (
                      <a href={(product as any).storeUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[13px] text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-slate-200">
                        <Smartphone className="w-4 h-4 text-slate-500" /> Google Play <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual card */}
                <div className={!isEven ? 'lg:order-1' : ''}>
                  <div className={`rounded-3xl bg-gradient-to-br ${product.color} p-8 relative overflow-hidden shadow-2xl`}>
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-extrabold text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{product.name}</h3>
                          <p className="text-white/60 text-[12px]">Live performance data</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {product.stats.map(({ n, s, l }) => (
                          <div key={l} className="bg-white/15 rounded-2xl p-3.5 text-center backdrop-blur-sm">
                            <div className="text-white font-extrabold text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              <AnimatedCounter end={n} suffix={s} />
                            </div>
                            <div className="text-white/65 text-[10px] mt-0.5">{l}</div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-2.5">Top Performers</div>
                        {product.leaderboard.map((row) => (
                          <div key={row.rank} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                            <span className="text-base">{row.medal}</span>
                            <span className="text-white text-[12px] flex-1 font-medium truncate">{row.name}</span>
                            <span className="text-white/80 text-[12px] font-bold">{row.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <div className="section-tag mx-auto mb-5">
              <Calendar className="w-3.5 h-3.5" /> What's Coming
            </div>
            <h2 className="section-heading mb-4">Edutainment Events 2026</h2>
            <p className="section-subheading mx-auto">Global competitions and shows you won't want to miss.</p>
          </SectionWrapper>
          <div className="space-y-4">
            {upcomingEvents.map((ev, i) => (
              <motion.div key={ev.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-transparent hover:shadow-lg transition-all duration-300">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ev.color}`}>{ev.badge}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-[15px] group-hover:text-brand-600 transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{ev.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-[12px] text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {ev.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {ev.cities}</span>
                  </div>
                </div>
                <Link href="/events"
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl border-2 border-brand-200 text-brand-600 font-bold text-[13px] hover:bg-brand-50 transition-colors">
                  Learn More <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Slider ── */}
      <TestimonialsSlider testimonials={testimonials} />

      {/* ── Why Edutainment Works ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <div className="section-tag mx-auto mb-5">
              <Brain className="w-3.5 h-3.5" /> The Science Behind It
            </div>
            <h2 className="section-heading mb-4">Why Edutainment Works</h2>
            <p className="section-subheading mx-auto">Competition + curriculum = students who genuinely care about learning.</p>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: BarChart3, stat: '3×', label: 'Higher Retention', desc: 'Students retain 3× more when content is delivered through competitive, game-based formats.', color: 'from-brand-500 to-purple-600' },
              { icon: TrendingUp, stat: '87%', label: 'Engagement Rate', desc: 'Average in-session engagement rate across all ScholarlyEcho edutainment events globally.', color: 'from-emerald-400 to-teal-600' },
              { icon: Users, stat: '500+', label: 'Students / Event', desc: 'Our multi-city game shows engage hundreds of students simultaneously, live and online.', color: 'from-amber-400 to-orange-500' },
              { icon: Award, stat: '4.9/5', label: 'School Rating', desc: 'Average post-event satisfaction score from principals, teachers, and students combined.', color: 'from-violet-400 to-purple-600' },
            ].map(({ icon: Icon, stat, label, desc, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card text-center group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`text-3xl font-extrabold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat}</div>
                <div className="font-bold text-slate-900 text-[13px] mb-2">{label}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sezwor Waitlist ── */}
      <section id="waitlist" className="py-14 sm:py-18 md:py-24 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <SectionWrapper>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] mb-6">
              <Gamepad2 className="w-3.5 h-3.5 text-brand-300" /> Sezwor Mode — Launching 2026
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Be First on the Global Leaderboard
            </h2>
            <p className="text-white/40 mb-8 text-[15px] leading-relaxed">
              Join 3,200+ students, parents, and schools already on the waitlist for the world&apos;s most exciting educational gaming platform.
            </p>
            <WaitlistForm />
          </SectionWrapper>
        </div>
      </section>

      {/* ── School Booking CTA ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-4">
                  <School className="w-3.5 h-3.5" /> For Schools & Institutions
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-[-0.02em]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Bring Edutainment to Your School
                </h2>
                <p className="text-white/75 text-[14px] leading-relaxed max-w-xl">
                  Book our game shows and challenges for science fairs, graduation events, end-of-term celebrations,
                  and community programs. We handle everything — you get the wow. Available for schools across
                  Africa, North America, Europe, and beyond.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link href="/contact"
                  className="px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap">
                  Request Booking <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/events"
                  className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors whitespace-nowrap">
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
