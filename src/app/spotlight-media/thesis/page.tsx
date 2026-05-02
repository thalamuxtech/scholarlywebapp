'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FlaskConical, ArrowRight, Sparkles, CheckCircle2,
  Globe, Users, BookOpen, ExternalLink
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

const domains = ['Education & Technology', 'Public Health', 'Economics & Entrepreneurship', 'Agriculture & Food Systems', 'Climate & Environment', 'Governance & Policy', 'Arts & Culture', 'Social Justice'];

const process = [
  { step: 1, title: 'Submit Application', desc: 'Complete the online form with your research abstract, key findings, and intended community impact.' },
  { step: 2, title: 'Review & Selection', desc: 'Our editorial team reviews applications within 2 weeks, focusing on relevance and implementation potential.' },
  { step: 3, title: 'Preparation Support', desc: 'Selected researchers receive coaching to prepare a compelling 3MT-style presentation.' },
  { step: 4, title: 'Live Spotlight', desc: 'Present your research to our community audience in a live-streamed event with Q&A.' },
  { step: 5, title: 'Implementation Matching', desc: 'We connect you with community partners, NGOs, schools, and corporates to implement your findings.' },
];

export default function ThesisSpotlightPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            <FlaskConical className="w-4 h-4" /> Doctorate Thesis Spotlight
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Your Research Deserves to{' '}
            <span className="gradient-text-gold">Change Lives</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/65 text-lg mb-8 max-w-2xl mx-auto">
            These are excellent projects with the potential of high impact. We translate Master's and PhD research into community implementation frameworks —
            because knowledge that stays in journals doesn't transform communities.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary">Apply to Present <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/spotlight-media" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
              Browse Episodes
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: '40+', l: 'Theses Featured' },
              { n: '15+', l: 'Implementation Partnerships' },
              { n: '8+', l: 'Policies Influenced' },
              { n: '2,000+', l: 'Community Members Reached' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-3xl font-bold gradient-text-gold mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{n}</div>
                <div className="text-slate-500 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-14">
            <h2 className="section-heading mb-4">How the Spotlight Works</h2>
            <p className="section-subheading mx-auto">From submission to community impact: a clear 5-step journey.</p>
          </SectionWrapper>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-brand-500 hidden md:block" />
            <div className="space-y-8">
              {process.map(({ step, title, desc }, i) => (
                <motion.div key={step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start md:pl-8">
                  <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white z-10 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {step}
                  </div>
                  <div className="premium-card flex-1">
                    <h3 className="font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Domains */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionWrapper>
            <h2 className="section-heading mb-4">Research Domains We Cover</h2>
            <p className="section-subheading mx-auto mb-8">
              We welcome research from all disciplines that has clear community impact potential.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {domains.map((domain) => (
                <span key={domain}
                  className="px-4 py-2 rounded-full border-2 border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold">
                  {domain}
                </span>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <SectionWrapper>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Ready to Make Your Research Count?
            </h2>
            <p className="text-white/65 mb-8">
              Submit your application today. Our next spotlight cohort opens April 2026.
            </p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Apply to Present <ArrowRight className="w-5 h-5" />
            </Link>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
