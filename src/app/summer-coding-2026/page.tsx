'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sun, Code2, Sparkles, Trophy, Award, Calendar, Clock, Users,
  Rocket, Brain, GraduationCap, Star, CheckCircle2, ArrowRight,
  Globe, Zap, Target, Cpu, Lightbulb, BookOpen, Medal, Gift,
  Flame, ShieldCheck, Layers
} from 'lucide-react';

const TRACKS = [
  {
    id: 'logic-builders',
    name: 'Logic Builders',
    age: 'Ages 5+',
    tag: 'Beginner-Friendly',
    desc: 'Visual block-based coding with Scratch and MIT App Inventor. Young learners build their first interactive games, animations, stories, and simple mobile apps — no syntax required.',
    icon: Lightbulb,
    color: 'from-amber-400 via-orange-500 to-rose-500',
    chips: ['Scratch', 'MIT App Inventor', 'Games', 'Mobile apps'],
    outcomes: [
      'A working capstone game or mobile app they built themselves',
      'Strong computational-thinking foundation',
      'Confidence with sequencing, loops, events, and decisions',
    ],
  },
  {
    id: 'code-masters',
    name: 'Code Masters',
    age: 'Ages 9+',
    tag: 'Advanced Builders',
    desc: 'Advanced Scratch and advanced MIT App Inventor projects. Learners take their skills further — building richer games, multi-screen mobile apps, and original interactive projects with real logic.',
    icon: Cpu,
    color: 'from-brand-500 via-purple-600 to-pink-600',
    chips: ['Advanced Scratch', 'Advanced App Inventor', 'Games', 'Mobile apps'],
    outcomes: [
      'A capstone app or game they designed and built end-to-end',
      'Comfortable working with variables, lists, and procedures',
      'Confidence to keep building independently after the program',
    ],
  },
];

const BENEFITS = [
  { icon: Brain, title: 'Coding is the 4th literacy', desc: 'Reading, writing, math — and now code. Every modern career touches software, automation, or AI. Children who code early read the world differently.', color: 'from-brand-500 to-purple-600' },
  { icon: Zap, title: 'Sharper thinking, faster', desc: 'Coding teaches kids to break big problems into small ones, debug calmly, and persist. These are transferable life skills, not just tech skills.', color: 'from-amber-500 to-orange-500' },
  { icon: Trophy, title: 'A real project to show off', desc: 'Every learner walks away with their own app or game — built by them, on their device — to share with family, classmates, and teachers.', color: 'from-emerald-500 to-teal-600' },
  { icon: Globe, title: 'AI-ready future', desc: 'In an AI-shaped economy, the kids who can prompt, build, and ship will lead. Our curriculum bakes in AI literacy from week one — at age-appropriate depth.', color: 'from-pink-500 to-rose-500' },
  { icon: Users, title: 'Small cohorts, real mentors', desc: 'Tiny groups with vetted instructors — graduates of Google, Microsoft, Stripe and top universities. Every child is seen, every project is reviewed.', color: 'from-violet-500 to-indigo-600' },
  { icon: Medal, title: 'Awards & certificates', desc: 'Every learner earns a certificate. The top capstones win prizes — and a permanent spot in our 2026 Hall of Builders.', color: 'from-fuchsia-500 to-pink-600' },
];

const SCHEDULE = [
  { week: 'Wk 1', label: 'Foundations', desc: 'Get set up, tour the tools, first builds' },
  { week: 'Wk 2', label: 'Loops & Logic', desc: 'Conditionals, decisions, animations' },
  { week: 'Wk 3', label: 'Variables & Events', desc: 'Working with data, inputs, and interactions' },
  { week: 'Wk 4', label: 'Mini Projects', desc: 'Guided builds + peer feedback' },
  { week: 'Wk 5', label: 'Capstone Build', desc: 'Plan, design, and build your own app or game' },
  { week: 'Wk 6', label: 'Polish & Showcase', desc: 'Finishing touches · Demo Day · awards · certificate' },
];

