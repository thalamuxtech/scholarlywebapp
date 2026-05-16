'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket, Sparkles, Trophy, Award, Calendar, Clock, Users,
  Brain, Star, CheckCircle2, ArrowRight, Globe, Zap, Target,
  Cpu, Lightbulb, BookOpen, Medal, Gift, Flame, ShieldCheck,
  Layers, Heart, HandHeart, Wand2, Wrench, MessageSquare,
  BarChart3, Megaphone, LineChart, GraduationCap
} from 'lucide-react';
import TechLogos from '@/components/TechLogos';

const MODULES = [
  { week: 'Wk 1', label: 'Spark', icon: Lightbulb, desc: 'Find a problem worth solving — interviews, PUR filter, AI skeptic.' },
  { week: 'Wk 2', label: 'Idea Refinement', icon: Brain, desc: 'JTBD lens, 50 variants, the 3 Core Actions rule, anti-scope list.' },
  { week: 'Wk 3', label: 'Prompt Engineering', icon: Wand2, desc: 'The 5-part prompt pattern, JSON outputs, model bake-offs on LMArena.' },
  { week: 'Wk 4', label: 'Design the MVP', icon: Layers, desc: 'User journey, Figma wireframes, AI UI with v0 / Galileo, brand kit.' },
  { week: 'Wk 5', label: 'Build the MVP', icon: Wrench, desc: 'Ship a live app with Lovable / Bolt / Replit Agent. Real URL.' },
  { week: 'Wk 6', label: 'Make It Smart', icon: Cpu, desc: 'Add AI features via Groq / Gemini, structured output, mini agent loops.' },
  { week: 'Wk 7', label: 'The Pitch', icon: MessageSquare, desc: 'Landing page + first 5 real users + recorded pitch calls.' },
  { week: 'Wk 8', label: 'Feedback & Retention', icon: BarChart3, desc: 'Analytics with PostHog & Clarity, usability tests, AI feedback synthesis.' },
  { week: 'Wk 9', label: 'Launch', icon: Megaphone, desc: 'Coordinated public launch — Product Hunt, Reddit, your channels. First 100 users.' },
  { week: 'Wk 10', label: 'Beyond MVP', icon: LineChart, desc: 'Growth loops, monetization, payments, sustainability pact.' },
  { week: 'Demo', label: 'Capstone Demo Day', icon: Trophy, desc: 'Public 5–7 minute pitch + live demo + awards.' },
];

const BENEFITS = [
  { icon: Rocket, title: 'Ship something real', desc: 'No more half-finished side projects. By Demo Day you have a live URL, real users, and a story to tell.', color: 'from-brand-500 to-purple-600' },
  { icon: Brain, title: 'AI-native by default', desc: 'You will learn to prompt, pick, and combine the smartest free LLMs — and ship them inside a real product, not a notebook.', color: 'from-amber-500 to-orange-500' },
  { icon: Zap, title: 'No coding background needed', desc: 'Modern AI builders (Lovable, Bolt, v0, Replit Agent, Glide) mean you can ship a product in week 5 without writing code from scratch.', color: 'from-emerald-500 to-teal-600' },
  { icon: Users, title: 'Pods + mentors', desc: 'Small accountability pods of 3–4 builders, weekend office hours, and instructor video for every module.', color: 'from-pink-500 to-rose-500' },
  { icon: Trophy, title: 'Capstone Demo Day', desc: 'Pitch your MVP to peers, parents, and invited guests. Top builds win prizes and a Hall of Builders feature.', color: 'from-violet-500 to-indigo-600' },
  { icon: Medal, title: 'Portfolio + certificate', desc: 'Walk away with a live MVP, demo video, metrics dashboard, pitch deck — and an official ScholarlyEcho certificate.', color: 'from-fuchsia-500 to-pink-600' },
];

const INCLUDES = [
  { icon: Calendar, t: '90–120 min live lessons', d: 'One module per week + weekend office hours' },
  { icon: Trophy, t: 'Public Capstone Demo Day', d: 'Pitch a live MVP with real users and metrics' },
  { icon: Award, t: 'Official certificate', d: 'Issued by ScholarlyEcho on capstone completion' },
  { icon: Medal, t: 'Prizes for top builds', d: 'Best Pitch · Best Product · People’s Choice' },
  { icon: Users, t: 'Accountability pods', d: '3–4 builders, peer reviews, weekly check-ins' },
  { icon: ShieldCheck, t: 'Free-tier-first', d: 'Every tool has a free tier; never need a credit card' },
  { icon: Star, t: 'Reusable prompt pack', d: '10+ builder prompts you keep forever' },
  { icon: Flame, t: 'Onramp to next steps', d: 'Path into Product Builder & Code Prodigy programs' },
];

