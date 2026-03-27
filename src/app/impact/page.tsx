'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Award, BookOpen, Globe, ArrowRight,
  Sparkles, Star, Quote, Download, Brain, Rocket, MapPin,
  BarChart3, Heart
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const metrics = [
  { value: 1200, suffix: '+', label: 'Youth Trained Globally', icon: Users, color: 'from-brand-500 to-purple-600', desc: 'Across 20+ countries' },
  { value: 300, suffix: '+', label: 'Projects Completed', icon: BookOpen, color: 'from-amber-400 to-orange-500', desc: 'Live apps, AI tools, SaaS MVPs' },
  { value: 50, suffix: '+', label: 'Partner Schools & Orgs', icon: Globe, color: 'from-emerald-400 to-teal-600', desc: 'Africa, Americas, Europe' },
  { value: 40, suffix: '+', label: 'Thesis Spotlights', icon: Award, color: 'from-purple-500 to-indigo-600', desc: 'Research translated to impact' },
  { value: 98, suffix: '%', label: 'Completion Rate', icon: TrendingUp, color: 'from-pink-500 to-rose-600', desc: 'Highest in the sector' },
  { value: 15, suffix: '+', label: 'Research Partnerships', icon: Star, color: 'from-teal-400 to-cyan-500', desc: 'Community implementations' },
];

const stories = [
  {
    name: 'Kemi Olatunji', age: 16, from: 'Abeokuta, Nigeria', flag: '🇳🇬',
    story: 'Joined ScholarlyEcho at 13 with zero coding background. By 16, she built an AI-powered plant disease detector used by over 500 farmers in Ogun State — and presented it at a global youth tech conference in Berlin.',
    color: 'from-emerald-400 to-teal-500',
    track: 'AI Builder Track',
  },
  {
    name: 'Amara Diallo', age: 17, from: 'Dakar, Senegal', flag: '🇸🇳',
    story: 'Product Builder graduate who launched "StudySync" — a SaaS tool connecting university students for peer study sessions. 2,000+ users within 3 months of launch. Now fundraising her seed round.',
    color: 'from-brand-400 to-purple-500',
    track: 'Product Builder Track',
  },
  {
    name: 'Dr. Kwame Mensah', age: 34, from: 'Accra, Ghana', flag: '🇬🇭',
    story: 'PhD researcher whose work on youth mental health sat unpublished for two years. The Thesis Spotlight series connected him with 4 NGOs. His framework is now implemented in 30 secondary schools across Ghana.',
    color: 'from-amber-400 to-orange-500',
    track: 'Thesis Spotlight',
  },
  {
    name: 'Rachel Thompson', age: 42, from: 'Atlanta, USA', flag: '🇺🇸',
    story: 'High school STEM teacher who integrated ScholarlyEcho\'s AI Foundations curriculum into her classroom. 28 of her students completed the AI track — 12 went on to study Computer Science at university.',
    color: 'from-violet-400 to-purple-600',
    track: 'School Partnership',
  },
  {
    name: 'Ibrahim Musa', age: 15, from: 'Kano, Nigeria', flag: '🇳🇬',
    story: 'Explorer-level student who started with Scratch at age 10. Won the 2025 National Flag Challenge, then progressed to build a budgeting app for his school\'s student union. Currently coding his second app.',
    color: 'from-pink-400 to-rose-500',
    track: 'Coders Ladder',
  },
  {
    name: 'Aisha Nakamura', age: 20, from: 'Nairobi, Kenya', flag: '🇰🇪',
    story: 'Joined our Code Prodigy track, built an AI-powered crop yield predictor for smallholder farmers, won the East Africa Youth Tech award, and secured a full scholarship to study Computer Science at UCT.',
    color: 'from-teal-400 to-emerald-500',
    track: 'Code Prodigy',
  },
];

