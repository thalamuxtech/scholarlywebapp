'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight, BookOpen, Mic2, Gamepad2, Star, Users, Award,
  TrendingUp, CheckCircle2, Play, ChevronRight, Sparkles,
  Code2, Globe, Trophy, Lightbulb, Brain, Zap,
  Layers, Target, BarChart3, Rocket, Heart, GraduationCap, Briefcase,
  Home, Calendar, Eye, Shield
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FreeTrialForm, { FreeTrialModal } from '@/components/FreeTrialForm';
import { CourseStack } from '@/components/TechLogos';

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
  const [trialOpen, setTrialOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
                  The #1 coding & AI program for homeschooling families · 5+ countries
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
                  className="text-[1rem] sm:text-[1.05rem] text-white/50 leading-[1.8] mb-6 max-w-[480px]">
                  Coding is the 4th literacy. ScholarlyEcho teaches young people to think critically,
                  solve real-world problems, and build with technology: developing life skills that go far beyond the screen.
                  <span className="block mt-3 text-white/65"><span className="text-white font-semibold">Loved by homeschooling families</span>: flexible pacing, parent-friendly progress tracking, and rich cognitive development for growing minds.</span>
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 text-emerald-300 text-[12px] font-semibold mb-8">
                  <Brain className="w-3.5 h-3.5" />
                  Homeschool-friendly · Built for brain development
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button onClick={() => setTrialOpen(true)}
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-[15px] gradient-bg shadow-[0_8px_32px_rgba(110,66,255,0.4)] hover:shadow-[0_16px_48px_rgba(110,66,255,0.55)] hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: '0 8px 32px rgba(110,66,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                    Book FREE Assessment Class <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <Link href="/learning-hub"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/12 text-white/80 font-semibold text-[15px] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    </div>
                    Explore Programs
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
                    <span className="text-white font-bold">200+</span> learners worldwide
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
                        <div className="text-white/40 text-xs">Module 4: Building with GPT APIs</div>
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
                      <div className="text-[11px] font-bold text-amber-300">5+ Countries</div>
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

                <FloatingChip className="top-1/2 -right-2 px-3.5 py-2.5 text-white" delay={1.3}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/70">Homeschool-friendly</span>
                  </div>
                </FloatingChip>

                <FloatingChip className="top-24 -right-4 px-3.5 py-2.5 text-white" delay={1.0}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70"><span className="font-bold text-white">200+</span> enrolled</span>
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
              The <span className="gradient-text">#1 Coding & AI Program</span> for Homeschoolers
            </h2>
            <p className="section-subheading mx-auto max-w-2xl">
              Homeschooling families are at the heart of what we do. Flexible, parent-led, and engineered for serious brain development: our curriculum slots into any homeschool rhythm.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
            {[
              { icon: Calendar, title: 'Truly Flexible Scheduling', desc: 'Weekday, weekend, morning or evening slots. Self-paced progression so your homeschool calendar always wins.' },
              { icon: Brain, title: 'Brain Development First', desc: 'Coding strengthens logic, working memory, focus, and creative problem-solving: the foundations of a sharp young mind.' },
              { icon: Users, title: 'Sibling Discounts That Stack', desc: 'Built for multi-child homeschool families. Add siblings affordably: the more children, the bigger the savings.' },
              { icon: Eye, title: 'Parent-Visible Progress', desc: 'Real-time dashboards so parents stay fully in the loop: see milestones, projects, and skill growth at a glance.' },
              { icon: Shield, title: 'Safe, Screen-Time-Optimal', desc: 'Live mentors, vetted instructors, and a child-safety-first environment. Quality screen time you can feel good about.' },
              { icon: Trophy, title: 'Real Projects, Real Portfolios', desc: 'From Scratch animations to AI apps. Homeschool learners graduate with portfolios that open scholarship & competition doors.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl bg-white p-6 border border-amber-100 hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-slate-900 mb-2 text-[15px]">{title}</div>
                <div className="text-slate-600 text-[13px] leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/assessment-class"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[15px] shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 transition-all">
              Book a FREE Homeschool Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-3 text-slate-500 text-[12px]">No card needed · 30-minute Zoom · Custom plan you keep</div>
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
              <Code2 className="w-3.5 h-3.5" /> The 4th Literacy
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Coding &amp; AI: the <span className="gradient-text-animated">4th Literacy</span>
            </h2>
            <p className="section-subheading mx-auto">
              Reading, writing, and arithmetic shaped the last century. Coding and AI are the foundational skills shaping this one: the language of technology, creativity, and solving problems that matter.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '1st', title: 'Reading', desc: 'Understanding language to make sense of the world and absorb knowledge.', icon: BookOpen, color: 'from-blue-500 to-brand-500', active: false },
              { n: '2nd', title: 'Writing', desc: 'Creating and communicating ideas that shape thought and inspire action.', icon: Sparkles, color: 'from-emerald-500 to-teal-600', active: false },
              { n: '3rd', title: 'Arithmetic', desc: 'Numbers, logic, and reasoning: the foundation of analytical thinking.', icon: BarChart3, color: 'from-amber-500 to-orange-500', active: false },
              { n: '4th', title: 'Coding & AI', desc: 'The language for navigating and shaping the digital world: coding and AI foster creativity, logic, critical thinking, and real-world problem-solving.', icon: Code2, color: 'from-brand-500 to-purple-600', active: true },
            ].map(({ n, title, desc, icon: Icon, color, active }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-5 border transition-all duration-500 relative overflow-hidden group ${
                  active
                    ? 'bg-gradient-to-br from-brand-500 to-purple-600 border-transparent text-white shadow-[0_8px_32px_rgba(110,66,255,0.25)]'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                }`}>
                {active && (
                  <motion.div className="absolute inset-0 opacity-20"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)', backgroundSize: '200% 200%' }} />
                )}
                <div className="relative z-10">
                  <div className={`text-[11px] font-extrabold uppercase tracking-[0.15em] mb-3 ${active ? 'text-white/60' : 'text-slate-400'}`}>
                    {n} Literacy
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    active ? 'bg-white/20' : `bg-gradient-to-br ${color}`
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white'}`} />
                  </div>
                  <h3 className={`font-extrabold text-lg mb-2 ${active ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {title}
                  </h3>
                  <p className={`text-[13px] leading-relaxed ${active ? 'text-white/70' : 'text-slate-500'}`}>{desc}</p>
                </div>
              </motion.div>
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
              Three powerful branches: build future-ready skills, draw inspiration from real stories,
              and engage through world-class educational entertainment.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-4 md:gap-7">
            <BranchCard
              icon={BookOpen}
              title="Learning Hub"
              subtitle="Learn"
              description="Project-based coding that builds critical thinking, problem-solving, and creativity. Progress through our competency-based Coders Ladder: from visual coding to launching AI-powered products. Students are prepared for international coding competitions."
              color="text-brand-600"
              gradient="from-brand-500 to-purple-600"
              href="/learning-hub"
              features={[
                'Scratch, App Inventor & Python pathways',
                'AI Developer track: GPT, ML, OpenCV',
                'Product Builder: launch real SaaS',
                '1-on-1, group & bootcamp formats',
                'Certified global tutors & mentors',
              ]}
              delay={0}
            />
            <BranchCard
              icon={Mic2}
              title="Spotlight Media"
              subtitle="Inspire"
              description="Global podcast series, success stories, and research-to-impact spotlights. Real people from real places sharing real journeys: from Lagos to London to Silicon Valley."
              color="text-amber-600"
              gradient="from-amber-400 to-orange-500"
              href="/spotlight-media"
              features={[
                'Edu Spotlight Podcast: bi-weekly',
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
              description="Gamified learning experiences that feel like winning. From our iconic Millionaire Game Show to Sezwor Mode's interactive group quizzes: education has never been this engaging."
              color="text-emerald-600"
              gradient="from-emerald-400 to-teal-600"
              href="/edutainment"
              features={[
                'Millionaire educational game show',
                'Sezwor Mode: interactive group quizzes',
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
              More Than Coding: <span className="gradient-text">Life Skills</span>
            </h2>
            <p className="section-subheading mx-auto">
              Coding develops critical thinking, logical reasoning, creativity, and the ability to solve complex problems: skills that transfer to every career and life challenge.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Lightbulb, title: 'Critical Thinking', desc: 'Every project requires breaking down complex problems into smaller steps: a skill that transfers to academics, careers, and everyday decisions.', color: 'bg-purple-50 text-purple-600', gradient: 'from-purple-500 to-indigo-600' },
              { icon: Brain, title: 'Problem Solving', desc: 'Debugging code is training the brain to persist, analyze, and find solutions. These are the life skills employers value most.', color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-brand-600' },
              { icon: Trophy, title: 'Competition Ready', desc: 'Students are prepared for internationally recognized coding competitions: building confidence, resilience, and a competitive edge.', color: 'bg-amber-50 text-amber-600', gradient: 'from-amber-500 to-orange-500' },
              { icon: BarChart3, title: 'Measurable Growth', desc: 'Competency-based progression. Every level ends with a real project that demonstrates mastery: not just time spent in a seat.', color: 'bg-emerald-50 text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
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
              { title: 'Coding for Kids', tag: 'Ages 5–12', desc: 'Fun, visual coding using Scratch and beginner Python. Builds logic, creativity, and confidence.', price: 'From $19/mo', icon: Code2, color: 'from-brand-500 to-purple-600', href: '/learning-hub' },
              { title: 'AI Foundations Track', tag: 'Ages 14+', desc: 'Machine learning, prompt engineering, Python AI. Prepare for the AI-first economy.', price: 'From $39/mo', icon: Brain, color: 'from-purple-500 to-indigo-600', href: '/learning-hub#ai-tracks' },
              { title: 'Product Builder', tag: 'Ages 16+', desc: 'Build and launch real SaaS products. Startup thinking, MVP development, and pitch coaching.', price: 'From $59/mo', icon: Rocket, color: 'from-emerald-400 to-teal-600', href: '/learning-hub#ai-tracks' },
              { title: 'Code Prodigy Elite', tag: 'Application only', desc: 'Elite cohort for exceptional learners: hackathons, industry mentors, real project showcases.', price: 'Apply to access', icon: Trophy, color: 'from-amber-400 to-orange-500', href: '/learning-hub/code-prodigy' },
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
              From Maryland to Nairobi, Lagos to London: ScholarlyEcho is where the world&apos;s youth come to level up.
            </p>
          </SectionWrapper>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {[
              { region: 'Sub-Saharan Africa', countries: 'Nigeria, Ghana, Kenya', flag: '🌍', learners: '120+ learners' },
              { region: 'North America', countries: 'USA & Canada', flag: '🌎', learners: '40+ learners' },
              { region: 'Europe', countries: 'United Kingdom', flag: '🌍', learners: '25+ learners' },
              { region: 'Asia Pacific', countries: 'Growing reach', flag: '🌏', learners: '15+ learners' },
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
            {/* Past Programs */}
            <SectionWrapper>
              <h3 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Summer of Code 2025', date: 'Jun–Aug 2025', tag: 'Learning Hub', tagColor: 'bg-brand-50 text-brand-600', desc: 'Intensive summer coding bootcamp across 3 continents: 500+ students graduated.' },
                  { title: 'Build for Ramadan 2026', date: 'Mar 2026', tag: 'Community', tagColor: 'bg-emerald-50 text-emerald-600', desc: 'Special program blending tech education with community service during Ramadan.' },
                  { title: 'AI Track Launch 2025', date: 'Sep 2025', tag: 'AI Developer', tagColor: 'bg-purple-50 text-purple-600', desc: 'Launch of AI Developer and Product Builder tracks with first cohort of 120 students.' },
                ].map((p, i) => (
                  <motion.div key={p.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="premium-card group relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-emerald-400 rounded-l-2xl" />
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.tagColor}`}>{p.tag}</span>
                      <span className="text-[11px] text-slate-400 flex-shrink-0">{p.date}</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.title}</h4>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
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
                {[
                  { title: 'Summer of Code 2026', date: 'Jun–Aug 2026', tag: 'Learning Hub', tagColor: 'bg-brand-50 text-brand-600', desc: 'Our biggest summer bootcamp yet: online + physical in 5 cities globally. Early registration open.' },
                  { title: 'Millionaire Game Show: Continental Tour', date: 'Apr 2026', tag: 'Edutainment', tagColor: 'bg-amber-50 text-amber-600', desc: 'Multi-city educational game show across Lagos, Accra, London, and more.' },
                  { title: 'Research-to-Impact Summit', date: 'May 2026', tag: 'Spotlight Media', tagColor: 'bg-amber-50 text-amber-600', desc: 'Global virtual summit connecting PhD researchers with communities for real-world impact.' },
                ].map((p, i) => (
                  <motion.div key={p.title} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="premium-card group relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-400 to-purple-500 rounded-l-2xl" />
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.tagColor}`}>{p.tag}</span>
                      <span className="text-[11px] text-brand-500 font-semibold flex-shrink-0">{p.date}</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.title}</h4>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
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
                  <span className="text-[11px] font-semibold text-slate-400">{statLabel}</span>
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-3">
                  ⚡ THE SCHOLARLYECHO EDGE
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
    </div>
  );
}
