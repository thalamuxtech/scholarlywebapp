'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Sparkles, Star,
  Users, Clock, Zap, Shield, HeartHandshake,
  Brain, Rocket, Globe, Trophy, Code2
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';

const packages = [
  {
    name: 'Starter',
    subtitle: '1 session/week · 5–20 students',
    price: '$110',
    period: '/month',
    annualNote: '40% discount applied (was $183)',
    color: 'from-teal-400 to-emerald-500',
    popular: false,
    features: [
      '1 group session per week (4/month)',
      '5–20 students per class',
      'Explorer & Builder levels (ages 5+)',
      'Starter project portfolio',
      'Community access',
      'Digital completion certificate',
      'Parent progress summary',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Standard',
    subtitle: '2 sessions/week · 4–10 students',
    price: '$200',
    period: '/month',
    annualNote: '30% discount applied (was $285)',
    color: 'from-brand-500 to-purple-600',
    popular: true,
    features: [
      '2 sessions per week (8/month)',
      '4–10 students per class',
      'All core levels (Explorer–Creator)',
      'Advanced project portfolio',
      'Monthly parent progress report',
      'Priority support (24hr response)',
      'Peer learning community access',
    ],
    cta: 'Enroll Now',
  },
  {
    name: 'Premium 1-on-1',
    subtitle: 'Personalized · Dedicated tutor',
    price: '$350',
    period: '/month',
    annualNote: '30% discount applied (was $500)',
    color: 'from-purple-500 to-indigo-600',
    popular: false,
    features: [
      '8 private 1-on-1 sessions/month',
      'All 5 levels including AI tracks',
      'Fully bespoke learning plan',
      'Dedicated tutor + weekly mentor calls',
      'Real-world collaboration projects',
      'Career/scholarship coaching',
      'Priority support',
    ],
    cta: 'Apply Now',
  },
  {
    name: 'Code Prodigy',
    subtitle: 'Qualification-based · Elite',
    price: '$450',
    period: '/month',
    annualNote: '30% discount applied (was $645)',
    color: 'from-amber-400 to-orange-500',
    popular: false,
    badge: 'ELITE',
    features: [
      'Qualification-based entry (assessment required)',
      'Lead instructor mentorship',
      'Hackathons & real-world project showcases',
      'Industry mentor pairing',
      'Scholarship benefits & opportunities',
      'Priority placement network',
      'Certificate + portfolio showcase',
      'Career & university coaching',
    ],
    cta: 'Apply Now',
  },
];

const extras = [
  { name: 'Holiday Bootcamp', price: '$99', desc: '10-day intensive bootcamp. Build a full project, level up fast. Available globally online.', icon: Zap, color: 'from-brand-500 to-purple-600' },
  { name: 'Weekend Sprint', price: '$59', desc: '6-week weekend program. Ideal for busy learners, working teens, and adult learners.', icon: Clock, color: 'from-amber-400 to-orange-500' },
  { name: 'School / Institution', price: 'Custom', desc: 'Curriculum integration, bulk enrollment, teacher training, and co-branded programs.', icon: Users, color: 'from-emerald-400 to-teal-600' },
  { name: 'Mentorship Add-on', price: '+$19/mo', desc: 'Add dedicated 1-on-1 mentorship sessions to any Standard or AI & Product plan.', icon: HeartHandshake, color: 'from-pink-500 to-rose-600' },
];

const comparisons = [
  { feature: 'Group learning sessions', starter: true, standard: true, ai: true, premium: true },
  { feature: '1-on-1 sessions', starter: false, standard: false, ai: false, premium: true },
  { feature: 'AI & ML curriculum', starter: false, standard: false, ai: true, premium: true },
  { feature: 'Product Builder track', starter: false, standard: false, ai: true, premium: true },
  { feature: 'GPT API credits', starter: false, standard: false, ai: true, premium: false },
  { feature: 'Monthly mentor check-in', starter: false, standard: true, ai: true, premium: true },
  { feature: 'Parent dashboard', starter: false, standard: true, ai: true, premium: true },
  { feature: 'Code Prodigy access', starter: false, standard: false, ai: false, premium: true },
];

export default function PricingPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-18 md:pt-32 md:pb-24 noise-overlay text-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Simple, transparent pricing in USD
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Invest in the Future
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            World-class youth education at accessible prices. Pay monthly, annually, or by term.
            No hidden fees. Cancel anytime. <span className="text-white/70">Homeschooling families welcome: sibling discounts stack across multiple children.</span>
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[13px] font-semibold">
            <Shield className="w-4 h-4" />
            Scholarship & installment options available · No credit card required for assessment
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Pricing Cards ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl bg-white p-7 flex flex-col ${
                  pkg.popular
                    ? 'border-2 border-brand-400 shadow-2xl shadow-brand-100 scale-[1.03]'
                    : 'border border-slate-100 shadow-lg'
                }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-5 py-1.5 rounded-full gradient-bg text-white text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                      <Star className="w-3 h-3 fill-white" /> Most Popular
                    </span>
                  </div>
                )}
                {(pkg as any).badge && (
                  <div className="absolute -top-4 right-5">
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg">
                      {(pkg as any).badge}
                    </span>
                  </div>
                )}

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-5 shadow-md`}>
                  <Zap className="w-5.5 h-5.5 text-white" />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{pkg.name}</h3>
                <div className="text-slate-400 text-[12px] mb-5">{pkg.subtitle}</div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {pkg.price}
                  </span>
                  <span className="text-slate-400 text-sm">{pkg.period}</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mb-6">{pkg.annualNote}</div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-slate-600">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-brand-500' : 'text-emerald-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200 ${
                    pkg.popular
                      ? 'btn-primary'
                      : `bg-gradient-to-r ${pkg.color} text-white hover:opacity-90 hover:-translate-y-0.5 shadow-md`
                  }`}>
                  {pkg.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Sibling Discount */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 rounded-2xl bg-gradient-to-r from-brand-50 via-purple-50 to-pink-50 border border-brand-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-[16px] mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Sibling Discount
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enrolling multiple children? Save more with our sibling discount: <strong className="text-slate-700">10% off</strong> the 2nd child, <strong className="text-slate-700">15% off</strong> the 3rd child. Contact us for 4+ children.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-heading mb-4">Plan Comparison</h2>
          </SectionWrapper>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-4 pr-6 text-[13px] font-semibold text-slate-500 w-1/2">Feature</th>
                  {['Starter', 'Standard', 'AI & Product', 'Premium'].map((p) => (
                    <th key={p} className="py-4 px-3 text-[12px] font-bold text-slate-700 text-center">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisons.map(({ feature, starter, standard, ai, premium }, i) => (
                  <motion.tr key={feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                    <td className="py-3.5 pr-6 text-[13px] text-slate-700 font-medium">{feature}</td>
                    {[starter, standard, ai, premium].map((val, j) => (
                      <td key={j} className="py-3.5 px-3 text-center">
                        {val ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                        ) : (
                          <div className="w-4 h-0.5 bg-slate-200 mx-auto rounded" />
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-heading mb-4">Add-Ons & Custom Options</h2>
            <p className="section-subheading mx-auto">Flexible add-ons to supercharge any plan.</p>
          </SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {extras.map(({ name, price, desc, icon: Icon, color }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-[15px]">{name}</h4>
                <div className="text-brand-600 font-extrabold text-xl mb-3">{price}</div>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scholarship ── */}
      <section id="scholarship" className="py-12 sm:py-16 md:py-20 mesh-bg">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <SectionWrapper>
            <div className="section-tag mx-auto mb-5">
              <HeartHandshake className="w-3.5 h-3.5" /> Scholarship & Financial Aid
            </div>
            <h2 className="section-heading mb-5">Geography Should Never Limit Genius</h2>
            <p className="section-subheading mx-auto mb-10">
              We believe every gifted young person: regardless of income, country, or circumstance: deserves access to world-class education.
              Our scholarship program covers 50–100% of fees for qualifying learners globally.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                { icon: Trophy, title: 'Merit Scholarship', desc: 'For learners demonstrating exceptional talent and drive, identified through our free assessment', color: 'bg-amber-100 text-amber-600' },
                { icon: HeartHandshake, title: 'Need-Based Aid', desc: 'For families in regions with currency disadvantage or demonstrated financial hardship', color: 'bg-emerald-100 text-emerald-600' },
                { icon: Globe, title: 'Community Grant', desc: 'For learners from underserved, rural, or underrepresented communities across Africa and globally', color: 'bg-brand-100 text-brand-600' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="premium-card text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-900 mb-1.5 text-[14px]">{title}</div>
                  <div className="text-slate-500 text-[12px] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-primary text-[15px] px-8 py-4">
              Apply for Scholarship <ArrowRight className="w-5 h-5" />
            </Link>
          </SectionWrapper>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-heading mb-4">Pricing FAQs</h2>
          </SectionWrapper>
          <div className="space-y-3">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes. You can upgrade, downgrade, or cancel at any time from your dashboard. Prorated refunds are available for annual plans.' },
              { q: 'Is there a free trial?', a: 'Every new learner gets a free assessment session and a free introductory class before committing to any plan.' },
              { q: 'Do you support currencies other than USD?', a: 'All plans are priced in USD for global consistency. We support international card payments and regional payment methods via Paystack and Flutterwave for African learners.' },
              { q: 'Are group sessions live or recorded?', a: 'All sessions are live with real-time tutor interaction. Sessions are also recorded and available in your dashboard for 30 days.' },
              { q: 'Do you support homeschooling families?', a: 'Yes: homeschoolers are one of our fastest-growing communities. We offer flexible weekday/weekend scheduling, self-paced progression, parent-visible dashboards, and stacking sibling discounts so multi-child homeschool families can enrol affordably. Our curriculum is intentionally designed for cognitive and brain development: strengthening logic, focus, creativity, and problem-solving.' },
            ].map(({ q, a }, i) => (
              <motion.details key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group cursor-pointer open:ring-2 open:ring-brand-200">
                <summary className="flex items-center justify-between font-semibold text-slate-800 cursor-pointer list-none select-none text-[14px]">
                  {q}
                  <CheckCircle2 className="w-5 h-5 text-slate-300 group-open:text-brand-500 transition-colors flex-shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-slate-500 text-[13px] leading-relaxed border-t border-slate-100 pt-3">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