const globalReach = [
  { region: 'Sub-Saharan Africa', learners: '800+', countries: 'Nigeria, Ghana, Kenya, South Africa, Senegal +7', flag: '🌍' },
  { region: 'North America', learners: '150+', countries: 'USA, Canada', flag: '🌎' },
  { region: 'Europe', learners: '120+', countries: 'UK, Germany, France, Netherlands', flag: '🌍' },
  { region: 'Asia Pacific', learners: '80+', countries: 'India, Australia, Malaysia', flag: '🌏' },
];

export default function ImpactPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay text-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-3xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Global Impact Report
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Every Number Tells a Story
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg leading-[1.75]">
            Behind every statistic is a young person who chose to invest in themselves, a parent who believed,
            a researcher who shared their work, or a school that opened its doors.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Metrics Grid ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {metrics.map(({ value, suffix, label, icon: Icon, color, desc }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <div className={`text-4xl font-extrabold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <div className="font-bold text-slate-900 text-[15px] mb-1">{label}</div>
                <div className="text-slate-400 text-[12px]">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Reach ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <div className="section-tag mx-auto mb-5">
              <Globe className="w-3.5 h-3.5" /> Global Reach
            </div>
            <h2 className="section-heading mb-4">Impact Across 4 Continents</h2>
          </SectionWrapper>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {globalReach.map(({ region, learners, countries, flag }, i) => (
              <motion.div key={region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card text-center">
                <div className="text-4xl mb-3">{flag}</div>
                <div className="text-2xl font-extrabold gradient-text mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{learners}</div>
                <div className="font-bold text-slate-900 mb-2 text-[14px]">{region}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{countries}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Star className="w-3.5 h-3.5" /> Stories of Transformation
            </div>
            <h2 className="section-heading mb-4">Meet the Changemakers</h2>
            <p className="section-subheading mx-auto">Six learners, researchers, and educators whose stories embody what ScholarlyEcho makes possible.</p>
          </SectionWrapper>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div key={story.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0`}>
                    {story.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[14px]">{story.name}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      {story.flag} {story.from} · Age {story.age}
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-gradient-to-r ${story.color}`}>
                      {story.track}
                    </span>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-brand-200 mb-2" />
                <p className="text-slate-600 text-[13px] leading-relaxed flex-1">"{story.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Impact ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <SectionWrapper>
            <div className="section-tag mx-auto mb-5">
              <BarChart3 className="w-3.5 h-3.5" /> Research-to-Reality
            </div>
            <h2 className="section-heading mb-5">Knowledge That Moves Communities</h2>
            <p className="section-subheading mx-auto mb-10">
              Our Thesis Spotlight series bridges the gap between academic research and community implementation —
              giving PhD researchers the platform to turn years of work into real-world impact.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {[
                { n: 40, s: '+', l: 'Theses Featured', color: 'gradient-text' },
                { n: 15, s: '+', l: 'Implementations', color: 'gradient-text-gold' },
                { n: 8, s: '+', l: 'Policies Influenced', color: 'gradient-text-green' },
                { n: 30, s: 'K+', l: 'Community Members', color: 'gradient-text' },
              ].map(({ n, s, l, color }) => (
                <div key={l} className="premium-card">
                  <div className={`text-3xl font-extrabold ${color} mb-1`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <AnimatedCounter end={n} suffix={s} />
                  </div>
                  <div className="text-slate-500 text-[12px] font-medium">{l}</div>
                </div>
              ))}
            </div>
            <a href="#" className="btn-secondary inline-flex">
              Download 2025 Annual Impact Report <Download className="w-4 h-4" />
            </a>
          </SectionWrapper>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 sm:py-18 md:py-24 text-center relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(110,66,255,0.2) 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <SectionWrapper>
            <Heart className="w-12 h-12 mx-auto mb-6 text-rose-400 fill-rose-400/20" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Help Write the Next Chapter
            </h2>
            <p className="text-white/55 mb-8 text-[15px] leading-relaxed">
              Every partnership, every sponsorship, every enrollment adds to this story. Join us.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center sm:items-start">
              <Link href="/contact#partner" className="btn-primary">Become a Partner <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/learning-hub" className="btn-white">Sponsor a Learner</Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
