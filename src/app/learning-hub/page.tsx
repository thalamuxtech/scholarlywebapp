'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Code2, Users, Clock, Award, CheckCircle2,
  ArrowRight, Star, Sparkles, ChevronRight, Brain,
  Monitor, UserCheck, CalendarDays, Zap, Cpu, Layers,
  Rocket, Globe, Trophy, Target, Play
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const levels = [
  {
    id: 1, name: 'Explorer', age: 'Ages 7–10',
    color: 'from-teal-400 to-emerald-500',
    tag: 'Visual Coding',
    tools: ['Scratch 3.0', 'code.org Blockly', 'MIT Scratch Jr', 'Tynker'],
    skills: ['Drag-and-drop logic & sequencing', 'Loops, events & conditionals', 'Interactive story creation', 'Basic game design'],
    projects: 'Interactive stories, animated games, logic puzzles',
    icon: Code2,
  },
  {
    id: 2, name: 'Builder', age: 'Ages 10–13',
    color: 'from-brand-400 to-blue-500',
    tag: 'Apps & Web Basics',
    tools: ['MIT App Inventor', 'Makeblock mBlock', 'Python 3', 'HTML & CSS'],
    skills: ['Build real mobile apps (no native code)', 'Python fundamentals & scripting', 'Intro to web: HTML, CSS layout', 'Micro:bit & basic hardware projects'],
    projects: 'Android apps, personal websites, beginner Python scripts',
    icon: Code2,
  },
  {
    id: 3, name: 'Creator', age: 'Ages 13–16',
    color: 'from-violet-400 to-purple-600',
    tag: 'JavaScript & React',
    tools: ['JavaScript ES6+', 'React.js', 'Node.js basics', 'GitHub', 'VS Code'],
    skills: ['DOM manipulation & event-driven programming', 'React components, state & hooks', 'REST API consumption', 'Version control with Git & GitHub'],
    projects: 'Interactive web apps, portfolios, browser games, API dashboards',
    icon: Code2,
  },
  {
    id: 4, name: 'AI Developer', age: 'Ages 14+',
    color: 'from-pink-500 to-rose-500',
    tag: 'ML · GPT · Vision',
    tools: ['Python (NumPy, Pandas)', 'OpenAI GPT APIs', 'Google Teachable Machine', 'OpenCV', 'Jupyter Notebooks'],
    skills: ['Machine learning concepts & model training', 'Prompt engineering & LLM integration', 'Computer vision & image recognition', 'NLP projects & AI product design'],
    projects: 'AI chatbots, image classifiers, GPT-powered web apps',
    icon: Brain,
    isNew: true,
  },
  {
    id: 5, name: 'Product Builder', age: 'Ages 16+',
    color: 'from-emerald-500 to-teal-600',
    tag: 'SaaS · MVP · Launch',
    tools: ['Next.js', 'Supabase / PostgreSQL', 'Stripe API', 'Vercel', 'Figma'],
    skills: ['SaaS architecture & full-stack development', 'MVP methodology & sprint planning', 'User acquisition & growth basics', 'Pitch decks, demo days & fundraising'],
    projects: 'Fully launched SaaS products with real users and revenue',
    icon: Rocket,
    isNew: true,
  },
];

const formats = [
  { icon: UserCheck, title: '1-on-1 Coaching', desc: 'Fully personalized pacing with a dedicated tutor. Best for learners who thrive with individual attention and custom goals.', badge: 'Most flexible', color: 'from-brand-500 to-purple-600' },
  { icon: Users, title: 'Group Classes', desc: 'Collaborative learning in cohorts of 5–8. Builds teamwork, communication, and peer accountability alongside technical skills.', badge: 'Most popular', color: 'from-amber-400 to-orange-500' },
  { icon: Zap, title: 'Intensive Bootcamp', desc: '10-day immersive sprints during school breaks. Maximum skill-building in minimum time — ideal for fast-tracking a level.', badge: 'Fast-track', color: 'from-emerald-400 to-teal-600' },
  { icon: CalendarDays, title: 'Holiday Programs', desc: 'Structured programs engineered around school schedules. Perfect timing for a deep dive without disrupting academic work.', badge: 'School-aligned', color: 'from-pink-500 to-rose-600' },
];

