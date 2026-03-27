'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Star, Award, Code2, Trophy, ArrowRight,
  CheckCircle2, Sparkles, Users, Target
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

const requirements = [
  'Completed Creator level or above (or equivalent experience)',
  'Age 13 or above',
  'Demonstrated passion for building real-world projects',
  'Parent/guardian commitment to the program',
  'Successful application review and interview',
];

const benefits = [
  { icon: Code2, title: 'Advanced Curriculum', desc: 'Full-stack projects, APIs, databases, deployment — industry-level work.' },
  { icon: Users, title: 'Peer Cohort', desc: 'Work alongside Nigeria\'s most talented young coders in a dedicated cohort.' },
  { icon: Trophy, title: 'Competitions', desc: 'Hack-style challenges, internal competitions, and national leaderboard recognition.' },
  { icon: Award, title: 'Recognition', desc: 'Featured on ScholarlyEcho spotlight, LinkedIn profile optimization, and industry exposure.' },
  { icon: Target, title: 'Mentorship', desc: 'Direct access to professional software engineers and startup founders.' },
  { icon: Star, title: 'Portfolio', desc: 'Graduate with 3–5 production-grade projects ready to showcase to universities and employers.' },
];

export default function CodeProdigyPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#f59e0b', '#6e42ff', '#10b981', '#ec4899'][i % 4],
              left: `${5 + i * 8}%`,
              top: `${15 + (i % 4) * 18}%`,
              opacity: 0.3,
            }}
            animate={{ y: [-20, 20, -20], scale: [1, 1.5, 1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0f172a' }}>
            <Zap className="w-4 h-4" /> Elite Program
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Code{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Prodigy
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/65 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            For learners who aren't just learning to code — they're building the future.
            The elite track for Africa's next generation of software engineers and tech innovators.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/learning-hub" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-base">
              View Full Ladder
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What is Code Prodigy */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionWrapper>
              <div className="section-tag mb-5" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706', borderColor: 'rgba(245,158,11,0.2)' }}>
                <Star className="w-3.5 h-3.5" /> Elite Track
              </div>
              <h2 className="section-heading mb-6">Not Just Advanced — Elite</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Code Prodigy isn't just a harder version of our standard programs. It's an entirely different
                experience designed for learners who have demonstrated exceptional aptitude and ambition.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Cohorts are small (max 12 per group), mentors are professional engineers, and projects are
                real — built to solve actual community problems and presented to industry panels.
              </p>
              <h4 className="font-bold text-slate-900 mb-4">Who qualifies?</h4>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-slate-600 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </SectionWrapper>

            {/* Visual */}
            <SectionWrapper delay={0.2}>
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <div className="p-8 relative">
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                  <div className="relative z-10">
                    <Trophy className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Code Prodigy Program
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Duration', value: '6–12 months' },
                        { label: 'Cohort size', value: 'Max 12 learners' },
                        { label: 'Sessions', value: '3× per week (1-on-1 + group)' },
                        { label: 'Eligibility', value: 'Application required' },
                        { label: 'Projects', value: '3–5 production-grade' },
                        { label: 'Mentors', value: 'Industry engineers' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-white/20">
                          <span className="text-white/80 text-sm">{label}</span>
                          <span className="text-white font-semibold text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/contact" className="btn-white w-full text-center justify-center mt-6">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-14">
            <h2 className="section-heading mb-4">What You Get</h2>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <SectionWrapper>
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-amber-400" />
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Think You Have What It Takes?
            </h2>
            <p className="text-white/65 mb-8">Applications are reviewed on a rolling basis. Cohort spots are limited.</p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Apply to Code Prodigy <ArrowRight className="w-5 h-5" />
            </Link>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
