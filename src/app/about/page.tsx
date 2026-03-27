'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, BookOpen, Mic2, Gamepad2, Heart, Target, Globe,
  ArrowRight, Sparkles, Users, Star, Lightbulb, Brain,
  Rocket, TrendingUp, Building2, Award, MapPin
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const values = [
  { icon: Lightbulb, title: 'Knowledge-First', desc: 'Every program begins with a clear answer to "what will this learner know or be able to do differently?" before a single session is designed.', color: 'bg-brand-100 text-brand-600' },
  { icon: Users, title: 'Youth-Centered', desc: 'Our design, language, curriculum pace, and community are built around how young people actually think, learn, and grow.', color: 'bg-amber-100 text-amber-600' },
  { icon: Target, title: 'Practical Impact', desc: 'We measure success by projects built, skills demonstrated, and lives changed — not just course completions or certificates issued.', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Globe, title: 'Excellence for All', desc: 'Premium quality education that never gatekeeps. Geography, income, and background should never determine who gets access to world-class skills.', color: 'bg-purple-100 text-purple-600' },
  { icon: Heart, title: 'Community First', desc: 'Individual success is the entry point. The true goal is communities that rise together — informed by local context, connected to global opportunity.', color: 'bg-rose-100 text-rose-600' },
];

const team = [
  { role: 'Founder & CEO', initials: 'FO', color: 'from-brand-500 to-purple-600', desc: 'Youth educator, technologist, and community builder. 10+ years developing youth programs across Africa. Previously led digital programs at two major NGOs.', country: '🇳🇬 Nigerian-American' },
  { role: 'Head of Education', initials: 'AN', color: 'from-amber-400 to-orange-500', desc: 'Curriculum designer and ex-software engineer. Designed AI literacy programs now used in 30+ schools across West Africa. Yale education fellow.', country: '🇬🇭 Ghanaian' },
  { role: 'Head of Media', initials: 'TK', color: 'from-emerald-400 to-teal-500', desc: 'Award-winning journalist and podcast producer. Led content strategy at two top media companies. Host of the Edu Spotlight Podcast.', country: '🇰🇪 Kenyan-British' },
  { role: 'Chief Technology Officer', initials: 'RJ', color: 'from-blue-400 to-brand-500', desc: 'Full-stack engineer and AI practitioner. Former engineer at Google and two YC-backed startups. Passionate about using technology to democratize education.', country: '🇺🇸 American' },
  { role: 'Community Director', initials: 'AJ', color: 'from-pink-400 to-rose-500', desc: 'Community development specialist with a PhD in youth empowerment. Built community programs across 8 African countries reaching 50,000+ youth.', country: '🇿🇦 South African' },
  { role: 'Head of AI Curriculum', initials: 'SM', color: 'from-violet-400 to-purple-600', desc: 'AI researcher and educator. PhD in Machine Learning from CMU. Built Africa\'s first youth-focused AI curriculum. 200+ students trained in AI fundamentals.', country: '🇳🇬 Nigerian' },
];

