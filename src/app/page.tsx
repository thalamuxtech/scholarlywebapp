'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight, BookOpen, Mic2, Gamepad2, Star, Users, Award,
  TrendingUp, CheckCircle2, Play, ChevronRight, Sparkles,
  Code2, Globe, Trophy, Lightbulb, Brain, Zap,
  Layers, Target, BarChart3, Rocket, Heart
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import SectionWrapper from '@/components/ui/SectionWrapper';

/* ─────────────────── Sub-components ─────────────────── */

function FloatingChip({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute glass rounded-2xl shadow-2xl border border-white/12 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StatPill({ value, suffix, label, color, delay }: { value: number; suffix: string; label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-4 sm:px-6 py-5 relative group"
    >
      <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1.5 ${color} tracking-tight`}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <AnimatedCounter end={value} suffix={suffix} />
      </div>
      <div className="text-slate-400 text-xs sm:text-sm font-medium">{label}</div>
    </motion.div>
  );
}

function BranchCard({ icon: Icon, title, subtitle, description, color, gradient, href, features, delay }: {
  icon: React.ElementType; title: string; subtitle: string; description: string;
  color: string; gradient: string; href: string; features: string[]; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative premium-card overflow-hidden"
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
      {/* Glow orb */}
      <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <div className={`text-xs font-bold uppercase tracking-[0.1em] mb-1.5 ${color}`}>{subtitle}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{description}</p>

      <ul className="space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
            <div className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
              <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </div>
            {f}
          </li>
        ))}
      </ul>

      <Link href={href} className={`inline-flex items-center gap-2 text-sm font-semibold ${color} hover:gap-3 transition-all duration-300`}>
        Explore now <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, role, flag, delay }: { quote: string; name: string; role: string; flag: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }} className="premium-card flex flex-col gap-4 h-full relative overflow-hidden group">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 bg-brand-500" />
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
      </div>
      <p className="text-slate-600 leading-relaxed text-sm flex-1">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="text-2xl">{flag}</div>
        <div>
          <div className="text-sm font-bold text-slate-900">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ PAGE ═══════════════════ */
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const partners = ['Google.org', 'UNESCO', 'Microsoft', 'AWS Educate', 'She Code Africa', 'Andela', 'TechStars', 'ALX Africa', 'UNICEF', 'Meta for Developers', 'GitHub Education', 'African Union'];
  const globalNumbers = [
    { v: 20, s: '+', l: 'Countries Served' },
    { v: 1200, s: '+', l: 'Youth Trained' },
    { v: 98, s: '%', l: 'Satisfaction Rate' },
    { v: 300, s: '+', l: 'Projects Built' },
  ];

  return (
    <div className="overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary brand orb */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.15]"
            style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }}
          />
          {/* Pink accent orb */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.1]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
          />
          {/* Teal accent orb */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-[15%] left-[5%] w-[350px] h-[350px] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
          />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
          />

          {/* Stars */}
          {[...Array(30)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ width: `${0.8 + Math.random() * 1.5}px`, height: `${0.8 + Math.random() * 1.5}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3 + 0.05 }}
              animate={{ opacity: [0.05, Math.random() * 0.5 + 0.15, 0.05] }}
              transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}

          {/* Horizon glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(to top, rgba(110,66,255,0.06) 0%, transparent 100%)' }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* ── Left ── */}
              <div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl text-white/70 text-[13px] font-medium mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Serving 20+ countries across Africa & globally
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] font-extrabold text-white leading-[1.02] tracking-[-0.04em] mb-7"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Disrupting
                  <br />
                  <span className="gradient-text-animated">Education.</span>
                  <br />
                  <span className="text-white/90">Globally.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }}
                  className="text-[1rem] sm:text-[1.05rem] text-white/50 leading-[1.8] mb-10 max-w-[480px]">
                  ScholarlyEcho equips the next generation with AI-ready skills, authentic stories of achievement,
                  and gamified educational experiences — transforming youth from every corner of the world.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Link href="/learning-hub"
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-[15px] gradient-bg shadow-[0_8px_32px_rgba(110,66,255,0.4)] hover:shadow-[0_16px_48px_rgba(110,66,255,0.55)] hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: '0 8px 32px rgba(110,66,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                    Start for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link href="/spotlight-media"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/12 text-white/80 font-semibold text-[15px] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    </div>
                    Watch Stories
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                  className="mt-10 flex flex-wrap items-center gap-3 sm:gap-5">
                  <div className="flex -space-x-2.5">
                    {[['AM', '#6e42ff'], ['TK', '#f59e0b'], ['FO', '#10b981'], ['AJ', '#ec4899'], ['ND', '#3b82f6']].map(([init, bg], i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1333] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: bg as string }}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <div className="text-white/50 text-[13px]">
                    <span className="text-white font-bold">1,200+</span> learners worldwide
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                    <span className="text-white/50 text-[13px] ml-1.5">4.9/5</span>
                  </div>
                </motion.div>
              </div>

              {/* ── Right: Interactive visual ── */}
              <div className="relative h-[520px] hidden lg:block">
                {/* Central card */}
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-6 hero-card">
                  <div className="h-full flex flex-col">
                    <div className="px-6 py-5 flex items-center gap-3 border-b border-white/[0.06]"
                      style={{ background: 'linear-gradient(135deg, rgba(110,66,255,0.15) 0%, rgba(168,85,247,0.1) 100%)' }}>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Brain className="w-5 h-5 text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-[15px]">AI Builder Track</div>
                        <div className="text-white/40 text-xs">Module 4 — Building with GPT APIs</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-extrabold text-lg">82%</div>
                        <div className="text-white/35 text-xs">Complete</div>
                      </div>
                    </div>

                    <div className="px-5 pt-4 pb-3">
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5 mb-5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ delay: 1.2, duration: 1.8, ease: 'easeOut' }}
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
                        ].map(({ t, done }) => (
                          <div key={t} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${done ? 'bg-emerald-500/[0.08]' : 'bg-white/[0.03] hover:bg-white/[0.05]'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/80' : 'bg-white/10 border border-white/10'}`}>
                              {done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/30" />}
                            </div>
                            <span className={done ? 'text-white/70' : 'text-white/30'}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating chips */}
                <FloatingChip className="top-0 -left-4 px-4 py-3 text-white" delay={0.9}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-emerald-300">Achievement Unlocked</div>
                      <div className="text-[10px] text-white/40">First AI model deployed!</div>
                    </div>
                  </div>
                </FloatingChip>

                <FloatingChip className="-bottom-2 -right-2 px-4 py-3 text-white" delay={1.1}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-300">20+ Countries</div>
                      <div className="text-[10px] text-white/40">Global learner community</div>
                    </div>
                  </div>
                </FloatingChip>

                <FloatingChip className="bottom-28 -left-6 px-3.5 py-2.5 text-white" delay={1.2}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <Brain className="w-4 h-4 text-brand-400" />
                    <span className="text-white/70">AI-ready curriculum</span>
                  </div>
                </FloatingChip>

                <FloatingChip className="top-24 -right-4 px-3.5 py-2.5 text-white" delay={1.0}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70"><span className="font-bold text-white">1,200+</span> enrolled</span>
                  </div>
                </FloatingChip>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="py-10 sm:py-12 bg-white border-b border-slate-100/60 relative">
        <div className="absolute inset-0 opacity-30 mesh-bg" />
        <div className="max-w-5xl mx-auto px-5 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {globalNumbers.map(({ v, s, l }, i) => (
              <StatPill key={l} value={v} suffix={s} label={l}
                color={['gradient-text', 'gradient-text-gold', 'gradient-text-green', 'gradient-text'][i]}
                delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRANCH CARDS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 mesh-bg relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-16">
            <div className="section-tag mx-auto mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Three Pillars of Growth
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Everything the Next Generation Needs to <span className="gradient-text">Thrive</span>
            </h2>
            <p className="section-subheading mx-auto">
              Three powerful branches — build future-ready skills, draw inspiration from real stories,
              and engage through world-class educational entertainment.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-4 md:gap-7">
            <BranchCard
              icon={BookOpen}
              title="Learning Hub"
              subtitle="Learn"
              description="Structured coding and AI education from ages 7 to 30+. Progress through our 5-level Coders Ladder — from Scratch &amp; App Inventor to building real AI-powered products."
              color="text-brand-600"
              gradient="from-brand-500 to-purple-600"
              href="/learning-hub"
              features={[
                'Scratch, App Inventor & Python pathways',
                'AI Developer track — GPT, ML, OpenCV',
                'Product Builder — launch real SaaS',
                '1-on-1, group & bootcamp formats',
                'Certified global tutors & mentors',
              ]}
              delay={0}
            />
            <BranchCard
              icon={Mic2}
              title="Spotlight Media"
              subtitle="Inspire"
              description="Global podcast series, success stories, and research-to-impact spotlights. Real people from real places sharing real journeys — from Lagos to London to Silicon Valley."
              color="text-amber-600"
              gradient="from-amber-400 to-orange-500"
              href="/spotlight-media"
              features={[
                'Edu Spotlight Podcast — bi-weekly',
                'Doctorate Thesis Spotlight series',
                'Youth success story features worldwide',
                'Research-to-community frameworks',
              ]}
              delay={0.12}
            />
            <BranchCard
              icon={Gamepad2}
              title="Edutainment"
              subtitle="Engage"
              description="Gamified learning experiences that feel like winning. From our iconic Millionaire Game Show to Sezwor's multiplayer knowledge battles — education has never been this engaging."
              color="text-emerald-600"
              gradient="from-emerald-400 to-teal-600"
              href="/edutainment"
              features={[
                'Millionaire educational game show',
                'Sezwor — cross-Africa competitions',
                'World National Flag Challenge',
                'School & community event bookings',
              ]}
              delay={0.24}
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
                The world&apos;s most in-demand skills are changing fast. We&apos;ve built Africa&apos;s most comprehensive
                AI education pathway for youth — from understanding how AI works, to building AI-powered
                products that solve real problems.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, title: 'AI Developer (L4)', desc: 'ML with Teachable Machine, GPT APIs, OpenCV, prompt engineering, Jupyter', color: 'bg-purple-50 text-purple-600' },
                  { icon: Layers, title: 'Product Builder (L5)', desc: 'Next.js, Supabase, Stripe, Vercel — build & launch real SaaS', color: 'bg-emerald-50 text-emerald-600' },
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
                      <div className="text-white font-bold">The Complete Learning Path</div>
                      <div className="text-white/40 text-xs">5 levels · AI-first design</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { n: 1, name: 'Explorer', age: 'Ages 7–10', color: 'from-teal-400 to-emerald-500', tag: 'Scratch · Blockly' },
                      { n: 2, name: 'Builder', age: 'Ages 10–13', color: 'from-brand-400 to-blue-500', tag: 'App Inventor · Python' },
                      { n: 3, name: 'Creator', age: 'Ages 13–16', color: 'from-violet-400 to-purple-600', tag: 'JS · React · APIs' },
                      { n: 4, name: 'AI Developer', age: 'Ages 14+', color: 'from-pink-500 to-rose-500', tag: 'ML · GPT · Computer Vision' },
                      { n: 5, name: 'Product Builder', age: 'Ages 16+', color: 'from-emerald-500 to-teal-600', tag: 'SaaS · MVP · Launch' },
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
                        <div className="text-[10px] text-slate-400">Across all tracks</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ═══ WHY SCHOLARLYECHO ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-16">
            <div className="section-tag mx-auto mb-5">
              <Lightbulb className="w-3.5 h-3.5" /> The ScholarlyEcho Difference
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Not Just Education — <span className="gradient-text">A Movement</span>
            </h2>
            <p className="section-subheading mx-auto">
              Traditional education is slow. We move at the speed of the digital economy — with the heart of a community.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Brain, title: 'AI-First Curriculum', desc: 'Every learner develops AI literacy and the ability to build with AI tools — a non-negotiable for the modern world.', color: 'bg-purple-50 text-purple-600', gradient: 'from-purple-500 to-indigo-600' },
              { icon: Globe, title: 'Globally Connected', desc: 'Learners, mentors, and partners from 20+ countries. Your network grows as fast as your skills.', color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-brand-600' },
              { icon: Heart, title: 'Community-Rooted', desc: 'Africa-rooted and globally minded. Our context, stories, and pricing reflect the communities we serve.', color: 'bg-rose-50 text-rose-600', gradient: 'from-rose-500 to-pink-600' },
              { icon: BarChart3, title: 'Measurable Outcomes', desc: 'We track and publish impact data — projects built, careers launched, research implemented.', color: 'bg-emerald-50 text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
            ].map(({ icon: Icon, title, desc, color, gradient }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group relative overflow-hidden">
                {/* Hover glow */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-105 transition-transform duration-500`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2.5 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
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
              { title: 'Coding for Kids', tag: 'Ages 7–12', desc: 'Fun, visual coding using Scratch and beginner Python. Builds logic, creativity, and confidence.', price: 'From $19/mo', icon: Code2, color: 'from-brand-500 to-purple-600', href: '/learning-hub' },
              { title: 'AI Foundations Track', tag: 'Ages 14+', desc: 'Machine learning, prompt engineering, Python AI. Prepare for the AI-first economy.', price: 'From $39/mo', icon: Brain, color: 'from-purple-500 to-indigo-600', href: '/learning-hub#ai-tracks' },
              { title: 'Product Builder', tag: 'Ages 16+', desc: 'Build and launch real SaaS products. Startup thinking, MVP development, and pitch coaching.', price: 'From $59/mo', icon: Rocket, color: 'from-emerald-400 to-teal-600', href: '/learning-hub#ai-tracks' },
              { title: 'Code Prodigy Elite', tag: 'Application only', desc: 'Elite cohort for exceptional learners — hackathons, industry mentors, real project showcases.', price: 'Apply to access', icon: Trophy, color: 'from-amber-400 to-orange-500', href: '/learning-hub/code-prodigy' },
            ].map(({ title, tag, desc, price, icon: Icon, color, href }, i) => (
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
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">{tag}</div>
                  <h4 className="text-[16px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors duration-300" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h4>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[13px] font-bold text-slate-700">{price}</span>
                  <Link href={href} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-600 hover:gap-2.5 transition-all duration-300">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GLOBAL IMPACT MAP ═══ */}
      <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 50%, #0c1a2e 100%)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <SectionWrapper className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] font-medium mb-5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Global Reach
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight tracking-[-0.02em]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Learning Knows <span className="gradient-text-animated">No Borders</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto">
              From Maryland to Nairobi, Lagos to London — ScholarlyEcho is where the world&apos;s youth come to level up.
            </p>
          </SectionWrapper>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {[
              { region: 'Sub-Saharan Africa', countries: '12 countries', flag: '🌍', learners: '800+ learners' },
              { region: 'North America', countries: 'USA & Canada', flag: '🌎', learners: '150+ learners' },
              { region: 'Europe', countries: 'UK, Germany, France', flag: '🌍', learners: '120+ learners' },
              { region: 'Asia Pacific', countries: 'India, Australia', flag: '🌏', learners: '80+ learners' },
            ].map(({ region, countries, flag, learners }, i) => (
              <motion.div key={region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 border border-white/[0.06] text-center group hover:border-white/[0.12] transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-3xl mb-3">{flag}</div>
                <div className="text-white font-bold text-[14px] sm:text-[15px] mb-1">{region}</div>
                <div className="text-white/35 text-[12px] mb-2">{countries}</div>
                <div className="text-emerald-400 text-[12px] font-semibold">{learners}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Star className="w-3.5 h-3.5" /> Global Community
            </div>
            <h2 className="section-heading mb-4">Voices from <span className="gradient-text">Around the World</span></h2>
            <p className="section-subheading mx-auto">
              Students, parents, researchers, and school leaders share their ScholarlyEcho experience.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="My son joined at 11, zero coding knowledge. Two years later he's built an app for our community's farm market and is teaching other kids in our village. ScholarlyEcho changed what we thought was possible."
              name="Amina Diallo"
              role="Parent · Dakar, Senegal"
              flag="🇸🇳"
              delay={0}
            />
            <TestimonialCard
              quote="The AI Foundations track is exactly what was missing in our school district. I enrolled three of my students and within months they were building machine learning projects. Absolutely world-class content."
              name="Ms. Rachel Thompson"
              role="STEM Teacher · Atlanta, USA"
              flag="🇺🇸"
              delay={0.1}
            />
            <TestimonialCard
              quote="Presenting at the Thesis Spotlight gave my PhD research the visibility it deserved. Within two weeks I had five partnership requests from education NGOs across West Africa. The platform is genuinely transformative."
              name="Dr. Kwame Asante"
              role="Researcher · University of Ghana"
              flag="🇬🇭"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING EVENTS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionWrapper>
              <div className="section-tag mb-4">
                <TrendingUp className="w-3.5 h-3.5" /> Events
              </div>
              <h2 className="section-heading">What&apos;s Coming Up</h2>
            </SectionWrapper>
            <Link href="/events" className="btn-secondary text-sm flex-shrink-0">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { date: 'Apr 12', title: 'Global Holiday Coding Bootcamp', type: 'Learning Hub', location: 'Online + Physical', color: 'from-brand-500 to-purple-600', tagColor: 'bg-brand-50 text-brand-600' },
              { date: 'Apr 26', title: 'Millionaire Game Show — Continental Edition', type: 'Edutainment', location: 'Multi-city + Livestream', color: 'from-emerald-400 to-teal-600', tagColor: 'bg-emerald-50 text-emerald-600' },
              { date: 'May 8', title: 'Research-to-Impact Global Summit', type: 'Spotlight Media', location: 'Virtual (Worldwide)', color: 'from-amber-400 to-orange-500', tagColor: 'bg-amber-50 text-amber-600' },
            ].map((event, i) => (
              <motion.div key={event.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card overflow-hidden group relative">
                <div className={`h-[3px] bg-gradient-to-r ${event.color} -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-5 sm:mb-6`} />
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${event.tagColor}`}>{event.type}</span>
                <h4 className="text-[16px] font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors duration-300 leading-snug"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{event.title}</h4>
                <div className="space-y-1.5 mb-5 text-sm text-slate-400">
                  <div className="flex items-center gap-2">📅 {event.date}, 2026</div>
                  <div className="flex items-center gap-2">📍 {event.location}</div>
                </div>
                <Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:gap-3 transition-all duration-300">
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS LOOP SLIDER ═══ */}
      <section className="py-14 bg-white border-t border-slate-100/60 overflow-hidden">
        <p className="text-center text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] mb-8">
          Trusted by & in partnership with
        </p>
        <div className="relative">
          {/* Fade edges */}
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
              Join 1,200+ young people already building skills, making impact, and writing their own story — with ScholarlyEcho.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <Link href="/learning-hub"
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-9 py-4 rounded-2xl font-bold text-white text-[15px] sm:text-[16px] gradient-bg hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: '0 8px 40px rgba(110,66,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-9 py-4 rounded-2xl font-semibold text-white/80 text-[15px] sm:text-[16px] bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-300">
                Talk to the Team
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
