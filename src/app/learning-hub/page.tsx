'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Code2, Users, Clock, Award, CheckCircle2,
  ArrowRight, Star, Sparkles, ChevronRight, Brain,
  Monitor, UserCheck, CalendarDays, Zap, Cpu, Layers,
  Rocket, Trophy, Target, Play, Palette, Wand2, GraduationCap, Briefcase
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import FreeTrialForm, { FreeTrialModal } from '@/components/FreeTrialForm';
import { CourseStack } from '@/components/TechLogos';

const levels = [
  {
    id: 1, name: 'Explorer', age: 'Beginner · Ages 5+',
    color: 'from-teal-400 to-emerald-500',
    tag: 'Visual Coding',
    tools: ['Scratch 3.0', 'code.org Blockly', 'MIT Scratch Jr', 'Tynker'],
    skills: ['Logical thinking & sequencing', 'Problem decomposition with loops & conditionals', 'Creative storytelling through code', 'Intro to computational thinking'],
    projects: 'Interactive stories, animated games, logic puzzles',
    icon: Code2,
  },
  {
    id: 2, name: 'Builder', age: 'Intermediate · Ages 10+',
    color: 'from-brand-400 to-blue-500',
    tag: 'Apps & Web Basics',
    tools: ['MIT App Inventor', 'Makeblock mBlock', 'Python 3', 'HTML & CSS'],
    skills: ['Build real mobile apps (App Inventor)', 'Python fundamentals & algorithmic thinking', 'Web development: HTML, CSS layout', 'Hardware projects with Micro:bit'],
    projects: 'Android apps, personal websites, Python scripts',
    icon: Code2,
  },
  {
    id: 3, name: 'Creator', age: 'Advanced · Ages 13+',
    color: 'from-violet-400 to-purple-600',
    tag: 'JavaScript · React · No-Code · AI Content Design',
    tools: ['JavaScript ES6+', 'React.js', 'Node.js', 'GitHub', 'Webflow', 'Bubble', 'Framer', 'Figma', 'Midjourney', 'Canva Magic', 'ChatGPT', 'ElevenLabs'],
    skills: [
      'Full-stack web dev with React, state & hooks',
      'No-code pathways: build apps with Bubble, Webflow & Framer',
      'AI content design: image, video, voice & copy with generative tools',
      'API design, automation with Zapier & Make',
      'Version control, GitHub & collaborative coding',
    ],
    projects: 'Interactive web apps, no-code SaaS MVPs, AI-generated brand kits & content studios',
    icon: Code2,
  },
  {
    id: 4, name: 'AI Developer', age: 'Advanced · Ages 14+',
    color: 'from-pink-500 to-rose-500',
    tag: 'ML · GPT · Vision',
    tools: ['Python (NumPy, Pandas)', 'OpenAI GPT APIs', 'Google Teachable Machine', 'OpenCV', 'Jupyter Notebooks'],
    skills: ['Machine learning & model training', 'Prompt engineering & LLM integration', 'Computer vision & image recognition', 'AI product design & deployment'],
    projects: 'AI chatbots, image classifiers, GPT-powered apps',
    icon: Brain,
    isNew: true,
  },
  {
    id: 5, name: 'Product Builder', age: 'Expert · Ages 16+',
    color: 'from-emerald-500 to-teal-600',
    tag: 'SaaS · MVP · Launch',
    tools: ['Next.js', 'Supabase / PostgreSQL', 'Stripe API', 'Vercel', 'Figma'],
    skills: ['SaaS architecture & full-stack development', 'MVP methodology & sprint planning', 'User acquisition & growth strategy', 'Pitch decks, demo days & fundraising'],
    projects: 'Fully launched SaaS products with real users',
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
  { q: 'What age can my child start?', a: 'We welcome learners from age 5. However, our levels are competency-based, not age-based — a talented 10-year-old can be in the Creator level if they demonstrate the skills. Every learner is assessed first to determine the best starting level — this is always free.' },
  { q: 'Do you offer payment plans?', a: 'Yes! We offer monthly subscriptions, term-based packages, and installment plans in USD. Scholarship and need-based discounts are available for qualifying learners globally.' },
  { q: 'Are classes online or physical?', a: 'Both! We offer fully online sessions via Zoom, and in-person classes at partner locations. We are online-first with a global reach — students from 20+ countries are enrolled.' },
  { q: 'What do students actually build?', a: 'Real projects — websites, apps, AI tools, and SaaS products. Every level ends with portfolio-ready work. AI Builder students have deployed AI apps; Product Builder students have launched live products.' },
  { q: 'What makes your AI tracks different?', a: 'We don\'t just teach theory — learners build actual AI-powered products. From chatbots to computer vision apps to GPT-integrated tools. Our curriculum is updated quarterly to match industry reality.' },
  { q: 'How qualified are the tutors?', a: 'All tutors are vetted professionals — software engineers, AI practitioners, or career educators with deep domain expertise. Many work in top tech companies and teach part-time with genuine passion for youth development.' },
];

export default function LearningHubPage() {
  const [trialOpen, setTrialOpen] = useState(false);
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        {/* Animated grid bg */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {/* Ambient glow orbs */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 65%)' }} />
        <div className="absolute top-[50%] right-[30%] w-[300px] h-[300px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
        {/* Horizon glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.4) 30%, rgba(168,85,247,0.5) 50%, rgba(236,72,153,0.4) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-14 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/25 text-brand-300 text-[13px] font-semibold mb-6">
                <BookOpen className="w-3.5 h-3.5" /> Learning Hub · Competency-Based · Project-Driven · AI-Ready
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-[2rem] sm:text-3xl md:text-4xl lg:text-[4rem] font-extrabold text-white leading-[1.15] tracking-[-0.03em] mb-6"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Code. Build AI.
                <br />
                <span className="gradient-text-animated">Launch Products.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-white/45 text-[1.05rem] leading-[1.75] mb-8 max-w-[480px]">
                Coding and AI are the 4th literacy — and the ultimate life skill. Our competency-based levels build critical thinking, problem-solving, and creativity through real projects. Students advance by demonstrated skill, not age, and are prepared for international coding competitions.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3.5 mb-10">
                <button onClick={() => setTrialOpen(true)} className="btn-primary text-[15px] px-7 py-3.5">
                  Book FREE Assessment <ArrowRight className="w-5 h-5" />
                </button>
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

      {/* ── What We Teach (full curriculum) ── */}
      <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-10 sm:mb-14">
            <div className="section-tag mx-auto mb-5">
              <Layers className="w-3.5 h-3.5" /> What We Teach
            </div>
            <h2 className="section-heading mb-4">From <span className="gradient-text">First Click</span> to <span className="gradient-text">Production Code</span></h2>
            <p className="section-subheading mx-auto">
              Block coding for the youngest learners — and a real curriculum stack for everything beyond:
              web, mobile, desktop, and AI.
            </p>
          </SectionWrapper>

          <CourseStack theme="light" />

          {/* Specialized-request callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 sm:mt-12 rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-br from-brand-50/60 via-white to-purple-50/40 p-5 sm:p-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-brand-700 text-[11px] font-bold mb-3 border border-brand-100">
              <Sparkles className="w-3 h-3" /> Don&apos;t see what you need?
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              We accept specialized requests
            </h3>
            <p className="text-slate-500 text-[13.5px] max-w-xl mx-auto leading-relaxed mb-4">
              From robotics curriculum design to a custom AI track for a research lab — if your learner has a specific tool, language or outcome in mind, we&apos;ll build the path with you.
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:gap-2.5 transition-all">
              Tell us what you need <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
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

      {/* ── No-Code & AI Content Design Pathways ── */}
      <section id="no-code" className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5"
              style={{ background: 'rgba(236,72,153,0.08)', color: '#db2777', borderColor: 'rgba(236,72,153,0.2)' }}>
              <Wand2 className="w-3.5 h-3.5" /> No-Code & AI Creator Pathways
            </div>
            <h2 className="section-heading mb-5">
              Build Without Writing Code. <span className="gradient-text">Create With AI.</span>
            </h2>
            <p className="section-subheading mx-auto">
              At Level 3 Creator and beyond, learners can specialize into no-code product building and AI content design — launching apps, brands, and creative studios without a single line of code when they choose.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Layers, title: 'No-Code App Building',
                desc: 'Design and ship real apps, dashboards, and marketplaces with Bubble, Webflow, Framer, Glide and Softr.',
                tools: ['Bubble', 'Webflow', 'Framer', 'Glide', 'Softr', 'Airtable'],
                outcome: 'Launch a no-code SaaS MVP',
                gradient: 'from-brand-500 to-purple-600',
              },
              {
                icon: Palette, title: 'AI Content Design',
                desc: 'Create scroll-stopping visuals, videos, voiceovers and brand kits with generative AI — like a one-person studio.',
                tools: ['Midjourney', 'Canva Magic', 'Runway', 'ElevenLabs', 'Adobe Firefly', 'Descript'],
                outcome: 'Ship a full AI-generated brand kit',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                icon: Wand2, title: 'AI Automation & Agents',
                desc: 'Automate real workflows and build AI agents with Zapier, Make, n8n and custom GPTs — no backend required.',
                tools: ['Zapier', 'Make', 'n8n', 'Custom GPTs', 'Claude Projects', 'Lindy AI'],
                outcome: 'Deploy a live AI agent that saves 10+ hours/week',
                gradient: 'from-emerald-500 to-teal-600',
              },
            ].map(({ icon: Icon, title, desc, tools, outcome, gradient }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tools.map((t) => (
                    <span key={t} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-gradient-to-r ${gradient} opacity-80`}>{t}</span>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-100 text-[12px] text-slate-500">
                  <span className="font-bold text-slate-700">Track outcome: </span>{outcome}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Power Highlights: Competitions · Scholarships · Careers ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Trophy className="w-3.5 h-3.5" /> Beyond the Classroom
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              Competitions. <span className="gradient-text">Scholarships.</span> Careers.
            </h2>
            <p className="section-subheading mx-auto">
              Our learners don&apos;t just finish a course — they compete globally, win scholarships, and launch careers before their peers even graduate.
            </p>
          </SectionWrapper>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy, title: 'International Coding Competitions',
                stat: '12+ wins', desc: 'Train for Codeforces, Scratch Global Olympiad, Technovation, AI4ALL, FIRST Robotics, and national hackathons. Students leave with medals, certificates and confidence.',
                gradient: 'from-amber-400 to-orange-500',
              },
              {
                icon: GraduationCap, title: 'Scholarship-Ready Portfolios',
                stat: 'Application-ready', desc: 'Portfolios packed with shipped projects, competition results and mentor recommendations — exactly what admissions officers and scholarship committees want to see.',
                gradient: 'from-emerald-500 to-teal-600',
              },
              {
                icon: Briefcase, title: 'Career & Internship Launchpad',
                stat: '50+ partners', desc: 'Industry mentors from Google, Microsoft, Stripe and Meta. Portfolio reviews, mock interviews, internship pipelines and real-world launch experience before university.',
                gradient: 'from-brand-500 to-purple-600',
              },
            ].map(({ icon: Icon, title, stat, desc, gradient }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient}`} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1">{stat}</div>
                <h3 className="font-bold text-slate-900 mb-2.5 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Free Trial / Assessment Form ── */}
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
                Schedule Your <span className="gradient-text-animated">FREE</span> Assessment Class
              </h2>
              <p className="text-white/55 text-[1.05rem] leading-[1.75] mb-7 max-w-[520px]">
                A private, no-obligation session with a certified mentor. We&apos;ll evaluate your child&apos;s skills, map the perfect Coders Ladder level, and answer every question.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Personalized skill assessment & pathway',
                  'Preview coding, no-code & AI tracks live',
                  'Competition & scholarship roadmap',
                  'Meet a world-class mentor — on us',
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
                <Users className="w-3.5 h-3.5" /> Teachers Who Actually Teach
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Patient. Experienced. <span className="gradient-text-animated">Genuinely Invested.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-7">
                Our instructors have spent years in classrooms — not just behind a screen. They know how
                to break down hard ideas, manage a live cohort, and meet a child where they are. The
                approach is simple: <span className="text-white/85 font-semibold">&ldquo;let&apos;s work on it together&rdquo;</span> — every week, every project.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: 'Years', label: 'Of coding instruction experience' },
                  { stat: 'Live', label: 'Real classroom management' },
                  { stat: '1:1', label: 'Time when learners need it' },
                  { stat: 'Patient', label: 'Encouraging, never rushed' },
                ].map(({ stat, label }) => (
                  <div key={label} className="glass rounded-2xl p-4 border border-white/8">
                    <div className="text-white font-extrabold text-xl mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat}</div>
                    <div className="text-white/50 text-[12px]">{label}</div>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Award, title: 'Years in the classroom', desc: 'Multi-year track record teaching coding to children — not weekend hobbyists.', color: 'from-brand-500 to-purple-600' },
                  { icon: Users, title: 'Live cohort management', desc: 'Real practice running engaged, well-paced sessions with mixed-skill groups.', color: 'from-amber-400 to-orange-500' },
                  { icon: UserCheck, title: '&ldquo;Let&apos;s work on it together&rdquo;', desc: 'Side-by-side problem-solving — never lecturing past a stuck learner.', color: 'from-emerald-400 to-teal-600' },
                  { icon: Sparkles, title: 'Teachers who inspire', desc: 'Instructors who make children excited to come back to the next session.', color: 'from-pink-500 to-rose-600' },
                ].map(({ icon: Icon, title, desc, color }, i) => (
                  <motion.div key={title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-2xl p-4 border border-white/8 hover:border-white/20 transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-white font-bold text-[13px] mb-1" dangerouslySetInnerHTML={{ __html: title }} />
                    <div className="text-white/50 text-[11px] leading-relaxed">{desc}</div>
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
              <button onClick={() => setTrialOpen(true)} className="btn-primary text-[15px] px-8 py-4">
                Book FREE Assessment <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/pricing" className="btn-white text-[15px] px-8 py-4">
                View Pricing
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>

      <FreeTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </div>
  );
}