const FAQ = [
  { q: 'When does the program start?', a: 'Sunday, May 31, 2026. The course runs for 10 weeks (one module per week) plus a public Capstone Demo Day. Exact session days/times will be confirmed at registration based on your cohort and time zone.' },
  { q: 'Do I need any coding background?', a: 'No. The whole point is that you do not need to code from scratch. You will use AI app builders (Lovable, Bolt, v0, Replit Agent, Glide) to ship a real product, and pick up just enough code along the way to remix and extend it.' },
  { q: 'How old do I have to be?', a: 'The course is built for curious kids and young adults ages 11–22. Under 13 needs a parent/guardian for sign-ups and supervised account creation. We will help with that on intake.' },
  { q: 'What do I walk away with?', a: 'A live MVP on a real URL, a 60–90 sec demo video, a landing page, a pitch deck, a metrics dashboard, 5+ verified users, an iteration log, a 90-day plan, and an official ScholarlyEcho certificate.' },
  { q: 'How much does it cost?', a: '$350 after the standard 30% discount is already applied (base $500). A handful of need-based scholarships are reserved every cohort — just check the box on the registration form and tell us your story.' },
];

export default function Idea2MVPPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-28 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #1a0d2e 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[8%] left-[8%] w-[520px] h-[520px] rounded-full opacity-[0.18]"
            style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[5%] right-[8%] w-[460px] h-[460px] rounded-full opacity-[0.15]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[50%] left-[35%] w-[320px] h-[320px] rounded-full opacity-[0.1]"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          {[...Array(36)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{
                width: `${0.8 + Math.random() * 1.5}px`,
                height: `${0.8 + Math.random() * 1.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.05,
              }}
              animate={{ opacity: [0.05, Math.random() * 0.5 + 0.15, 0.05] }}
              transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }} />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-pink-500/20 border border-brand-300/20 text-brand-200 text-[13px] mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" /> Idea2MVP · 10 weeks + Capstone · Starts May 31, 2026
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-[-0.035em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            From Spark to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">Shipped Product</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-9">
            You don&apos;t need to code from scratch. You need to ship something real.{' '}
            <span className="text-white/80 font-semibold">10 weeks of live lessons, hands-on labs, and AI-native builds</span>{' '}
            <span className="text-white/70">— ending with a public Capstone Demo Day where you pitch a live MVP with real users.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.28 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-md mb-8">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">30% OFF</span>
            <span className="text-white/40 line-through text-sm">$500</span>
            <span className="text-white text-2xl font-extrabold">$350</span>
            <span className="text-white/50 text-xs">all-in · 10 weeks + Capstone</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/idea2mvp-2026/register"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-extrabold text-white overflow-hidden shadow-[0_8px_32px_rgba(110,66,255,0.45)] hover:shadow-[0_12px_44px_rgba(110,66,255,0.65)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <Rocket className="w-5 h-5 relative" /> <span className="relative">Reserve Your Seat</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#modules"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-white/15 text-white/85 font-semibold hover:bg-white/[0.06] transition-all">
              See the 10-Week Roadmap
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto mt-14">
            {[
              { v: 'May 31', l: 'Starts 2026' },
              { v: '10 wks', l: '+ Demo Day' },
              { v: '$350', l: 'After 30% off' },
              { v: 'Ages 11+', l: 'No code needed' },
            ].map((s, i) => (
              <motion.div key={s.l}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.06 }}
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 backdrop-blur-md">
                <div className="text-white text-lg sm:text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.v}</div>
                <div className="text-white/50 text-[11px] uppercase tracking-wider font-semibold mt-0.5">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.4) 30%, rgba(236,72,153,0.5) 50%, rgba(245,158,11,0.4) 70%, transparent 100%)' }} />
      </section>

      {/* ═══ TOOLS ═══ */}
      <section className="py-10 sm:py-14 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <TechLogos theme="light" category="idea2mvp" eyebrow="Built with free & open AI builders, models and platforms" />
        </div>
      </section>

      {/* ═══ WHY THIS COURSE ═══ */}
      <section className="py-16 sm:py-20 md:py-28 mesh-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold mb-4 border border-brand-100">
              <Sparkles className="w-3 h-3" /> Why Idea2MVP
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-4 max-w-3xl mx-auto"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Most beginner projects die. <span className="bg-gradient-to-r from-brand-600 to-pink-600 bg-clip-text text-transparent">Yours won&apos;t.</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every week is one shippable mini-build. By week 5 you have a real URL. By week 10 you have real users, real metrics, and a plan.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-[15px] mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{b.title}</h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-4 border border-emerald-100">
              <Gift className="w-3 h-3" /> What&apos;s Included
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Every Seat Comes With <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">All of This</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCLUDES.map(({ icon: Icon, t, d }, i) => (
              <motion.div key={t}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-slate-50/80 border border-slate-100 p-5 hover:border-brand-200 hover:bg-white hover:shadow-md transition-all duration-300">
                <Icon className="w-5 h-5 text-brand-500 mb-3" />
                <h4 className="font-bold text-slate-900 text-[14px] mb-1">{t}</h4>
                <p className="text-slate-500 text-[12px] leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10-WEEK ROADMAP ═══ */}
      <section id="modules" className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold mb-4 border border-purple-100">
              <Calendar className="w-3 h-3" /> 10-Week Roadmap + Demo Day
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              From <span className="text-brand-500">First Problem</span> to <span className="text-pink-600">Live MVP</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">One module a week. One mini-build a week. One public demo at the end.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand-400 via-pink-500 to-amber-400 rounded-full" />
            <div className="space-y-4">
              {MODULES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.week}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="relative flex items-center gap-4 sm:gap-5 pl-1">
                    <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">{s.week}</span>
                        <h4 className="font-bold text-slate-900 text-[14px] sm:text-[15px]">{s.label}</h4>
                      </div>
                      <p className="text-slate-500 text-[12px] sm:text-[13px]">{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-[-0.03em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Questions, Answered
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <motion.details key={f.q}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all overflow-hidden">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                  <span className="font-bold text-slate-800 text-[14px] sm:text-[15px]">{f.q}</span>
                  <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-500 text-[13px] sm:text-[14px] leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCHOLARSHIPS ═══ */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-brand-50/30 to-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl p-[1.5px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(110,66,255,0.55), rgba(236,72,153,0.55), rgba(245,158,11,0.55))' }}>
            <div className="relative bg-white rounded-[22px] p-7 sm:p-10 overflow-hidden">
              <div className="grid sm:grid-cols-[auto_1fr] gap-5 sm:gap-7 items-start relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <HandHeart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold mb-3 border border-rose-100">
                    <Heart className="w-3 h-3" /> Need-Based Scholarships
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-[-0.02em] mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    A few seats reserved for <span className="bg-gradient-to-r from-brand-600 to-pink-600 bg-clip-text text-transparent">builders who need them</span>
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-5 text-[14px] sm:text-[15px]">
                    Cost should never be the reason a great idea goes unbuilt. If your situation calls for it, check the scholarship box on the registration form and tell us your story. We review every request personally and reply within a few days.
                  </p>
                  <Link href="/idea2mvp-2026/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"
                    style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
                    Apply with Scholarship Request <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-24 md:py-28 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(135deg, #0d1333 0%, #1a0d2e 50%, #070c1b 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-white/60 text-[11px] font-bold mb-5 border border-white/[0.08]">
            <Target className="w-3 h-3 text-brand-300" /> Cohorts fill on a first-come basis
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Stop dreaming. <span className="bg-gradient-to-r from-brand-300 to-pink-300 bg-clip-text text-transparent">Start shipping.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-white/55 text-base sm:text-lg mb-9 max-w-xl mx-auto">
            $350 all-in · 10 weeks + Capstone · 30% off already applied · Scholarships available.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <Link href="/idea2mvp-2026/register"
              className="group relative inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-[15px] font-extrabold text-white overflow-hidden shadow-[0_8px_32px_rgba(110,66,255,0.45)] hover:shadow-[0_16px_50px_rgba(110,66,255,0.7)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <Rocket className="w-5 h-5 relative" /> <span className="relative">Reserve Your Seat</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <p className="text-white/35 text-xs mt-6">
            <Clock className="inline w-3 h-3 mr-1 -mt-0.5" /> Under 2 minutes to register · We email cohort details within 48 hours
          </p>
        </div>
      </section>
    </div>
  );
}
