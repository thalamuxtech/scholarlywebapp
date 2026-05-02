'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cookie, ArrowRight, Mail, Settings, BarChart2, ShieldCheck, ToggleRight } from 'lucide-react';

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    badge: 'Always Active',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    description: 'These cookies are essential for the platform to function. They enable core features like login sessions, payment security tokens, and CSRF protection. They cannot be disabled.',
    examples: ['session_id: keeps you logged in', 'csrf_token: protects form submissions', 'stripe_mid: Stripe fraud prevention'],
    canDisable: false,
  },
  {
    name: 'Functional',
    badge: 'Optional',
    badgeColor: 'bg-brand-50 text-brand-600',
    description: 'Functional cookies remember your preferences and personalise your experience: such as your language setting, dark/light mode, and last-visited level.',
    examples: ['pref_theme: remembers light/dark mode', 'pref_lang: remembers your language', 'last_level: resumes where you left off'],
    canDisable: true,
  },
  {
    name: 'Analytics',
    badge: 'Optional',
    badgeColor: 'bg-amber-50 text-amber-700',
    description: 'Analytics cookies help us understand how learners navigate the platform: which pages are most visited, where users drop off, and how features perform. All data is anonymised and never tied to your identity.',
    examples: ['_analytics_id: anonymous session identifier', 'page_views: pages visited (no PII)', 'feature_usage: which tools are used'],
    canDisable: true,
  },
  {
    name: 'No Advertising Cookies',
    badge: 'Never Used',
    badgeColor: 'bg-slate-100 text-slate-500',
    description: 'ScholarlyEcho does not use advertising, retargeting, or cross-site tracking cookies. We do not partner with ad networks, and we never track learners: especially children: for commercial targeting purposes.',
    examples: [],
    canDisable: false,
    isNone: true,
  },
];

const sections = [
  {
    icon: Cookie,
    title: 'What Are Cookies?',
    color: 'bg-amber-50 text-amber-600',
    content: [
      { heading: 'Definition', text: 'Cookies are small text files stored on your device by your browser when you visit a website. They are widely used to make websites work, remember your preferences, and provide information to site owners.' },
      { heading: 'Similar Technologies', text: 'We also use similar technologies including localStorage (for client-side preferences) and sessionStorage (for temporary session state). These are covered by the same consent rules as cookies.' },
    ],
  },
  {
    icon: BarChart2,
    title: 'How Long Cookies Last',
    color: 'bg-blue-50 text-blue-600',
    content: [
      { heading: 'Session Cookies', text: 'Session cookies are temporary and are deleted when you close your browser. We use these for authentication and security tokens.' },
      { heading: 'Persistent Cookies', text: 'Persistent cookies remain for a set period. Our functional cookies expire after 1 year; analytics identifiers expire after 13 months in line with GDPR guidance.' },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Third-Party Cookies',
    color: 'bg-emerald-50 text-emerald-600',
    content: [
      { heading: 'Stripe', text: 'Stripe may set cookies for fraud detection and payment processing. These are strictly necessary for paid subscriptions. See Stripe\'s Cookie Policy for details.' },
      { heading: 'Zoom', text: 'Zoom may set cookies during live session links. These are functional to the session experience and are cleared when the session ends.' },
      { heading: 'No Google Ads / Meta Pixel', text: 'We do not install Google Ads, Meta Pixel, or any other advertising network script on our platform. Period.' },
    ],
  },
  {
    icon: ToggleRight,
    title: 'Managing Your Preferences',
    color: 'bg-purple-50 text-purple-600',
    content: [
      { heading: 'Cookie Banner', text: 'On your first visit, a cookie consent banner allows you to accept all, reject optional cookies, or customise your choices. You can change your preferences at any time via the Cookie Settings link in the footer.' },
      { heading: 'Browser Settings', text: 'You can also control cookies through your browser settings. Note that disabling strictly necessary cookies will break core platform functionality including login.' },
      { heading: 'Do Not Track', text: 'We respect the Do Not Track (DNT) browser signal. If DNT is enabled, we disable all optional analytics cookies automatically.' },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-20 overflow-hidden noise-overlay" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-7 h-7 text-amber-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Cookie Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-[14px] sm:text-[15px] leading-relaxed">
            We use minimal, privacy-respecting cookies. Here&apos;s exactly what we use and why. Last updated <strong className="text-white/80">March 1, 2026</strong>.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Intro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl bg-amber-50 border border-amber-100 p-6 mb-12 flex gap-4">
            <Cookie className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-[13px] sm:text-[14px] leading-relaxed">
              We use no advertising cookies and never track children for commercial purposes. Our cookie use is limited to what is strictly required to operate the platform safely and improve the learning experience.
            </p>
          </motion.div>

          {/* Cookie Type Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-14">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cookie Categories
            </h2>
            <div className="space-y-4">
              {cookieTypes.map((type, i) => (
                <motion.div key={type.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-5 sm:p-6 ${type.isNone ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-extrabold text-slate-900 text-[14px] sm:text-[15px]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {type.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${type.badgeColor}`}>
                        {type.badge}
                      </span>
                    </div>
                    {type.canDisable && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Settings className="w-3.5 h-3.5" />
                        <span>Adjustable in Cookie Settings</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-3">{type.description}</p>
                  {type.examples.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((ex) => (
                        <code key={ex} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-mono">
                          {ex}
                        </code>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Informational Sections */}
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
                <h3 className="font-bold text-slate-900 mb-2">Questions About Cookies?</h3>
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
