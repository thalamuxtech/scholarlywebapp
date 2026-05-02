'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic2, Play, Globe, Users, Star, ArrowRight, Sparkles,
  Quote, ChevronRight, Radio, FlaskConical, Share2,
  ExternalLink, Headphones, TrendingUp, Brain
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const episodes = [
  { ep: 48, title: 'Building AI Companies from Africa: What the World Doesn\'t Know', guest: 'Emeka Eze', role: 'AI Founder, Nairobi · YC W25', duration: '52 min', category: 'AI & Entrepreneurship', color: 'from-brand-400 to-purple-500' },
  { ep: 47, title: 'How I Went from Rural Nigeria to a PhD at Cambridge', guest: 'Dr. Chioma Nwosu', role: 'Oxford/Cambridge Scholar', duration: '44 min', category: 'Scholarships', color: 'from-amber-400 to-orange-500' },
  { ep: 46, title: 'The Future of Education is African', guest: 'Prof. Kwabena Frimpong', role: 'UNESCO Education Director', duration: '61 min', category: 'Education Policy', color: 'from-emerald-400 to-teal-500' },
  { ep: 45, title: 'From Lagos Coder to Silicon Valley Engineer in 3 Years', guest: 'Tunde Adeyemi', role: 'Engineer, Meta', duration: '39 min', category: 'Career', color: 'from-pink-400 to-rose-500' },
  { ep: 44, title: 'What Machine Learning Actually Needs to Solve for Africa', guest: 'Dr. Amara Soumaré', role: 'ML Researcher, MIT', duration: '55 min', category: 'AI & Research', color: 'from-cyan-400 to-blue-500' },
  { ep: 43, title: 'Building Community Through Knowledge: The ScholarlyEcho Vision', guest: 'Founder, ScholarlyEcho', role: 'Maryland, USA', duration: '35 min', category: 'Origin Story', color: 'from-violet-400 to-purple-600' },
];

const thesisSpotlights = [
  {
    topic: 'AI-Assisted Learning for Low-Bandwidth Rural Communities',
    researcher: 'Dr. Fatima Garba', institution: 'Bayero University, Kano',
    domain: 'AI & Education', impl: 'Lightweight ML model framework for offline school tools',
    color: 'from-brand-500 to-purple-600', impact: '12 schools · 4,000+ students',
  },
  {
    topic: 'Youth Mental Health & Digital Resilience Post-Pandemic',
    researcher: 'Dr. Emeka Igwe', institution: 'University of Lagos',
    domain: 'Public Health', impl: 'Peer-support community design model for universities',
    color: 'from-emerald-500 to-teal-600', impact: '8 universities · 3 NGO partnerships',
  },
  {
    topic: 'Entrepreneurship as Youth Employment: African Case Studies',
    researcher: 'Dr. Abena Mensah', institution: 'Ashesi University, Ghana',
    domain: 'Economics', impl: 'Youth business incubator model for secondary schools',
    color: 'from-amber-500 to-orange-600', impact: '5 incubators launched',
  },
];

const categories = ['Career & Growth', 'Scholarships', 'AI & Technology', 'Entrepreneurship', 'Education Policy', 'Research & Impact', 'Mental Health', 'Community Development'];

