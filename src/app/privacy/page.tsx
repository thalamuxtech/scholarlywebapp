'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowRight, Mail, Lock, Eye, Database, Globe, UserCheck } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    color: 'bg-brand-50 text-brand-600',
    content: [
      { heading: 'Account Information', text: 'When you enroll or register, we collect your name, email address, date of birth (for age-appropriate placement), country of residence, and a password. For minors, we also collect a parent or guardian\'s contact information.' },
      { heading: 'Learning Data', text: 'We track progress through our curriculum levels, session attendance, project submissions, quiz scores, and time spent on each module. This data is used solely to personalise and improve your learning experience.' },
      { heading: 'Payment Information', text: 'Payments are processed through Stripe, a PCI-DSS compliant provider. We do not store your full card number, CVV, or billing details — these are handled entirely by Stripe.' },
      { heading: 'Usage & Analytics', text: 'We collect anonymised data on how users navigate the platform, which features they use, and general performance metrics via privacy-respecting analytics. We do not sell or share this data with advertisers.' },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    color: 'bg-emerald-50 text-emerald-600',
    content: [
      { heading: 'Delivering Education', text: 'Your data powers personalised learning paths, tutor matching, progress tracking, and curriculum recommendations.' },
      { heading: 'Communication', text: 'We use your email to send session reminders, program updates, newsletters (if subscribed), and critical account notifications. You can unsubscribe from marketing emails at any time.' },
      { heading: 'Safety & Security', text: 'We use account data to verify identities, prevent unauthorised access, and maintain a safe environment for all learners — especially minors.' },
      { heading: 'Improvement', text: 'Aggregated, anonymised data helps us improve curriculum quality, tutor performance, and platform features.' },
    ],
  },
  {
    icon: Globe,
    title: 'Data Sharing & Third Parties',
    color: 'bg-amber-50 text-amber-600',
    content: [
      { heading: 'We Never Sell Your Data', text: 'ScholarlyEcho does not sell, rent, or trade personal information to any third party for marketing purposes — ever.' },
      { heading: 'Service Providers', text: 'We share minimal necessary data with trusted service providers (Stripe for payments, Zoom for live sessions, AWS for hosting) bound by strict data processing agreements.' },
      { heading: 'Legal Requirements', text: 'We may disclose information when required by law, court order, or to protect the rights and safety of our community.' },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    color: 'bg-purple-50 text-purple-600',
    content: [
      { heading: 'Encryption', text: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Passwords are hashed using bcrypt — we cannot read your password.' },
      { heading: 'Access Controls', text: 'Only authorised personnel with a need-to-know basis have access to personal data. All staff access is logged and audited.' },
      { heading: 'Incident Response', text: 'In the event of a data breach, we will notify affected users within 72 hours and take immediate corrective action.' },
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    color: 'bg-rose-50 text-rose-600',
    content: [
      { heading: 'Access & Export', text: 'You can request a full export of your personal data at any time from your account settings or by emailing scholarlyechos@gmail.com.' },
      { heading: 'Correction', text: 'You can update your profile information directly in your account dashboard.' },
      { heading: 'Deletion', text: 'You may request deletion of your account and all associated data. We will process this within 30 days, subject to legal retention requirements.' },
      { heading: 'COPPA & GDPR', text: 'We comply with COPPA (USA) for learners under 13, and GDPR (EU/UK) for users in those regions. Parents of minors may exercise rights on their child\'s behalf.' },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-20 overflow-hidden noise-overlay" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-emerald-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Privacy Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-[14px] sm:text-[15px] leading-relaxed">
            We take your privacy seriously — especially for our youngest learners. Last updated <strong className="text-white/80">March 1, 2026</strong>.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Intro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 mb-12 flex gap-4">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-[13px] sm:text-[14px] leading-relaxed">
              ScholarlyEcho serves learners as young as 7. We design every data practice with children\'s safety
              as the top priority. We never show ads, never sell data, and never share personal information without explicit consent.
            </p>
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
                <h3 className="font-bold text-slate-900 mb-2">Questions or Concerns?</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
                  Contact our Data Privacy Officer at{' '}
                  <a href="mailto:scholarlyechos@gmail.com" className="text-brand-600 font-semibold hover:underline">
                    scholarlyechos@gmail.com
                  </a>{' '}
                  or write to us at: ScholarlyEcho Inc., Maryland, United States.
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
