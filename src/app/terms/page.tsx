'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, ArrowRight, Mail, AlertCircle, CreditCard, Users, ShieldCheck, Gavel } from 'lucide-react';

const sections = [
  {
    icon: Users,
    title: 'Eligibility & Accounts',
    color: 'bg-brand-50 text-brand-600',
    content: [
      { heading: 'Age Requirements', text: 'ScholarlyEcho is open to learners aged 7 and above. Learners under 13 must have verifiable parental or guardian consent prior to enrollment. Learners aged 13–17 are considered minors and may require parental co-agreement depending on their country of residence.' },
      { heading: 'Account Accuracy', text: 'You agree to provide accurate, current, and complete information during registration and to keep your profile up to date. Providing false information — including misrepresenting a child\'s age — constitutes a breach of these Terms and may result in immediate account suspension.' },
      { heading: 'Account Security', text: 'You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately at scholarlyechos@gmail.com if you suspect unauthorised access to your account.' },
    ],
  },
  {
    icon: FileText,
    title: 'Use of the Platform',
    color: 'bg-emerald-50 text-emerald-600',
    content: [
      { heading: 'Permitted Use', text: 'ScholarlyEcho grants you a limited, non-exclusive, non-transferable licence to access and use the platform for personal, non-commercial educational purposes in accordance with these Terms.' },
      { heading: 'Prohibited Conduct', text: 'You may not use the platform to: distribute spam or malware; attempt to reverse-engineer or scrape content; impersonate other users or staff; share login credentials; upload offensive, illegal, or harmful content; or violate any applicable laws.' },
      { heading: 'User-Generated Content', text: 'Any projects, code, or submissions you create remain yours. By submitting work to the platform, you grant ScholarlyEcho a non-exclusive licence to display, showcase, and use your work for educational and promotional purposes (e.g., Spotlight Media features) — we will always credit you.' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Subscriptions',
    color: 'bg-amber-50 text-amber-600',
    content: [
      { heading: 'Billing', text: 'Paid subscriptions are billed monthly or annually in advance. All prices are listed in USD unless otherwise stated. Applicable taxes may apply depending on your country.' },
      { heading: 'Cancellation', text: 'You may cancel your subscription at any time from your account dashboard. Your access continues until the end of the current billing period; no partial refunds are issued for unused time unless required by law.' },
      { heading: 'Refunds', text: 'We offer a 7-day money-back guarantee for first-time subscribers. Refund requests made within 7 days of the first charge will be honoured without question. After this period, refunds are granted at our discretion.' },
      { heading: 'Price Changes', text: 'We will provide at least 30 days\' notice before changing subscription prices, and changes will not affect active billing periods already in progress.' },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Intellectual Property',
    color: 'bg-purple-50 text-purple-600',
    content: [
      { heading: 'Our Content', text: 'All curriculum materials, videos, assessments, branding, and platform features are owned by ScholarlyEcho Inc. or our licensors. You may not reproduce, distribute, or create derivative works without express written permission.' },
      { heading: 'Open-Source Tools', text: 'Some tools referenced in our curriculum (Scratch, MIT App Inventor, Python, etc.) are governed by their own open-source or third-party licences. We encourage learners to review those licences when building and distributing their own projects.' },
    ],
  },
  {
    icon: AlertCircle,
    title: 'Disclaimers & Liability',
    color: 'bg-rose-50 text-rose-600',
    content: [
      { heading: 'No Warranty', text: 'The platform is provided "as is." We make no guarantees of uninterrupted access, error-free content, or specific learning outcomes. We do our best, but we cannot promise every learner will achieve identical results.' },
      { heading: 'Limitation of Liability', text: 'To the maximum extent permitted by law, ScholarlyEcho shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.' },
      { heading: 'Third-Party Services', text: 'The platform integrates with third parties (Stripe, Zoom, AWS). We are not responsible for the availability, accuracy, or practices of these services. Review their terms before use.' },
    ],
  },
  {
    icon: Gavel,
    title: 'Governing Law & Disputes',
    color: 'bg-slate-100 text-slate-600',
    content: [
      { heading: 'Governing Law', text: 'These Terms are governed by the laws of the State of Maryland, United States, without regard to conflict-of-law principles.' },
      { heading: 'Dispute Resolution', text: 'We encourage you to contact us first at scholarlyechos@gmail.com. If a resolution cannot be reached, disputes shall be settled by binding arbitration under JAMS rules, except where prohibited by local law.' },
      { heading: 'Changes to Terms', text: 'We may update these Terms from time to time. We will notify you by email and in-app notification at least 14 days before material changes take effect. Continued use of the platform constitutes acceptance.' },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-20 overflow-hidden noise-overlay" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-brand-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Terms of Service
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-[14px] sm:text-[15px] leading-relaxed">
            Please read these terms carefully before using ScholarlyEcho. Last updated <strong className="text-white/80">March 1, 2026</strong>.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Intro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-brand-50 border border-brand-100 p-6 mb-12 flex gap-4">
            <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <p className="text-brand-800 text-[13px] sm:text-[14px] leading-relaxed">
              By accessing or using ScholarlyEcho, you agree to be bound by these Terms of Service and our{' '}
              <Link href="/privacy" className="font-semibold underline">Privacy Policy</Link>. If you do not agree, please do not use the platform.
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
                <h3 className="font-bold text-slate-900 mb-2">Questions About These Terms?</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
                  Reach our legal team at{' '}
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