const FAQ = [
  { q: 'When does the program start?', a: 'Monday, June 29, 2026. Sessions run twice a week throughout summer break — exact days will be confirmed at registration based on your time zone and cohort availability.' },
  { q: 'How is the price calculated for siblings?', a: '$245 per child after the standard 30% discount is already applied. When you register additional siblings, an extra 10% sibling discount stacks on the 2nd child, 15% on the 3rd, and you can apply a coupon code for further savings.' },
  { q: 'Will my child receive a certificate?', a: 'Yes — every learner who completes the capstone receives an official ScholarlyEcho Summer 2026 Certificate of Completion. Top capstones win prizes and a Hall of Builders feature.' },
  { q: 'Is this 100% online?', a: 'Yes. Live, instructor-led sessions on Zoom, twice a week. Recordings provided so no session is missed.' },
  { q: 'What does my child walk away with?', a: 'A real app or game they built themselves, a certificate of completion, and a stronger foundation in coding. Logic Builders graduates are ready to step up to Code Masters; Code Masters graduates are ready for our term-time programs to keep building.' },
];

export default function SummerCoding2026Page() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-28 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #1a0d2e 25%, #2a0d1f 50%, #1a0d2e 75%, #070c1b 100%)' }}>

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[8%] left-[8%] w-[520px] h-[520px] rounded-full opacity-[0.18]"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[5%] right-[8%] w-[460px] h-[460px] rounded-full opacity-[0.15]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[50%] left-[35%] w-[320px] h-[320px] rounded-full opacity-[0.1]"
            style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          {/* Stars */}
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-300/20 text-amber-200 text-[13px] mb-6 backdrop-blur-md">
            <Sun className="w-3.5 h-3.5 text-amber-300" /> Summer Coding Program 2026 · Starts June 29
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-[-0.035em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            The Summer Your Child <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">Becomes a Builder</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-9">
            Two age-tailored tracks. A capstone project — a real app or game your child builds themselves. A certificate to celebrate the work. <span className="text-white/80 font-semibold">Coding is the 4th literacy — give your child the head start.</span>
          </motion.p>

          {/* Pricing pill */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.28 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-md mb-8">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">30% OFF</span>
            <span className="text-white/40 line-through text-sm">$350</span>
            <span className="text-white text-2xl font-extrabold">$245</span>
            <span className="text-white/50 text-xs">per child · sibling discount stacks</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/summer-coding-2026/register"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-extrabold text-white overflow-hidden shadow-[0_8px_32px_rgba(245,158,11,0.45)] hover:shadow-[0_12px_44px_rgba(245,158,11,0.65)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)' }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <Rocket className="w-5 h-5 relative" /> <span className="relative">Register Now</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#tracks"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-white/15 text-white/85 font-semibold hover:bg-white/[0.06] transition-all">
              Explore the Tracks
            </a>
          </motion.div>

          {/* Stat row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto mt-14">
            {[
              { v: 'June 29', l: 'Starts 2026' },
              { v: '6 wks', l: '2× per week' },
              { v: '$245', l: 'After 30% off' },
              { v: '🏆 Prizes', l: 'For top capstones' },
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
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 30%, rgba(236,72,153,0.5) 50%, rgba(110,66,255,0.4) 70%, transparent 100%)' }} />
      </section>

      {/* ═══ TRACKS ═══ */}
      <section id="tracks" className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold mb-4 border border-amber-100">
              <Layers className="w-3 h-3" /> Two Age-Tailored Tracks
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Pick the Track That <span className="bg-gradient-to-r from-amber-500 to-pink-600 bg-clip-text text-transparent">Fits Your Child</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every learner ships a capstone. Every learner earns a certificate. Every learner walks out with momentum.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {TRACKS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group rounded-3xl p-[1.5px] overflow-hidden"
                  style={{ background: `linear-gradient(135deg, rgba(245,158,11,0.4), rgba(236,72,153,0.4), rgba(110,66,255,0.4))` }}>
                  <div className="relative bg-white rounded-[22px] p-7 sm:p-8 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{t.tag}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{t.age}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-[-0.02em]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {t.name}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-5 text-[14px]">{t.desc}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {t.chips.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">{c}</span>
                      ))}
                    </div>

                    <div className="space-y-2 mb-6">
                      {t.outcomes.map((o) => (
                        <div key={o} className="flex items-start gap-2 text-[13px] text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/summer-coding-2026/register?track=${t.id}`}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${t.color} shadow-md group-hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}>
                      Register for {t.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHY CODING ═══ */}
      <section className="py-16 sm:py-20 md:py-28 mesh-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold mb-4 border border-brand-100">
              <BookOpen className="w-3 h-3" /> Why Coding · The 4th Literacy
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-4 max-w-3xl mx-auto"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Reading. Writing. Math. <span className="bg-gradient-to-r from-brand-600 to-pink-600 bg-clip-text text-transparent">Now Code.</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              In an AI-shaped world, code is no longer optional — it&apos;s how children translate ideas into reality and stay relevant for the careers of 2035.
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
            {[
              { icon: Calendar, t: '2× a week sessions', d: 'Live, instructor-led, recorded for replay' },
              { icon: Trophy, t: 'Capstone project', d: 'A real, shippable build by Demo Day' },
              { icon: Award, t: 'Official certificate', d: 'Issued by ScholarlyEcho on completion' },
              { icon: Medal, t: 'Prizes for top builds', d: 'Cash, gear, and Hall-of-Builders feature' },
              { icon: Users, t: 'Small cohorts', d: 'Personal attention, real mentor feedback' },
              { icon: ShieldCheck, t: 'Safe & monitored', d: 'Background-checked instructors, parent updates' },
              { icon: Star, t: 'A project to show off', d: 'A real app or game your child built themselves' },
              { icon: Flame, t: 'Onramp to next steps', d: 'Logic Builders → Code Masters → term programs' },
            ].map(({ icon: Icon, t, d }, i) => (
              <motion.div key={t}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-slate-50/80 border border-slate-100 p-5 hover:border-amber-200 hover:bg-white hover:shadow-md transition-all duration-300">
                <Icon className="w-5 h-5 text-amber-500 mb-3" />
                <h4 className="font-bold text-slate-900 text-[14px] mb-1">{t}</h4>
                <p className="text-slate-500 text-[12px] leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold mb-4 border border-purple-100">
              <Calendar className="w-3 h-3" /> 6-Week Roadmap
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-[-0.03em] mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              From <span className="text-amber-500">First Line of Code</span> to <span className="text-pink-600">Demo Day</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">Twice a week. Live. With a real mentor.</p>
          </motion.div>

          <div className="relative">
            {/* spine line */}
            <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-amber-300 via-pink-400 to-brand-500 rounded-full" />
            <div className="space-y-4">
              {SCHEDULE.map((s, i) => (
                <motion.div key={s.week}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative flex items-center gap-4 sm:gap-5 pl-1">
                  <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-[11px] sm:text-xs shadow-lg flex-shrink-0">
                    {s.week}
                  </div>
                  <div className="flex-1 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all p-4 sm:p-5">
                    <h4 className="font-bold text-slate-900 text-[14px] sm:text-[15px] mb-0.5">{s.label}</h4>
                    <p className="text-slate-500 text-[12px] sm:text-[13px]">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
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
              Parent Questions, Answered
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
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-slate-500 text-[13px] sm:text-[14px] leading-relaxed">{f.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-24 md:py-28 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(135deg, #1a0d2e 0%, #2a0d1f 50%, #0d1333 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-white/60 text-[11px] font-bold mb-5 border border-white/[0.08]">
            <Target className="w-3 h-3 text-amber-300" /> Cohorts fill on a first-come basis
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Reserve Your Child&apos;s Seat for <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">Summer 2026</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-white/55 text-base sm:text-lg mb-9 max-w-xl mx-auto">
            $245 per child · 30% off already applied · Sibling discount stacks · Coupons accepted at checkout.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <Link href="/summer-coding-2026/register"
              className="group relative inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-[15px] font-extrabold text-white overflow-hidden shadow-[0_8px_32px_rgba(245,158,11,0.45)] hover:shadow-[0_16px_50px_rgba(245,158,11,0.7)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)' }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <Rocket className="w-5 h-5 relative" /> <span className="relative">Register Your Child</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <p className="text-white/35 text-xs mt-6">
            <Clock className="inline w-3 h-3 mr-1 -mt-0.5" /> Less than 2 minutes to register · Sibling pricing computed live
          </p>
        </div>
      </section>
    </div>
  );
}