export default function SpotlightMediaPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{ width: `${3 + Math.random() * 4}px`, height: `${3 + Math.random() * 4}px`, background: ['#fbbf24', '#6e42ff', '#10b981', '#ec4899'][i % 4], left: `${8 + i * 9}%`, top: `${15 + (i % 4) * 18}%`, opacity: 0.2 }}
              animate={{ y: [-15, 15, -15], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </div>
        {/* Ambient glow orbs */}
        <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
        {/* Horizon glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 30%, rgba(251,191,36,0.5) 50%, rgba(245,158,11,0.4) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-14 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 text-[13px] font-semibold mb-6">
                <Mic2 className="w-3.5 h-3.5" /> Spotlight Media · Podcast & Research
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-[2rem] sm:text-3xl md:text-4xl lg:text-[4rem] font-extrabold text-white leading-[1.15] tracking-[-0.03em] mb-6"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Stories That Turn
                <br />
                <span style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Potential into Purpose
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-white/45 text-[1.05rem] leading-[1.75] mb-9 max-w-[480px]">
                Global conversations with scholars, AI pioneers, entrepreneurs, and community builders.
                Research that moves from journals to real-world impact. Stories that say "you can too."
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3.5 mb-10">
                <Link href="#episodes" className="btn-primary text-[15px] px-7 py-3.5">
                  <Play className="w-5 h-5 fill-white" /> Listen Now
                </Link>
                <Link href="#thesis" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/18 text-white font-semibold hover:bg-white/10 transition-all text-[15px]">
                  Thesis Spotlight <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
                className="grid grid-cols-3 gap-4">
                {[
                  { n: 48, s: '+', l: 'Episodes' },
                  { n: 25, s: 'K+', l: 'Monthly Listeners' },
                  { n: 30, s: '+', l: 'Countries' },
                ].map(({ n, s, l }) => (
                  <div key={l} className="glass rounded-2xl p-4 text-center border border-white/8">
                    <div className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <AnimatedCounter end={n} suffix={s} />
                    </div>
                    <div className="text-white/45 text-[11px] mt-0.5">{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Latest episode card */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-8 border border-white/8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-amber-300 text-[13px] font-bold">Latest Episode</span>
              </div>
              <div className={`rounded-2xl bg-gradient-to-br ${episodes[0].color} p-6 mb-5 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-15"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent)' }} />
                <div className="relative z-10">
                  <div className="text-white/60 text-[11px] mb-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/20 font-semibold">{episodes[0].category}</span>
                    <span>Ep. {episodes[0].ep} · {episodes[0].duration}</span>
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-3 leading-snug">
                    {episodes[0].title}
                  </h3>
                  <div className="text-white/80 text-[13px]">
                    <div className="font-bold">{episodes[0].guest}</div>
                    <div className="text-white/55">{episodes[0].role}</div>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-0.5 mb-5 h-10">
                {[...Array(40)].map((_, i) => (
                  <motion.div key={i} className="w-1 bg-amber-400/50 rounded-full flex-shrink-0"
                    style={{ height: `${10 + Math.abs(Math.sin(i * 0.8)) * 20 + Math.random() * 8}px` }}
                    animate={{ scaleY: [1, 0.3, 1.4, 0.6, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.04 }} />
                ))}
              </div>

              <button className="w-full py-3 rounded-xl gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-[14px]">
                <Play className="w-4 h-4 fill-white" /> Play Episode 48
              </button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Episode Categories ── */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {categories.map((cat, i) => (
              <motion.button key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 rounded-full border-2 border-slate-200 text-slate-600 text-[13px] font-semibold hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200">
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Episodes Grid ── */}
      <section id="episodes" className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Radio className="w-3.5 h-3.5" /> Edu Spotlight Podcast
            </div>
            <h2 className="section-heading mb-4">Recent Episodes</h2>
            <p className="section-subheading mx-auto">
              Bi-weekly conversations that turn world-class expertise into accessible insights for youth everywhere.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((ep, i) => (
              <motion.div key={ep.ep}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group overflow-hidden hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className={`h-1 bg-gradient-to-r ${ep.color} -mx-6 -mt-6 mb-6 rounded-t-2xl`} />
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${ep.color}`}>
                    {ep.category}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Headphones className="w-3 h-3" /> {ep.duration}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] font-semibold mb-2">Episode {ep.ep}</div>
                <h3 className="font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors leading-snug text-[15px] flex-1"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {ep.title}
                </h3>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ep.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                    {ep.guest.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">{ep.guest}</div>
                    <div className="text-[11px] text-slate-400">{ep.role}</div>
                  </div>
                </div>
                <button className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${ep.color} text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-auto`}>
                  <Play className="w-3.5 h-3.5 fill-white" /> Listen Now
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="#" className="btn-secondary">Browse All 48 Episodes <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── Thesis Spotlight ── */}
      <section id="thesis" className="py-16 sm:py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5"
              style={{ background: 'rgba(245,158,11,0.08)', color: '#d97706', borderColor: 'rgba(245,158,11,0.2)' }}>
              <FlaskConical className="w-3.5 h-3.5" /> Doctorate Thesis Spotlight
            </div>
            <h2 className="section-heading mb-5">Research That Transforms Communities</h2>
            <p className="section-subheading mx-auto">
              PhD and Master's research presented in a 3MT-style format, then matched with community partners
              for real-world implementation. Because knowledge that stays in journals doesn't change lives.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-7 mb-12">
            {thesisSpotlights.map(({ topic, researcher, institution, domain, impl, color, impact }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <FlaskConical className="w-5.5 h-5.5 text-white" />
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${color} mb-3`}>
                  {domain}
                </span>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug text-[15px]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{topic}</h3>
                <div className="text-[13px] font-bold text-slate-700 mb-0.5">{researcher}</div>
                <div className="text-[11px] text-slate-400 mb-4">{institution}</div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">Implementation</div>
                  <div className="text-[12px] text-slate-700 leading-relaxed">{impl}</div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r ${color} opacity-80 mb-4`}>
                  <TrendingUp className="w-3 h-3" /> Impact: {impact}
                </div>

                <Link href="#" className="inline-flex items-center gap-2 text-[13px] font-bold text-amber-600 hover:gap-3 transition-all">
                  View Full Spotlight <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Researcher CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent)' }} />
            <div className="relative z-10">
              <Brain className="w-12 h-12 text-white/70 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Are You a Researcher?
              </h3>
              <p className="text-white/80 max-w-lg mx-auto mb-6 text-[14px] leading-relaxed">
                Apply to present in our 3MT-style Thesis Spotlight series. Get global visibility,
                community implementation partners, and measurable impact for your academic work.
              </p>
              <Link href="/contact" className="btn-white text-[14px] px-8 py-3.5">
                Apply to Present <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <SectionWrapper>
            <Headphones className="w-12 h-12 mx-auto mb-5 text-brand-400" />
            <h2 className="section-heading mb-4">Listen Everywhere</h2>
            <p className="section-subheading mx-auto mb-8">
              The Edu Spotlight Podcast is available on all major platforms. Subscribe and never miss an episode.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['Spotify', 'Apple Podcasts', 'Google Podcasts', 'YouTube', 'Pocket Casts', 'Overcast'].map((platform) => (
                <a key={platform} href="#"
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-[13px] hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 flex items-center gap-2">
                  {platform} <Share2 className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
