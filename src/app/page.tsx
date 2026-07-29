'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Mic2, Gamepad2, Star, Users, Award,
  TrendingUp, CheckCircle2, Play, ChevronRight, Sparkles,
  Code2, Globe, Trophy, Brain, Zap,
  Layers, Target, BarChart3, Rocket, Heart, GraduationCap, Briefcase,
  Home, Calendar, Eye, Shield, Ticket, DollarSign, Video
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FreeTrialForm, { FreeTrialModal } from '@/components/FreeTrialForm';
import InfoSessionPopup from '@/components/InfoSessionPopup';
import { CourseStack } from '@/components/TechLogos';
import { useEvents, tagColorFor, isActive, isCompleted, isUpcoming, feeLabel, isVisible } from '@/lib/events';
import type { EventDoc } from '@/lib/events';
import { usePosts, tagColorFor as postTagColorFor, gradientFor as postGradientFor, formatPostDate, totalLikes as postTotalLikes } from '@/lib/posts';

/* ─────────────────── Sub-components ─────────────────── */

/** Shared spring-like easing curve for all entrance motion on this page. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Floating glass chip in the hero visual. Drifts gently after entering, unless
 * the user prefers reduced motion.
 */
function FloatingChip({
  children, className, delay = 0, driftRange = 7,
}: { children: React.ReactNode; className?: string; delay?: number; driftRange?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={
        reduce
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: [0, -driftRange, 0] }
      }
      transition={
        reduce
          ? { duration: 0.4, delay }
          : {
              opacity: { delay, duration: 0.6, ease: EASE_OUT },
              scale: { delay, duration: 0.6, ease: EASE_OUT },
              y: { delay: delay + 0.6, duration: 5 + driftRange * 0.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      className={`absolute rounded-2xl border border-white/[0.14] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(18px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.6)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hero headline that animates in word by word. Falls back to a single fade when
 * reduced motion is requested.
 */
function RevealWords({
  text, className, delay = 0, gradientFrom,
}: { text: string; className?: string; delay?: number; gradientFrom?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${gradientFrom !== undefined && i >= gradientFrom ? 'gradient-text-animated' : ''}`}
            initial={{ y: '108%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: delay + i * 0.07, duration: 0.75, ease: EASE_OUT }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/** Small trust marker in the hero's proof row. */
function TrustMarker({ icon: Icon, label, tone }: { icon: React.ElementType; label: string; tone: string }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-white/60">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${tone}`} />
      <span>{label}</span>
    </div>
  );
}

function StatPill({ value, suffix, label, color, delay }: { value: number; suffix: string; label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-4 sm:px-6 py-2 sm:py-4 relative"
    >
      <div className={`text-[2rem] sm:text-4xl md:text-[2.75rem] lg:text-5xl font-extrabold mb-2 ${color} tracking-[-0.03em]`}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <AnimatedCounter end={value} suffix={suffix} />
      </div>
      <div className="eyebrow text-slate-500">{label}</div>
    </motion.div>
  );
}

/**
 * One of the three pillars (Learn / Inspire / Engage). The whole card is a link
 * so the entire surface is clickable, not just the trailing text.
 */
function BranchCard({ icon: Icon, index, title, subtitle, description, color, gradient, href, features, delay }: {
  icon: React.ElementType; index: string; title: string; subtitle: string; description: string;
  color: string; gradient: string; href: string; features: string[]; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: reduce ? 0 : delay, duration: 0.75, ease: EASE_OUT }}
      className="group relative h-full"
    >
      <Link
        href={href}
        className="relative flex h-full flex-col rounded-[26px] bg-white p-6 sm:p-7 border border-slate-200/70 overflow-hidden cursor-pointer
                   shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_28px_rgba(15,23,42,0.04)]
                   transition-[transform,box-shadow,border-color] duration-500
                   hover:-translate-y-2 hover:border-brand-500/25
                   hover:shadow-[0_32px_64px_rgba(110,66,255,0.14),0_12px_24px_rgba(15,23,42,0.06)]
                   focus-visible:-translate-y-2"
      >
        {/* Top gradient rail: brightens and widens on hover. */}
        <span aria-hidden
          className={`absolute top-0 left-0 h-[3px] w-1/3 bg-gradient-to-r ${gradient} opacity-70
                      transition-[width,opacity] duration-700 ease-out group-hover:w-full group-hover:opacity-100`} />

        {/* Ambient corner glow on hover. */}
        <span aria-hidden
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl bg-gradient-to-br ${gradient}
                      opacity-0 group-hover:opacity-[0.14] transition-opacity duration-700`} />

        {/* Oversized watermark numeral for editorial weight. */}
        <span aria-hidden
          className="absolute top-4 right-6 text-[3.5rem] font-extrabold leading-none text-slate-900/[0.04]
                     transition-colors duration-500 group-hover:text-slate-900/[0.07] select-none"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {index}
        </span>

        <div className="relative z-10 flex flex-col h-full">
          <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${gradient}
                          shadow-lg transition-transform duration-500 group-hover:scale-[1.06] group-hover:-rotate-3`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className={`eyebrow mb-2 ${color}`}>{subtitle}</div>
          <h3 className="text-[1.375rem] font-extrabold text-slate-900 mb-3 tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {title}
          </h3>
          <p className="text-slate-600 text-[13.5px] leading-[1.7] mb-6">{description}</p>

          <ul className="space-y-2.5 mb-7">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-700 leading-snug">
                <span className={`mt-[3px] w-4 h-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <span className={`mt-auto inline-flex items-center gap-2 text-[13.5px] font-bold ${color}`}>
            Explore {title}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function formatProgramDate(iso: string): string {
  // ISO date "YYYY-MM-DD" → "Mon YYYY" (avoid timezone offset by using parts directly).
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo] = m;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(mo, 10) - 1;
  if (idx < 0 || idx > 11) return iso;
  return `${months[idx]} ${m[3]}, ${y}`;
}

/* ═══════════════════ PAGE ═══════════════════ */
export default function HomePage() {
  const [trialOpen, setTrialOpen] = useState(false);
  const [infoSessionEvent, setInfoSessionEvent] = useState<EventDoc | null>(null);
  const { events: dbEvents, loaded: programsLoaded } = useEvents();
  const visibleEvents = dbEvents.filter(isVisible);
  // Left "Programs" column = active + completed, with active (still running) shown first.
  // The Active/Completed tag is driven by the backend `status` (the end-state signal).
  const runningOrDone = visibleEvents.filter((p) => isActive(p) || isCompleted(p));
  const programsList = [
    ...runningOrDone.filter(isActive),
    ...runningOrDone.filter(isCompleted),
  ].slice(0, 4);
  const upcomingPrograms = visibleEvents.filter(isUpcoming).slice(0, 3);

  // Home shows ONLY posts explicitly flagged Featured (max 3). Non-featured posts live on /blog.
  // If no posts are flagged, the section auto-hides.
  const { posts: allPosts } = usePosts();
  const featuredPosts = useMemo(
    () => allPosts.filter((p) => p.featured).slice(0, 3),
    [allPosts]
  );
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  // Background layers move slower than the foreground for depth.
  const heroBgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  // Deterministic star field: generated once so it stays stable across renders
  // and does not shift between server and client paint.
  const stars = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => {
        // Cheap hash-ish spread; keeps positions varied without Math.random().
        const a = (i * 9301 + 49297) % 233280 / 233280;
        const b = (i * 4177 + 12345) % 233280 / 233280;
        const c = (i * 7919 + 104729) % 233280 / 233280;
        return {
          left: `${(a * 100).toFixed(2)}%`,
          top: `${(b * 100).toFixed(2)}%`,
          size: 0.8 + c * 1.6,
          peak: 0.18 + c * 0.42,
          duration: 2.4 + a * 4.5,
          delay: b * 4,
        };
      }),
    []
  );

  // Partners list: kept for the (currently hidden) "Trusted by & in partnership with" marquee.
  // eslint-disable-next-line no-unused-vars
  const partners = ['Google.org', 'UNESCO', 'Microsoft', 'AWS Educate', 'She Code Africa', 'Andela', 'TechStars', 'ALX Africa', 'UNICEF', 'Meta for Developers', 'GitHub Education', 'African Union'];
  void partners;
  const globalNumbers = [
    { v: 5, s: '+', l: 'Countries Served' },
    { v: 200, s: '+', l: 'Youth Trained' },
    { v: 98, s: '%', l: 'Satisfaction Rate' },
    { v: 300, s: '+', l: 'Projects Built' },
  ];

  return (
    <div className="overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        {/* ── Ambient background stack ── */}
        <motion.div aria-hidden style={{ y: heroBgY }} className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary brand orb (purple) */}
          <div className="orb-drift absolute -top-[12%] left-[8%] w-[620px] h-[620px] rounded-full opacity-[0.18]"
            style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 68%)' }} />
          {/* Pink accent orb */}
          <div className="orb-drift absolute top-[24%] -right-[6%] w-[520px] h-[520px] rounded-full opacity-[0.13]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 68%)', animationDelay: '-4s', animationDuration: '17s' }} />
          {/* Amber warmth low-left */}
          <div className="orb-drift absolute bottom-[6%] left-[2%] w-[420px] h-[420px] rounded-full opacity-[0.09]"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 68%)', animationDelay: '-8s', animationDuration: '20s' }} />

          {/* Perspective grid: fades toward the top so the horizon reads as depth. */}
          <div className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 60%, #000 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 60%, #000 20%, transparent 75%)',
            }} />

          {/* Star field */}
          {stars.map((s, i) => (
            <motion.span key={i} className="absolute rounded-full bg-white"
              style={{ width: `${s.size}px`, height: `${s.size}px`, left: s.left, top: s.top, opacity: 0.1 }}
              animate={reduce ? { opacity: 0.22 } : { opacity: [0.06, s.peak, 0.06] }}
              transition={reduce ? { duration: 0 } : { duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
            />
          ))}

          {/* Horizon: glow line plus an upward wash. */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.28) 22%, rgba(236,72,153,0.42) 50%, rgba(110,66,255,0.32) 78%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: 'linear-gradient(to top, rgba(110,66,255,0.09) 0%, transparent 100%)' }} />
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* ── Left ── */}
              <div>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-xl text-white/75 text-[12.5px] font-medium mb-8">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10.5px] font-bold uppercase tracking-[0.1em]">
                    <span className="relative flex h-1.5 w-1.5">
                      {!reduce && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    Live cohorts
                  </span>
                  Coding, AI &amp; robotics for ages 5 to 30
                </motion.div>

                <h1 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4.1rem] lg:text-[4.75rem] font-extrabold text-white leading-[0.98] tracking-[-0.045em] mb-7"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <RevealWords text="Your child will" className="block text-white/95" delay={0.12} />
                  <RevealWords text="ship something real." className="block" delay={0.3} gradientFrom={0} />
                </h1>

                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT }}
                  className="text-[1.0625rem] text-white/65 leading-[1.75] mb-8 max-w-[500px]">
                  Coding is the 4th literacy. In live small-group cohorts, learners build real games,
                  apps, and AI products with named mentors: then demo them on Demo Day.
                  <span className="block mt-3 text-white/50">
                    Flexible scheduling for homeschooling families, parent-visible progress, and a
                    clear ladder from first block of code to a launched product.
                  </span>
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.68, ease: EASE_OUT }}
                  className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button onClick={() => setTrialOpen(true)} className="btn-cta group sheen-on-hover w-full sm:w-auto">
                    <span className="relative z-10 inline-flex items-center gap-2.5">
                      Book a FREE Assessment Class
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                  <Link href="/learning-hub" className="btn-ghost-dark group w-full sm:w-auto">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/12 transition-colors duration-300 group-hover:bg-white/20">
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    </span>
                    Explore Programs
                  </Link>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                  className="mt-4 text-white/40 text-[12.5px]">
                  30-minute Zoom · no card needed · a custom learning plan you keep
                </motion.p>

                {/* Proof row */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.6, ease: EASE_OUT }}
                  className="mt-9 pt-8 border-t border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-5">
                    <div className="flex -space-x-2.5">
                      {[['AM', '#6e42ff'], ['TK', '#f59e0b'], ['FO', '#10b981'], ['AJ', '#ec4899'], ['ND', '#3b82f6']].map(([init, bg], i) => (
                        <span key={i}
                          className="w-8 h-8 rounded-full border-2 border-[#0b1024] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: bg as string }}>
                          {init}
                        </span>
                      ))}
                    </div>
                    <div className="text-white/55 text-[13px]">
                      <span className="text-white font-bold tabular">200+</span> learners across{' '}
                      <span className="text-white font-bold tabular">5+</span> countries
                    </div>
                    <span className="hidden sm:block h-4 w-px bg-white/12" />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                      <span className="text-white/55 text-[13px] ml-1.5 tabular">4.9/5</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                    <TrustMarker icon={Shield} label="Background-checked instructors" tone="text-emerald-400" />
                    <TrustMarker icon={Home} label="Homeschool-friendly scheduling" tone="text-amber-400" />
                    <TrustMarker icon={Award} label="Certificate + capstone project" tone="text-brand-400" />
                  </div>
                </motion.div>
              </div>

              {/* ── Right: learner-progress visual ── */}
              <div className="relative h-[540px] hidden lg:block">
                {/* Rotating conic halo behind the card. */}
                {!reduce && (
                  <div aria-hidden className="absolute inset-10 rounded-[32px] overflow-hidden opacity-[0.5]">
                    <div className="conic-halo absolute -inset-[40%] blur-2xl" />
                  </div>
                )}

                {/* Central card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateX: 8 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.45, duration: 1, ease: EASE_OUT }}
                  className="absolute inset-6 hero-card"
                  style={{ perspective: 1000 }}
                >
                  {/* Slow vertical scan line for a "live" feel. */}
                  {!reduce && (
                    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                      <div className="absolute left-0 right-0 h-24"
                        style={{
                          background: 'linear-gradient(to bottom, transparent, rgba(139,110,255,0.09), transparent)',
                          animation: 'scan 7s ease-in-out infinite 2s',
                        }} />
                    </div>
                  )}

                  <div className="relative h-full flex flex-col">
                    <div className="px-6 py-5 flex items-center gap-3 border-b border-white/[0.07]"
                      style={{ background: 'linear-gradient(135deg, rgba(110,66,255,0.18) 0%, rgba(236,72,153,0.09) 100%)' }}>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/12">
                        <Brain className="w-5 h-5 text-purple-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-[15px]">AI Developer Track</div>
                        <div className="text-white/45 text-xs truncate">Level 4 · Coders Ladder</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-extrabold text-lg tabular">82%</div>
                        <div className="text-white/40 text-[10.5px] uppercase tracking-[0.1em] font-bold">Complete</div>
                      </div>
                    </div>

                    <div className="px-5 pt-4 pb-3 flex-1 flex flex-col">
                      <div className="w-full bg-white/[0.07] rounded-full h-1.5 mb-5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '82%' }}
                          transition={{ delay: 1.3, duration: reduce ? 0 : 1.7, ease: 'easeOut' }}
                          className="h-1.5 rounded-full"
                          style={{ background: 'linear-gradient(90deg, #6e42ff, #a855f7, #ec4899)' }} />
                      </div>

                      <div className="space-y-2">
                        {[
                          { t: 'Python for AI Fundamentals', done: true },
                          { t: 'Machine Learning Concepts', done: true },
                          { t: 'Building with GPT APIs', done: true },
                          { t: 'Computer Vision Project', done: false },
                          { t: 'Deploy Your AI App', done: false },
                        ].map(({ t, done }, i) => (
                          <motion.div key={t}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + i * 0.09, duration: 0.5, ease: EASE_OUT }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] border transition-colors duration-300 ${
                              done
                                ? 'bg-emerald-500/[0.09] border-emerald-400/15'
                                : 'bg-white/[0.03] border-white/[0.05]'
                            }`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              done ? 'bg-emerald-500/85' : 'bg-white/[0.08] border border-white/12'
                            }`}>
                              {done
                                ? <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                : <span className="w-1.5 h-1.5 rounded-full bg-white/35" />}
                            </span>
                            <span className={done ? 'text-white/75' : 'text-white/35'}>{t}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer strip: the deliverable, named. */}
                      <div className="mt-auto pt-4 mx-[-4px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <Rocket className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-white/55 text-[12px]">
                          Next up: <span className="text-white/80 font-semibold">Demo Day</span> · a live URL of their own
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating chips */}
                <FloatingChip className="top-0 -left-4 px-4 py-3" delay={1.0} driftRange={8}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                    </span>
                    <span className="block">
                      <span className="block text-[11px] font-bold text-emerald-300">Capstone shipped</span>
                      <span className="block text-[10px] text-white/45">First AI app deployed</span>
                    </span>
                  </div>
                </FloatingChip>

                <FloatingChip className="-bottom-2 -right-2 px-4 py-3" delay={1.15} driftRange={6}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-amber-400" />
                    </span>
                    <span className="block">
                      <span className="block text-[11px] font-bold text-amber-300">5+ countries</span>
                      <span className="block text-[10px] text-white/45">One global cohort</span>
                    </span>
                  </div>
                </FloatingChip>

                <FloatingChip className="bottom-32 -left-6 px-3.5 py-2.5" delay={1.25} driftRange={9}>
                  <span className="flex items-center gap-2 text-[12px]">
                    <Users className="w-4 h-4 text-brand-300 flex-shrink-0" />
                    <span className="text-white/70">Small cohorts, real mentors</span>
                  </span>
                </FloatingChip>

                <FloatingChip className="top-[46%] -right-3 px-3.5 py-2.5" delay={1.35} driftRange={7}>
                  <span className="flex items-center gap-2 text-[12px]">
                    <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/70">Homeschool-friendly</span>
                  </span>
                </FloatingChip>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center pt-2">
            <motion.span
              animate={reduce ? {} : { y: [0, 12, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="py-11 sm:py-14 bg-white border-b border-slate-200/70 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-40 mesh-bg" />
        {/* Brand hairline seam against the hero above. */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.28) 50%, transparent 100%)' }} />
        <div className="max-w-5xl mx-auto px-5 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 md:divide-x md:divide-slate-200/70">
            {globalNumbers.map(({ v, s, l }, i) => (
              <StatPill key={l} value={v} suffix={s} label={l}
                color={['gradient-text', 'gradient-text-gold', 'gradient-text-green', 'gradient-text'][i]}
                delay={i * 0.09} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOMESCHOOL FAMILIES: FLAGSHIP AUDIENCE ═══ */}
      <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 50%, transparent 100%)' }} />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-700 text-[13px] font-semibold mb-5">
              <Home className="w-3.5 h-3.5" /> Built for Homeschooling Families
            </div>
            <h2 className="section-heading mb-4">
              Built Around the <span className="gradient-text">Homeschool Rhythm</span>
            </h2>
            <p className="section-subheading mx-auto max-w-2xl">
              Homeschooling families are at the heart of what we do. Every cohort runs as live,
              instructor-led virtual classes, so your child learns alongside peers across continents
              without leaving your schedule behind.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { icon: Calendar, title: 'Scheduling That Bends', desc: 'Weekday, weekend, morning or evening slots, so your homeschool calendar always wins.' },
              { icon: Eye, title: 'Progress Parents Can See', desc: 'Milestones, projects, and skill growth visible at a glance, with periodic notes from mentors.' },
              { icon: Users, title: 'Sibling Discounts That Stack', desc: 'Built for multi-child families: 10% off the second child, 15% off the third.' },
              { icon: Shield, title: 'Safe by Design', desc: 'Background-checked instructors, small cohorts, and parents welcome to observe under-13 sessions.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.6, ease: EASE_OUT }}
                className="group relative rounded-[22px] bg-white p-6 border border-amber-200/70 overflow-hidden
                           shadow-[0_1px_2px_rgba(120,53,15,0.04),0_8px_24px_rgba(120,53,15,0.05)]
                           transition-[transform,box-shadow,border-color] duration-500
                           hover:-translate-y-1.5 hover:border-amber-400/70
                           hover:shadow-[0_24px_48px_rgba(217,119,6,0.16)]">
                <span aria-hidden
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br from-amber-400 to-orange-500
                             opacity-0 group-hover:opacity-[0.18] transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-md
                                  transition-transform duration-500 group-hover:scale-[1.07]">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold text-slate-900 mb-2 text-[15px]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
                  <div className="text-slate-600 text-[13px] leading-[1.7]">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/assessment-class" className="btn-cta group sheen-on-hover">
              <span className="relative z-10 inline-flex items-center gap-2.5">
                Book a FREE Homeschool Assessment
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <div className="mt-3.5 text-slate-600 text-[12.5px]">No card needed · 30-minute Zoom · a custom plan you keep</div>
          </div>
        </div>
      </section>

      {/* ═══ TOOLS / TECH LOGOS: CURRICULUM ═══ */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-10">
            <div className="section-tag mx-auto mb-4">
              <Layers className="w-3.5 h-3.5" /> Our Full Curriculum
            </div>
            <h2 className="section-heading mb-3">From Block Coding to <span className="gradient-text">AI Engineering</span></h2>
            <p className="section-subheading mx-auto">
              Web · Mobile · Desktop · AI. Real tools, taught well: for every age and every level.
            </p>
          </SectionWrapper>

          <CourseStack theme="light" />

          <div className="mt-8 sm:mt-10 text-center">
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 hover:gap-2.5 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              Don&apos;t see your stack? We accept specialized requests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 4TH LITERACY ═══ */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-12">
            <div className="section-tag mx-auto mb-5">
              <Code2 className="w-3.5 h-3.5" /> Why It Matters
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Coding &amp; AI: the <span className="gradient-text-animated">4th Literacy</span>
            </h2>
            <p className="section-subheading mx-auto mb-6">
              Reading, writing, and arithmetic shaped the last century. Coding and AI are the foundational skills shaping this one: the language of technology, creativity, and solving problems that matter.
            </p>
            <span aria-hidden className="section-rule mx-auto" />
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '1st', title: 'Reading', desc: 'Understanding language to make sense of the world and absorb knowledge.', icon: BookOpen, color: 'from-blue-500 to-brand-500', active: false },
              { n: '2nd', title: 'Writing', desc: 'Creating and communicating ideas that shape thought and inspire action.', icon: Sparkles, color: 'from-emerald-500 to-teal-600', active: false },
              { n: '3rd', title: 'Arithmetic', desc: 'Numbers, logic, and reasoning: the foundation of analytical thinking.', icon: BarChart3, color: 'from-amber-500 to-orange-500', active: false },
              { n: '4th', title: 'Coding & AI', desc: 'The language for navigating and shaping the digital world: coding and AI foster creativity, logic, critical thinking, and real-world problem-solving.', icon: Code2, color: 'from-brand-500 to-purple-600', active: true },
            ].map(({ n, title, desc, icon: Icon, color, active }, i) => (
              <motion.div key={title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.09, duration: 0.6, ease: EASE_OUT }}
                className={`rounded-[22px] p-5 sm:p-6 border relative overflow-hidden group
                            transition-[transform,box-shadow,border-color] duration-500 ${
                  active
                    ? 'bg-gradient-to-br from-brand-500 to-purple-600 border-transparent text-white shadow-[0_16px_44px_rgba(110,66,255,0.3)] sm:-translate-y-1'
                    : 'bg-white border-slate-200/70 hover:border-slate-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)]'
                }`}>
                {active && !reduce && (
                  <motion.div aria-hidden className="absolute inset-0 opacity-25"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.45) 0%, transparent 60%)', backgroundSize: '200% 200%' }} />
                )}
                <div className="relative z-10">
                  <div className={`eyebrow mb-3 ${active ? 'text-white/70' : 'text-slate-500'}`}>
                    {n} Literacy
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 ${
                    active ? 'bg-white/20' : `bg-gradient-to-br ${color}`
                  } transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`font-extrabold text-lg mb-2 tracking-[-0.02em] ${active ? 'text-white' : 'text-slate-900'}`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {title}
                  </h3>
                  <p className={`text-[13px] leading-[1.7] ${active ? 'text-white/80' : 'text-slate-600'}`}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE THREE PILLARS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 mesh-bg relative overflow-hidden">
        {/* Top hairline in brand gradient. */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.35) 30%, rgba(236,72,153,0.4) 50%, rgba(110,66,255,0.35) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-14 sm:mb-16">
            <div className="section-tag mx-auto mb-5">
              <Layers className="w-3.5 h-3.5" /> Learn · Inspire · Engage
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Scholarly Echo Sits on <span className="gradient-text">Three Pillars</span>
            </h2>
            <p className="section-subheading mx-auto mb-6">
              Every program belongs to one of three pillars: build future-ready skills, draw
              inspiration from real stories, and engage through educational entertainment.
            </p>
            <span aria-hidden className="section-rule mx-auto" />
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-5 md:gap-7 items-stretch">
            <BranchCard
              icon={BookOpen}
              index="01"
              title="Learning Hub"
              subtitle="Learn"
              description="Project-based coding that builds critical thinking and creativity. Progress through the competency-based Coders Ladder: from visual blocks to launching AI-powered products."
              color="text-brand-600"
              gradient="from-brand-500 to-purple-600"
              href="/learning-hub"
              features={[
                'Scratch, App Inventor & Python pathways',
                'AI Developer track: GPT, ML, OpenCV',
                'Product Builder: launch real SaaS',
                '1-on-1, group & bootcamp formats',
                'Vetted, background-checked mentors',
              ]}
              delay={0}
            />
            <BranchCard
              icon={Mic2}
              index="02"
              title="Spotlight Media"
              subtitle="Inspire"
              description="A global podcast series, success stories, and research-to-impact spotlights. Real people from real places sharing real journeys: from Lagos to London to Silicon Valley."
              color="text-amber-600"
              gradient="from-amber-400 to-orange-500"
              href="/spotlight-media"
              features={[
                'Edu Spotlight Podcast: bi-weekly',
                'Doctorate Thesis Spotlight series',
                'Youth success stories worldwide',
                'Research-to-community frameworks',
              ]}
              delay={0.1}
            />
            <BranchCard
              icon={Gamepad2}
              index="03"
              title="Edutainment"
              subtitle="Engage"
              description="Gamified learning that feels like winning. From the Millionaire Game Show to Sezwor Mode's interactive group quizzes, bookable by schools and communities."
              color="text-emerald-600"
              gradient="from-emerald-400 to-teal-600"
              href="/edutainment"
              features={[
                'Millionaire educational game show',
                'Sezwor Mode: interactive group quizzes',
                'World National Flag Challenge',
                'School & community event bookings',
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ═══ AI TRACK SPOTLIGHT ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <SectionWrapper>
              <div className="section-tag mb-5" style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', borderColor: 'rgba(139,92,246,0.15)' }}>
                <Brain className="w-3.5 h-3.5" /> AI-Ready Curriculum
              </div>
              <h2 className="section-heading mb-5">
                Teaching Tomorrow&apos;s Skills. <span className="gradient-text">Today.</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-7">
                Coding teaches more than syntax: it builds critical thinking, logical reasoning, and the ability to decompose complex problems.
                Our competency-based AI pathway takes learners from understanding how AI works to building products that solve real-world challenges.
                Students develop life skills that transfer to any career.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, title: 'AI Developer (L4)', desc: 'ML with Teachable Machine, GPT APIs, OpenCV, prompt engineering, Jupyter', color: 'bg-purple-50 text-purple-600' },
                  { icon: Layers, title: 'Product Builder (L5)', desc: 'Next.js, Supabase, Stripe, Vercel: build & launch real SaaS', color: 'bg-emerald-50 text-emerald-600' },
                  { icon: Rocket, title: 'Code Prodigy', desc: 'Elite mentorship combining all tracks with hackathons and industry exposure', color: 'bg-amber-50 text-amber-600' },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className={`flex gap-3 p-4 rounded-2xl ${color.split(' ')[0]} border border-slate-100/50 hover:shadow-md transition-shadow duration-300`}>
                    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm mb-0.5">{title}</div>
                      <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/learning-hub#ai-tracks" className="btn-primary">
                Explore AI Tracks <ArrowRight className="w-4 h-4" />
              </Link>
            </SectionWrapper>

            {/* Visual right */}
            <SectionWrapper delay={0.2}>
              <div className="rounded-3xl p-8 border border-white/[0.06] relative overflow-hidden noise-overlay"
                style={{ background: 'linear-gradient(165deg, #0d1333 0%, #13103a 50%, #0c1a2e 100%)' }}>
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.3) 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shadow-lg"
                      style={{ boxShadow: '0 4px 20px rgba(110,66,255,0.4)' }}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">The Competency-Based Path</div>
                      <div className="text-white/40 text-xs">5 levels · Skill-based progression</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { n: 1, name: 'Explorer', age: 'Beginner', color: 'from-teal-400 to-emerald-500', tag: 'Scratch · Blockly' },
                      { n: 2, name: 'Builder', age: 'Intermediate', color: 'from-brand-400 to-blue-500', tag: 'App Inventor · Python' },
                      { n: 3, name: 'Creator', age: 'Advanced', color: 'from-violet-400 to-purple-600', tag: 'JS · React · APIs' },
                      { n: 4, name: 'AI Developer', age: 'Advanced+', color: 'from-pink-500 to-rose-500', tag: 'ML · GPT · Vision' },
                      { n: 5, name: 'Product Builder', age: 'Expert', color: 'from-emerald-500 to-teal-600', tag: 'SaaS · MVP · Launch' },
                    ].map(({ n, name, age, color, tag }, i) => (
                      <motion.div key={name}
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 group">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md`}>
                          {n}
                        </div>
                        <div className="flex-1 flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-all duration-300 border border-white/[0.04] group-hover:border-white/[0.08]">
                          <div>
                            <div className="text-white font-semibold text-sm">{name}</div>
                            <div className="text-white/35 text-[11px]">{age}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r ${color} text-white opacity-80`}>
                            {tag}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3.5 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Award className="w-4.5 h-4.5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-900">98% Completion</div>
                        <div className="text-[10px] text-slate-500">Across all tracks</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROGRAMS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-14">
            <SectionWrapper>
              <div className="section-tag mb-4">
                <Target className="w-3.5 h-3.5" /> Featured Programs
              </div>
              <h2 className="section-heading">Built for <span className="gradient-text">Results</span></h2>
            </SectionWrapper>
            <Link href="/learning-hub" className="btn-secondary text-sm flex-shrink-0">
              All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Coding for Kids', tag: 'Ages 5–12', desc: 'Fun, visual coding using Scratch and beginner Python. Builds logic, creativity, and confidence.', icon: Code2, color: 'from-brand-500 to-purple-600', href: '/learning-hub' },
              { title: 'AI Foundations Track', tag: 'Ages 14+', desc: 'Machine learning, prompt engineering, Python AI. Prepare for the AI-first economy.', icon: Brain, color: 'from-purple-500 to-indigo-600', href: '/learning-hub#ai-tracks' },
              { title: 'Product Builder', tag: 'Ages 16+', desc: 'Build and launch real SaaS products. Startup thinking, MVP development, and pitch coaching.', icon: Rocket, color: 'from-emerald-400 to-teal-600', href: '/learning-hub#ai-tracks' },
              { title: 'Code Prodigy Elite', tag: 'Application only', desc: 'Elite cohort for exceptional learners: hackathons, industry mentors, real project showcases.', icon: Trophy, color: 'from-amber-400 to-orange-500', href: '/learning-hub/code-prodigy' },
            ].map(({ title, tag, desc, icon: Icon, color, href }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="premium-card group flex flex-col gap-4 relative overflow-hidden">
                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-500`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">{tag}</div>
                  <h4 className="text-[16px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors duration-300" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h4>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-end pt-4 border-t border-slate-100">
                  <Link href={href} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-600 hover:gap-2.5 transition-all duration-300">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <TrendingUp className="w-3.5 h-3.5" /> Programs
            </div>
            <h2 className="section-heading mb-4">Our <span className="gradient-text">Programs</span></h2>
            <p className="section-subheading mx-auto">Past and upcoming programs that shape the next generation of builders.</p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Programs (active first, then completed) */}
            <SectionWrapper>
              <h3 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Programs
              </h3>
              <div className="space-y-3">
                {!programsLoaded ? (
                  <div className="premium-card text-slate-500 text-sm">Loading…</div>
                ) : programsList.length === 0 ? (
                  <div className="premium-card text-slate-500 text-sm">No programs to display yet.</div>
                ) : programsList.map((p, i) => {
                  const active = isActive(p);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="premium-card group relative overflow-hidden">
                      <div className={`absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl ${active ? 'bg-brand-500' : 'bg-emerald-400'}`} />
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.category && <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tagColorFor(p.category)}`}>{p.category}</span>}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-brand-50 text-brand-600' : 'bg-emerald-50 text-emerald-700'}`}>
                            {active ? (
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
                              </span>
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {active ? 'Active' : 'Completed'}
                          </span>
                        </div>
                        {p.startDate && <span className="text-[11px] text-slate-500 flex-shrink-0">{formatProgramDate(p.startDate)}</span>}
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.name}</h4>
                      {p.description && <p className="text-slate-500 text-[13px] leading-relaxed">{p.description}</p>}
                    </motion.div>
                  );
                })}
              </div>
            </SectionWrapper>

            {/* Upcoming Programs */}
            <SectionWrapper delay={0.1}>
              <h3 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                Upcoming
              </h3>
              <div className="space-y-3">
                {!programsLoaded ? (
                  <div className="premium-card text-slate-500 text-sm">Loading…</div>
                ) : upcomingPrograms.length === 0 ? (
                  <div className="premium-card text-slate-500 text-sm">No upcoming programs announced yet.</div>
                ) : upcomingPrograms.map((p, i) => {
                  const fee = feeLabel(p);
                  const hasInfoSession = !!(p.infoSessionEnabled && p.infoSessionDate);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="premium-card group relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-400 to-purple-500 rounded-l-2xl" />
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        {p.category && <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tagColorFor(p.category)}`}>{p.category}</span>}
                        {(p.eventDate || p.startDate) && <span className="text-[11px] text-brand-500 font-semibold flex-shrink-0">{p.eventDate ? p.eventDate : `Starts ${formatProgramDate(p.startDate!)}`}</span>}
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.name}</h4>
                      {p.description && <p className="text-slate-500 text-[13px] leading-relaxed mb-3">{p.description}</p>}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {fee && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${/free/i.test(fee) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            <DollarSign className="w-3 h-3" /> Fee: {fee}
                          </span>
                        )}
                        {p.prizes && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700">
                            <Trophy className="w-3 h-3" /> Prize: {p.prizes}
                          </span>
                        )}
                        {p.seats && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                            <Ticket className="w-3 h-3" /> Seats: {p.seats}
                          </span>
                        )}
                      </div>
                      {(p.ctaHref || hasInfoSession) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {p.ctaHref && (
                            <Link href={p.ctaHref} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11.5px] font-bold transition-all">
                              {p.ctaLabel || 'Learn more'} <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                          {hasInfoSession && (
                            <button onClick={() => setInfoSessionEvent(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white text-[11.5px] font-bold transition-all shadow-sm">
                              <Video className="w-3.5 h-3.5" /> Join the Info Session for this event!
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </SectionWrapper>
          </div>

          <div className="text-center">
            <Link href="/events" className="btn-secondary text-sm">
              View All Programs & Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED FROM THE BLOG ═══ */}
      {featuredPosts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <SectionWrapper className="text-center mb-12">
              <div className="section-tag mx-auto mb-5">
                <BookOpen className="w-3.5 h-3.5" /> From the Blog
              </div>
              <h2 className="section-heading mb-4">Insights worth your <span className="gradient-text">time</span></h2>
              <p className="section-subheading mx-auto">Strategy, frameworks, and case-quality writing on coding, AI, and the future of learning.</p>
            </SectionWrapper>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredPosts.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative group">
                  {/* Animated gradient border (reuses the `aurora` keyframe in globals.css) */}
                  <div aria-hidden
                    className="absolute -inset-px rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899, #f59e0b, #6e42ff)',
                      backgroundSize: '300% 300%',
                      animation: 'aurora 9s ease infinite',
                    }} />
                  <Link href={`/blog/${post.slug}`}
                    className="relative block rounded-[22px] bg-white overflow-hidden h-full flex flex-col">
                    {post.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.imageUrl} alt={post.title}
                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    ) : (
                      <div className={`w-full aspect-[16/9] bg-gradient-to-br ${postGradientFor(post.category)} flex items-center justify-center`}>
                        <Sparkles className="w-10 h-10 text-white/40" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${postTagColorFor(post.category)}`}>
                            {post.category}
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-[15px] sm:text-[16px] leading-snug mb-2 group-hover:text-brand-600 transition-colors flex-1"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-slate-500 text-[12.5px] leading-relaxed mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          {post.readMinutes ? <span className="whitespace-nowrap">{post.readMinutes} min read</span> : null}
                          {postTotalLikes(post) > 0 && (
                            <span className="inline-flex items-center gap-1 text-rose-500 font-bold tabular-nums">
                              <Heart className="w-3 h-3 fill-rose-500" /> {postTotalLikes(post).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {post.publishedAt && <span className="whitespace-nowrap">{formatPostDate(post.publishedAt)}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/blog" className="btn-secondary text-sm">
                Read the blog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ PARTNERS LOOP SLIDER (hidden: re-enable when partners are confirmed) ═══ */}
      {/*
      <section className="py-14 bg-white border-t border-slate-100/60 overflow-hidden">
        <p className="text-center text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] mb-8">
          Trusted by & in partnership with
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #fff 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #fff 0%, transparent 100%)' }} />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <span key={i}
                className="inline-flex items-center mx-5 sm:mx-8 md:mx-10 text-slate-300 font-extrabold text-[13px] sm:text-[15px] hover:text-brand-500 transition-colors duration-300 cursor-default select-none"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <span className="w-1 h-1 rounded-full bg-slate-200 mr-5 sm:mr-8 md:mr-10 flex-shrink-0" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* ═══ POWER HIGHLIGHTS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Trophy className="w-3.5 h-3.5" /> Why Families Choose Us
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Beyond Coding: A <span className="gradient-text-animated">Launchpad</span> for Scholarships & Careers
            </h2>
            <p className="section-subheading mx-auto">
              Competitions. Scholarship-ready portfolios. Career acceleration. ScholarlyEcho equips young people to win: on the world stage and in the workplace.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              {
                icon: Trophy, title: 'International Coding Competitions',
                desc: 'Train for global contests: Codeforces, Scratch Global Olympiad, Technovation, Hackathons, FIRST Robotics.',
                stat: '12+', statLabel: 'Competitions won',
                gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', color: 'text-amber-600',
              },
              {
                icon: GraduationCap, title: 'Scholarship-Ready Portfolio',
                desc: 'Real projects, verified skills, and track records that admissions committees love: from local grants to Ivy League STEM awards.',
                stat: 'Built', statLabel: 'For scholarship apps',
                gradient: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-50', color: 'text-emerald-600',
              },
              {
                icon: Briefcase, title: 'Career Acceleration',
                desc: 'Industry mentors, portfolio reviews, internship pipelines and AI-era skills that put learners years ahead of peers.',
                stat: '50+', statLabel: 'Partner companies',
                gradient: 'from-brand-500 to-purple-600', bg: 'bg-purple-50', color: 'text-brand-600',
              },
              {
                icon: Brain, title: 'Elite Training & Bootcamps',
                desc: 'Weekly group classes, 1-on-1 coaching, and holiday bootcamps led by engineers from Google, Microsoft, Stripe & Meta.',
                stat: '50+', statLabel: 'Vetted mentors',
                gradient: 'from-pink-500 to-rose-500', bg: 'bg-rose-50', color: 'text-rose-600',
              },
            ].map(({ icon: Icon, title, desc, stat, statLabel, gradient, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md group-hover:scale-105 transition-transform duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-4">{desc}</p>
                <div className={`pt-3 border-t border-slate-100 flex items-baseline gap-2 ${color}`}>
                  <span className="text-2xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Competition & career ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-7 sm:p-10 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4a1de0 0%, #7c3aed 50%, #ec4899 100%)' }}>
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
            <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="eyebrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white mb-4">
                  <Zap className="w-3 h-3" /> The ScholarlyEcho Edge
                </div>
                <h3 className="text-white text-2xl sm:text-3xl font-extrabold mb-3 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Coding competitions. Scholarships. Careers. All from one clear pathway.
                </h3>
                <p className="text-white/80 text-[14px] leading-relaxed max-w-2xl">
                  Our learners compete globally, build scholarship-winning portfolios, and walk into interviews with real shipped products. Reserve a FREE assessment class and see exactly where your child can go.
                </p>
              </div>
              <div className="flex md:justify-end">
                <button onClick={() => setTrialOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-brand-700 bg-white hover:bg-slate-50 transition-all duration-300 shadow-xl hover:-translate-y-0.5 text-[15px]">
                  Book FREE Class <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FREE TRIAL FORM ═══ */}
      <section id="free-trial" className="py-16 sm:py-20 md:py-28 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 50%, #0c1a2e 100%)' }}>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.10]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <SectionWrapper>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[13px] font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free · No Credit Card · No Obligation
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-5"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Try Your First Class: <span className="gradient-text-animated">Free</span>
              </h2>
              <p className="text-white/55 text-[1.05rem] leading-[1.75] mb-7 max-w-[520px]">
                Schedule a free, no-obligation assessment class with a certified mentor. We&apos;ll evaluate your child&apos;s skills, recommend the perfect pathway, and answer every question: all before you commit to anything.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Personalized skill assessment & learning plan',
                  '1-on-1 session with a world-class mentor',
                  'Preview the Coders Ladder and AI tracks live',
                  'Guidance on competitions & scholarship prep',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-white/70 text-[14px]">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                    </div>
                    {t}
                  </div>
                ))}
              </div>

            </SectionWrapper>

            <SectionWrapper delay={0.15}>
              <FreeTrialForm />
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-24 md:py-32 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />

        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <SectionWrapper>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-8"
              style={{ boxShadow: '0 0 80px rgba(110,66,255,0.4), 0 0 160px rgba(110,66,255,0.15)' }}
            >
              <Image src="/logo-white.png" alt="ScholarlyEcho" width={40} height={40} className="object-contain" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-[-0.03em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              The future belongs to{' '}
              <span className="gradient-text-animated">builders.</span>
              <br />Be one.
            </h2>
            <p className="text-white/40 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 200+ young people already building skills, making impact, and writing their own story: with ScholarlyEcho.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <button onClick={() => setTrialOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-9 py-4 rounded-2xl font-bold text-white text-[15px] sm:text-[16px] gradient-bg hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: '0 8px 40px rgba(110,66,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                Book FREE Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-9 py-4 rounded-2xl font-semibold text-white/80 text-[15px] sm:text-[16px] bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-300">
                Talk to the Team
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <FreeTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
      <InfoSessionPopup
        open={!!infoSessionEvent}
        onClose={() => setInfoSessionEvent(null)}
        source={`home-${infoSessionEvent?.id || 'unknown'}`}
        dateIso={infoSessionEvent?.infoSessionDate}
        timeLabel={infoSessionEvent?.infoSessionTime}
        eventName={infoSessionEvent?.name}
      />
    </div>
  );
}