const milestones = [
  { year: '2022', event: 'ScholarlyEcho founded with 10 students in Lagos', color: 'bg-teal-500' },
  { year: '2023', event: '100 students enrolled · Edu Spotlight Podcast launched', color: 'bg-brand-500' },
  { year: '2024', event: '500 students · 10 countries · Edutainment products launched', color: 'bg-amber-500' },
  { year: '2025', event: '1,000 students · Thesis Spotlight series · Maryland HQ opened', color: 'bg-purple-500' },
  { year: '2026', event: 'AI tracks launched · 20+ countries · Global Summit inaugural edition', color: 'bg-emerald-500' },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Our Story
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[2rem] sm:text-3xl md:text-4xl lg:text-[4.5rem] font-extrabold text-white leading-[1.04] tracking-[-0.03em] mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Born in Africa.
            <br />
            <span className="gradient-text-animated">Built for the World.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg max-w-2xl mx-auto leading-[1.75]">
            ScholarlyEcho started with a simple but urgent question: What would it look like if every young person —
            regardless of where they were born — had access to the skills, stories, and experiences to shape the future?
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Mission + Vision ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <SectionWrapper>
              <div className="section-tag mb-5">
                <Zap className="w-3.5 h-3.5" /> Mission & Vision
              </div>
              <h2 className="section-heading mb-6">A Disruption in Global Education</h2>
              <p className="text-slate-500 leading-relaxed mb-5 text-[15px]">
                Our mission is to equip youth worldwide with tools, exposure, confidence, and opportunities —
                moving them from confusion to clarity, from interest to competence, from learning to impact.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8 text-[15px]">
                We do this through three powerful branches that work together: the Learning Hub that builds skills
                from coding to AI to product entrepreneurship; Spotlight Media that inspires through real human stories;
                and Edutainment that makes learning feel like winning.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { n: 20, s: '+', l: 'Countries', color: 'gradient-text' },
                  { n: 1200, s: '+', l: 'Youth Trained', color: 'gradient-text-gold' },
                  { n: 50, s: '+', l: 'Partners', color: 'gradient-text-green' },
                ].map(({ n, s, l, color }) => (
                  <div key={l} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`text-2xl font-extrabold ${color} mb-0.5`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <AnimatedCounter end={n} suffix={s} />
                    </div>
                    <div className="text-slate-500 text-[11px] font-medium">{l}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                {[
                  { icon: BookOpen, label: 'Learn', color: 'bg-brand-100 text-brand-600' },
                  { icon: Mic2, label: 'Inspire', color: 'bg-amber-100 text-amber-600' },
                  { icon: Gamepad2, label: 'Engage', color: 'bg-emerald-100 text-emerald-600' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className={`flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-2xl ${color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <div className="rounded-3xl p-8 relative overflow-hidden noise-overlay"
                style={{ background: 'linear-gradient(165deg, #0d1333 0%, #13103a 50%, #0c1a2e 100%)' }}>
                <div className="absolute inset-0 opacity-25"
                  style={{ backgroundImage: 'radial-gradient(ellipse at 70% 30%, rgba(110,66,255,0.5) 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="text-white/40 text-[11px] uppercase tracking-[0.12em] font-bold mb-5">Our Vision</div>
                  <blockquote className="text-white text-xl leading-[1.6] font-semibold mb-7"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    "A generation of young people across Africa and the world who don't just use technology —
                    they build it, shape it, and use it to lift their communities."
                  </blockquote>

                  <div className="space-y-3">
                    {[
                      { icon: MapPin, text: 'Headquartered in Maryland, USA' },
                      { icon: Globe, text: 'Operations across Africa, Europe, Americas' },
                      { icon: Brain, text: 'AI-first curriculum for the modern era' },
                      { icon: Rocket, text: 'Youth founders and builders at the core' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-white/65 text-[13px]">
                        <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <SectionWrapper className="text-center mb-14">
            <h2 className="section-heading mb-4">Our Journey So Far</h2>
          </SectionWrapper>
          <div className="relative">
            <div className="absolute left-24 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-brand-400 to-emerald-400 hidden md:block" />
            <div className="space-y-8">
              {milestones.map(({ year, event, color }, i) => (
                <motion.div key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col md:flex-row items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white font-extrabold text-[13px] flex-shrink-0 z-10 shadow-lg`}>
                    {year}
                  </div>
                  <div className="premium-card flex-1">
                    <p className="text-slate-700 font-semibold text-[14px]">{event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Star className="w-3.5 h-3.5" /> Core Values
            </div>
            <h2 className="section-heading mb-5">What We Stand For</h2>
            <p className="section-subheading mx-auto">Five non-negotiable principles that guide every decision, program, and relationship.</p>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card text-center group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-[14px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Users className="w-3.5 h-3.5" /> Leadership Team
            </div>
            <h2 className="section-heading mb-4">Global Team, Shared Purpose</h2>
            <p className="section-subheading mx-auto">Our team spans 6 countries and combines deep tech expertise with genuine passion for youth development.</p>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(({ role, initials, color, desc, country }, i) => (
              <motion.div key={role}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {initials}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{country}</div>
                <h3 className="font-bold text-slate-900 mb-2.5 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{role}</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 sm:py-18 md:py-24 text-center relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(110,66,255,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <SectionWrapper>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Be Part of the Movement
            </h2>
            <p className="text-white/40 mb-8 text-[15px] leading-relaxed">
              Whether as a learner, parent, researcher, partner, or investor — there's a place for you in the ScholarlyEcho story.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
              <Link href="/learning-hub" className="btn-primary">Start Learning <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact#partner" className="btn-white">Partner With Us</Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
