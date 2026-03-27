'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowRight, Mail, ShieldCheck, Eye, Users, Lock, AlertTriangle, Phone } from 'lucide-react';

const sections = [
  {
    icon: Heart,
    title: 'Our Commitment to Children',
    color: 'bg-rose-50 text-rose-600',
    content: [
      { heading: 'Child-First Design', text: 'ScholarlyEcho was built with children as the primary consideration. Every feature, content piece, and interaction is reviewed through the lens of child safety, age-appropriateness, and dignity. We serve learners as young as 7, and take that responsibility with the utmost seriousness.' },
      { heading: 'No Advertising to Minors', text: 'We do not show advertisements to any user under 18. We do not allow behavioural profiling of minors, and we do not use children\'s data for commercial purposes of any kind.' },
      { heading: 'Safe Learning Environment', text: 'All live sessions are recorded, monitored, and subject to our Code of Conduct. Tutors undergo background checks before joining the platform. Sessions with minors are never conducted one-on-one without parental-visible links.' },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'COPPA & GDPR-K Compliance',
    color: 'bg-brand-50 text-brand-600',
    content: [
      { heading: 'COPPA (USA)', text: 'We comply with the Children\'s Online Privacy Protection Act for all learners under 13 in the United States. We collect only the minimum necessary personal information and require verifiable parental consent before enrollment.' },
      { heading: 'GDPR (EU/UK)', text: 'For learners in the European Union and United Kingdom, we comply with GDPR and the UK GDPR. Parents and guardians may exercise data rights — access, correction, deletion — on behalf of their child at any time.' },
      { heading: 'Parental Consent', text: 'Before any learner under 13 can access the platform, a parent or guardian must complete our consent flow, which includes reviewing our Privacy Policy and Child Safety Policy and providing a verified contact email.' },
    ],
  },
  {
    icon: Eye,
    title: 'Content Moderation',
    color: 'bg-emerald-50 text-emerald-600',
    content: [
      { heading: 'Curriculum Review', text: 'All curriculum content is age-graded and reviewed by our editorial team. Content rated for older learners is gated behind age-verified accounts. No mature, violent, or inappropriate content is permitted anywhere on the platform.' },
      { heading: 'Community & Project Submissions', text: 'Learner-submitted projects, comments, and forum posts are moderated before public display. Automated filters flag potentially harmful content, and human reviewers make final decisions. Projects are reviewed within 24 hours of submission.' },
      { heading: 'AI-Generated Content', text: 'Where AI tools are used in curriculum (e.g., AI Developer level), outputs are sandboxed and reviewed. We do not expose children to open-ended, unfiltered AI chat interfaces.' },
    ],
  },
  {
    icon: Users,
    title: 'Tutor & Staff Standards',
    color: 'bg-amber-50 text-amber-600',
    content: [
      { heading: 'Background Checks', text: 'All tutors and staff who interact with minors are required to pass DBS / criminal background checks before they can teach on the platform. Checks are renewed every two years.' },
      { heading: 'Safeguarding Training', text: 'Every tutor completes our safeguarding training programme before their first session. Training covers recognising abuse, appropriate communication boundaries, mandatory reporting obligations, and our escalation procedures.' },
      { heading: 'Code of Conduct', text: 'Tutors must adhere to a strict Code of Conduct. Any breach — including inappropriate communication, sharing personal contact details with students, or meeting students outside sanctioned sessions — results in immediate suspension and investigation.' },
    ],
  },
  {
    icon: Lock,
    title: 'Data Protection for Minors',
    color: 'bg-purple-50 text-purple-600',
    content: [
      { heading: 'Minimal Data Collection', text: 'For learners under 13, we collect only: first name, date of birth (for age placement), parent/guardian email, and learning progress. We do not collect photos, location, school name, or social profiles.' },
      { heading: 'No Third-Party Sharing', text: 'We never share a child\'s personal data with third parties for marketing, analytics resale, or any commercial purpose. Operational service providers (e.g., Zoom for sessions) receive only what is technically required and are bound by strict DPAs.' },
      { heading: 'Data Retention', text: 'When a minor\'s account is closed or deleted, all personal data is purged within 30 days, including from backups. Learning progress data may be retained in anonymised, aggregated form for research purposes.' },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Reporting & Response',
    color: 'bg-orange-50 text-orange-600',
    content: [
      { heading: 'How to Report a Concern', text: 'If you witness or suspect any safeguarding concern — whether involving a tutor, another learner, or platform content — report it immediately via the in-platform "Report" button or by emailing safeguarding@scholarlyecho.com.' },
      { heading: 'Our Response Process', text: 'All safeguarding reports are reviewed by our Designated Safeguarding Lead (DSL) within 4 hours during business hours. Where there is risk to a child, we escalate to relevant authorities in the child\'s jurisdiction immediately.' },
      { heading: 'Mandatory Reporting', text: 'We are a mandatory reporter. Where we identify credible risk of harm to a child — whether on or off platform — we will notify the appropriate child protection authorities without delay, even if this means disclosing data.' },
    ],
  },
];

export default function ChildSafetyPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-20 overflow-hidden noise-overlay" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-7 h-7 text-rose-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Child Safety Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-[14px] sm:text-[15px] leading-relaxed">
            Protecting our youngest learners is our highest responsibility. Last updated <strong className="text-white/80">March 1, 2026</strong>.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Intro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-rose-50 border border-rose-100 p-6 mb-12 flex gap-4">
            <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-rose-800 text-[13px] sm:text-[14px] leading-relaxed">
              ScholarlyEcho serves learners as young as 7. Every team member, tutor, and partner is bound by our Child Safety Standards. Zero tolerance for any behaviour that endangers or exploits a child — no exceptions.
            </p>
          </motion.div>

          {/* Emergency Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-orange-50 border border-orange-200 p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-orange-900 text-[13px]">Immediate Safeguarding Concern?</p>
                <p className="text-orange-700 text-[12px] mt-0.5">Email <a href="mailto:safeguarding@scholarlyecho.com" className="font-semibold underline">safeguarding@scholarlyecho.com</a> — reviewed within 4 hours. For emergencies, contact your local child protection services immediately.</p>
              </div>
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div key={section.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${section.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 pl-0 sm:pl-12">
                    {section.content.map((item) => (
                      <div key={item.heading} className="border-l-2 border-slate-100 pl-5">
                        <h3 className="font-bold text-slate-800 text-[13px] sm:text-[14px] mb-1">{item.heading}</h3>
                        <p className="text-slate-500 text-[13px] leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 rounded-2xl bg-slate-50 border border-slate-100 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Contact Our Safeguarding Team</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
                  For child safety reports, concerns, or parental queries, contact our Designated Safeguarding Lead at{' '}
                  <a href="mailto:safeguarding@scholarlyecho.com" className="text-brand-600 font-semibold hover:underline">
                    safeguarding@scholarlyecho.com
                  </a>
                  . For general enquiries: ScholarlyEcho Inc., Maryland, United States.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-600 hover:gap-3 transition-all">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