const faqs = [
  { q: 'What age can my child start?', a: 'We welcome learners from age 7 (Explorer level — Scratch & visual coding) all the way to young adults and university students. Every learner is assessed first to determine the best starting level — this is always free.' },
  { q: 'Do you offer payment plans?', a: 'Yes! We offer monthly subscriptions, term-based packages, and installment plans in USD. Scholarship and need-based discounts are available for qualifying learners globally.' },
  { q: 'Are classes online or physical?', a: 'Both! We offer fully online sessions via Zoom, and in-person classes at partner locations. We are online-first with a global reach — students from 20+ countries are enrolled.' },
  { q: 'What do students actually build?', a: 'Real projects — websites, apps, AI tools, and SaaS products. Every level ends with portfolio-ready work. AI Builder students have deployed AI apps; Product Builder students have launched live products.' },
  { q: 'What makes your AI tracks different?', a: 'We don\'t just teach theory — learners build actual AI-powered products. From chatbots to computer vision apps to GPT-integrated tools. Our curriculum is updated quarterly to match industry reality.' },
  { q: 'How qualified are the tutors?', a: 'All tutors are vetted professionals — software engineers, AI practitioners, or career educators with deep domain expertise. Many work in top tech companies and teach part-time with genuine passion for youth development.' },
];

export default function LearningHubPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        {/* Animated grid bg */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-14 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/25 text-brand-300 text-[13px] font-semibold mb-6">
                <BookOpen className="w-3.5 h-3.5" /> Learning Hub · 5 Levels · AI-Ready
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-[2rem] sm:text-3xl md:text-4xl lg:text-[4rem] font-extrabold text-white leading-[1.04] tracking-[-0.03em] mb-6"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Code. Build AI.
                <br />
                <span className="gradient-text-animated">Launch Products.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-white/45 text-[1.05rem] leading-[1.75] mb-8 max-w-[480px]">
                Five structured levels — from Scratch & MIT App Inventor to building AI-powered products and launching real SaaS startups.
                World-class curriculum. Global mentors. Real outcomes.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3.5 mb-10">
                <Link href="/contact" className="btn-primary text-[15px] px-7 py-3.5">
                  Enroll Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/18 text-white font-semibold hover:bg-white/10 transition-all text-[15px]">
                  View Pricing
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
                className="grid grid-cols-3 gap-4">
                {[
                  { n: 500, s: '+', l: 'Enrolled' },
                  { n: 98, s: '%', l: 'Completion' },
                  { n: 20, s: '+', l: 'Countries' },
                ].map(({ n, s, l }) => (
                  <div key={l} className="glass rounded-2xl p-4 text-center border border-white/8">
                    <div className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <AnimatedCounter end={n} suffix={s} />
                    </div>
                    <div className="text-white/45 text-[11px] mt-0.5 font-medium">{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: level scroll */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block">
              <div className="glass rounded-3xl p-7 border border-white/8 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">The Coders Ladder</div>
                    <div className="text-white/45 text-xs">5 levels · AI + coding + product</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {levels.map((level, i) => (
                    <motion.div key={level.name}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <level.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-[13px]">{level.name}</span>
                          {level.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white">NEW</span>
                          )}
                        </div>
                        <div className="text-white/40 text-[11px]">{level.age} · {level.tag}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Coders Ladder (visual) ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-16">
            <div className="section-tag mx-auto mb-5">
              <Sparkles className="w-3.5 h-3.5" /> The Coders Ladder
            </div>
            <h2 className="section-heading mb-5">5 Levels. One Clear Path.</h2>
            <p className="section-subheading mx-auto">
              From Scratch & MIT App Inventor to AI-powered products and live SaaS launches — every learner has a defined, progressive path forward.
            </p>
          </SectionWrapper>

          {/* AI & Product highlight banner */}
          <div className="mb-12 rounded-3xl p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4a1de0 0%, #7c3aed 50%, #a855f7 100%)' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-3">
                  ✨ NEW IN 2026 — Levels 4 & 5
                </div>
                <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  AI Developer & Product Builder Tracks
                </h3>
                <p className="text-white/70 text-sm max-w-lg leading-relaxed">
                  Two powerful advanced levels for the AI era: <strong className="text-white">AI Developer</strong> (GPT APIs, OpenCV, ML with Jupyter & Teachable Machine) and
                  <strong className="text-white"> Product Builder</strong> (launch real SaaS with Next.js, Supabase & Stripe).
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {[{ icon: Brain, label: 'AI Developer' }, { icon: Rocket, label: 'Product Builder' }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                    <span className="text-white/80 text-[10px] font-semibold text-center leading-tight max-w-[70px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Level grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {levels.map((level, i) => (
              <motion.div key={level.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card relative overflow-hidden group hover:border-transparent hover:shadow-xl transition-all duration-300">
                {level.isNew && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    NEW
                  </div>
                )}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[11px] font-bold bg-gradient-to-r ${level.color} mb-4 shadow-sm`}>
                  Level {level.id} — {level.name}
                </div>
                <div className="text-slate-500 text-[12px] font-semibold mb-0.5">{level.age}</div>
                <div className="text-slate-400 text-[11px] mb-3 font-medium">{level.tag}</div>

                {/* Tools row */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(level as any).tools?.map((tool: string) => (
                    <span key={tool} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-to-r ${level.color} text-white opacity-80`}>
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="space-y-1.5 mb-4">
                  {level.skills.map((skill) => (
                    <div key={skill} className="flex items-start gap-2 text-[12px] text-slate-600">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${level.color} flex-shrink-0 mt-1.5`} />
                      {skill}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600">Builds: </span>{level.projects}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Tracks Deep Dive ── */}
      <section id="ai-tracks" className="py-16 sm:py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-16">
            <div className="section-tag mx-auto mb-5"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', borderColor: 'rgba(139,92,246,0.2)' }}>
              <Brain className="w-3.5 h-3.5" /> AI & Product Tracks
            </div>
            <h2 className="section-heading mb-5">Built for the AI Era</h2>
            <p className="section-subheading mx-auto">
              Our two advanced tracks prepare learners not just to use AI — but to build with it, and launch real products around it.
            </p>
          </SectionWrapper>

          <div className="space-y-8">
            {[
              {
                level: 4, name: 'AI Developer', age: 'Ages 14+', color: 'from-pink-500 to-rose-600',
                icon: Brain,
                tools: ['Python', 'OpenAI API', 'Google Teachable Machine', 'OpenCV', 'Jupyter Notebooks'],
                desc: 'The AI era track. Learners understand how machine learning works, train models with Teachable Machine, build AI apps using GPT APIs, work with computer vision via OpenCV, and design AI-powered products that solve real community problems.',
                modules: ['Python for Data Science (NumPy, Pandas)', 'ML concepts & model training with Teachable Machine', 'GPT-4o & LLM API integration', 'Computer Vision with OpenCV', 'Prompt Engineering & AI Product Design'],
                outcome: 'Build and deploy 2 AI-powered applications with live users',
              },
              {
                level: 5, name: 'Product Builder', age: 'Ages 16+', color: 'from-emerald-500 to-teal-600',
                icon: Rocket,
                tools: ['Next.js', 'Supabase', 'Stripe', 'Vercel', 'Figma'],
                desc: 'The capstone track. Learners go from idea to a fully launched product — designing with Figma, building full-stack with Next.js + Supabase, integrating payments with Stripe, deploying on Vercel, acquiring users, and pitching to mentors and potential investors.',
                modules: ['Full-Stack with Next.js + Supabase + PostgreSQL', 'UI design with Figma · payments with Stripe', 'MVP Development Sprints & agile workflow', 'Growth, user acquisition & product analytics', 'Pitch Deck, Demo Day & fundraising basics'],
                outcome: 'Launch a live SaaS product with real users and revenue potential',
              },
            ].map(({ level, name, age, color, icon: Icon, desc, modules, outcome, tools }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card overflow-hidden">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-[12px] font-bold bg-gradient-to-r ${color} mb-4`}>
                      <Icon className="w-4 h-4" /> Level {level} — {name}
                    </div>
                    <div className="text-slate-400 text-[12px] font-medium mb-3">{age}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tools.map((t) => (
                        <span key={t} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-gradient-to-r ${color} opacity-75`}>{t}</span>
                      ))}
                    </div>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Curriculum Modules</div>
                    <ul className="space-y-2">
                      {modules.map((m) => (
                        <li key={m} className="flex items-center gap-2.5 text-[13px] text-slate-700">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${color} relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent)' }} />
                      <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-2 relative">Track Outcome</div>
                      <div className="text-white font-bold text-[13px] leading-snug relative">{outcome}</div>
                    </div>
                    <Link href="/contact"
                      className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:border-brand-400 hover:text-brand-600 transition-all duration-200">
                      Enroll in this Track <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery Formats ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Monitor className="w-3.5 h-3.5" /> How We Deliver
            </div>
            <h2 className="section-heading mb-5">Your Schedule. Your Format.</h2>
            <p className="section-subheading mx-auto">
              Online-first, globally accessible, with flexible formats that fit any lifestyle.
            </p>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map(({ icon: Icon, title, desc, badge, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card text-center group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[11px] font-bold mb-3">{badge}</span>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Mentors ── */}
      <section className="py-12 sm:py-16 md:py-20 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 50%, #0c1a2e 100%)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <SectionWrapper>
              <div className="section-tag mb-5" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <Globe className="w-3.5 h-3.5" /> Global Tutor Network
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Mentored by Practitioners, Not Just Teachers
              </h2>
              <p className="text-white/60 leading-relaxed mb-7">
                Every tutor at ScholarlyEcho is a working professional — software engineers at top companies,
                AI researchers, startup founders, and educational technologists from across the world.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: '50+', label: 'Expert tutors globally' },
                  { stat: '15+', label: 'Countries represented' },
                  { stat: '4.9/5', label: 'Average tutor rating' },
                  { stat: '100%', label: 'Industry-vetted' },
                ].map(({ stat, label }) => (
                  <div key={label} className="glass rounded-2xl p-4 border border-white/8">
                    <div className="text-white font-extrabold text-xl mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat}</div>
                    <div className="text-white/50 text-[12px]">{label}</div>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { init: 'AK', role: 'AI Engineer', company: 'Google DeepMind', color: 'from-brand-500 to-purple-600' },
                  { init: 'RT', role: 'Full-Stack Dev', company: 'Stripe', color: 'from-amber-400 to-orange-500' },
                  { init: 'FM', role: 'ML Engineer', company: 'Microsoft', color: 'from-emerald-400 to-teal-600' },
                  { init: 'NO', role: 'Startup Founder', company: 'YC Alum', color: 'from-pink-500 to-rose-600' },
                  { init: 'JA', role: 'Product Designer', company: 'Figma', color: 'from-cyan-400 to-blue-500' },
                  { init: 'SA', role: 'Data Scientist', company: 'Meta', color: 'from-violet-500 to-purple-700' },
                ].map(({ init, role, company, color }, i) => (
                  <motion.div key={init}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-4 text-center border border-white/8 hover:border-white/20 transition-colors">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm mx-auto mb-2`}>
                      {init}
                    </div>
                    <div className="text-white font-semibold text-[11px]">{role}</div>
                    <div className="text-white/40 text-[10px]">{company}</div>
                  </motion.div>
                ))}
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ── Student Project Gallery ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Star className="w-3.5 h-3.5" /> Student Wins
            </div>
            <h2 className="section-heading mb-4">Real Projects. Real Pride.</h2>
          </SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'AI Plant Doctor', student: 'Kemi O., 16', level: 'AI Builder', color: 'from-emerald-400 to-teal-500', country: '🇳🇬' },
              { title: 'Study Buddy App', student: 'Amara D., 14', level: 'Creator', color: 'from-brand-400 to-purple-500', country: '🇸🇳' },
              { title: 'Farm Price Predictor', student: 'Fatima G., 17', level: 'AI Foundations', color: 'from-purple-500 to-indigo-600', country: '🇰🇪' },
              { title: 'SchoolSync SaaS', student: 'David M., 18', level: 'Product Builder', color: 'from-amber-400 to-orange-500', country: '🇬🇭' },
              { title: 'Animated Story', student: 'Joy A., 8', level: 'Explorer', color: 'from-teal-400 to-cyan-500', country: '🇳🇬' },
              { title: 'GPT Tutor Bot', student: 'Aisha B., 16', level: 'AI Builder', color: 'from-pink-400 to-rose-500', country: '🇿🇦' },
              { title: 'E-Commerce MVP', student: 'Rachel T., 19', level: 'Product Builder', color: 'from-violet-400 to-purple-600', country: '🇺🇸' },
              { title: 'Community App', student: 'Kwame A., 15', level: 'Creator', color: 'from-blue-400 to-brand-500', country: '🇬🇭' },
            ].map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl bg-gradient-to-br ${p.color} p-5 group cursor-pointer hover:scale-105 transition-transform duration-300`}>
                <div className="text-white/40 text-[10px] font-semibold mb-2">{p.level}</div>
                <div className="text-white font-bold text-sm mb-1">{p.title}</div>
                <div className="text-white/65 text-[11px] flex items-center gap-1">
                  {p.country} {p.student}
                </div>
                <div className="mt-4 flex items-center gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-white/60 fill-white/60" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <h2 className="section-heading mb-4">Frequently Asked</h2>
          </SectionWrapper>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <motion.details key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group cursor-pointer open:ring-2 open:ring-brand-200">
                <summary className="flex items-center justify-between font-semibold text-slate-800 cursor-pointer list-none select-none text-[15px]">
                  {q}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform duration-200 flex-shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-slate-500 text-[13px] leading-relaxed border-t border-slate-100 pt-3">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 md:py-28 text-center relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(110,66,255,0.2) 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <SectionWrapper>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Your path starts here.
            </h2>
            <p className="text-white/55 text-base sm:text-lg mb-10 leading-relaxed">
              Free assessment. Clear pathway. Real mentors. Real outcomes. Join learners from 20+ countries.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
              <Link href="/contact" className="btn-primary text-[15px] px-8 py-4">
                Enroll Now — It's Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="btn-white text-[15px] px-8 py-4">
                View Pricing
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
