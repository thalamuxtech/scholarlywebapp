'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartHandshake, Trophy, Users, Globe, Sparkles, ArrowRight,
  CheckCircle2, Loader2, User, Mail, Phone, Home, BookOpen, MessageCircle
} from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { COUNTRIES } from '@/lib/locations';

const TYPES = [
  { icon: Trophy, title: 'Merit Scholarship', desc: 'For learners showing exceptional talent and drive in our free assessment.', color: 'from-amber-400 to-orange-500' },
  { icon: HeartHandshake, title: 'Need-Based Aid', desc: 'Income-sensitive support so financial hardship never blocks a curious mind.', color: 'from-emerald-400 to-teal-500' },
  { icon: Users, title: 'Sibling & Homeschool Discount', desc: 'Stacking discounts for multi-child families and homeschool co-ops.', color: 'from-brand-400 to-purple-500' },
  { icon: Globe, title: 'Regional Partner Discounts', desc: 'Targeted support for learners in underserved regions and partner schools.', color: 'from-pink-400 to-rose-500' },
];

const REASON_OPTIONS = [
  'Merit scholarship (talent-based)',
  'Need-based financial aid',
  'Sibling discount (multiple children)',
  'Homeschool family discount',
  'Regional / partner school discount',
  'Other / not sure yet',
];

const HOUSEHOLD_OPTIONS = [
  'Under $1,000 / month',
  '$1,000–$3,000 / month',
  '$3,000–$6,000 / month',
  'Above $6,000 / month',
  'Prefer not to say',
];

type Status = 'idle' | 'loading' | 'success';

export default function ScholarshipDiscountPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.reason) {
      showToast('error', 'Please tell us which type of support you are applying for.');
      return;
    }
    setStatus('loading');
    const payload: Record<string, string> = { ...data, program: 'Scholarship & Discount Application' };
    const result = await submitForm('scholarship-discount', payload);
    if (result.success) {
      setStatus('success');
      showToast('success', "Application received! We'll respond within 3 working days.");
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  const inputBase = 'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm bg-white';

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pb-24 noise-overlay overflow-hidden text-center"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-[10%] left-[10%] w-[480px] h-[480px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }} />
        <div className="absolute bottom-[5%] right-[10%] w-[380px] h-[380px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 text-[13px] font-semibold mb-6">
            <HeartHandshake className="w-3.5 h-3.5" /> Scholarship & Discount Programme
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Talent should never be priced out
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            We offer merit scholarships, need-based aid, sibling and homeschool discounts, and regional support: covering 20–100% of fees for qualifying learners.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 50%, transparent 100%)' }} />
      </section>

      {/* ── Types ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Four ways we help
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Pick the option that best matches your family. Not sure? Apply and we will guide you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TYPES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-white p-6 border border-slate-100 hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-slate-900 mb-2 text-[15px]">{title}</div>
                <div className="text-slate-500 text-[13px] leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="apply" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[12px] font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Application takes about 3 minutes
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Apply for Scholarship or Discount
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Tell us a little about your family and the kind of support you need. We respond within 3 working days.
            </p>
          </div>

          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center mb-5 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Application received</h3>
              <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
                Thank you. Our admissions team will review your application and email you within 3 working days.
              </p>
              <Link href="/" className="btn-primary text-[14px] px-6 py-3 inline-flex">
                Back to Home <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">

              {/* Parent name */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Parent / Guardian Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" required value={data.parentName || ''}
                    onChange={(e) => setData({ ...data, parentName: e.target.value })}
                    placeholder="Full name" className={inputBase} />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="email" required value={data.email || ''}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="you@example.com" className={inputBase} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone (with country code)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="tel" required value={data.phone || ''}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      placeholder="+1 555 123 4567" className={inputBase} />
                  </div>
                </div>
              </div>

              {/* Country + Children */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Country</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select required value={data.country || ''}
                      onChange={(e) => setData({ ...data, country: e.target.value })}
                      className={inputBase}>
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Number of children to enrol</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select required value={data.childrenCount || ''}
                      onChange={(e) => setData({ ...data, childrenCount: e.target.value })}
                      className={inputBase}>
                      <option value="">Select</option>
                      <option value="1">1 child</option>
                      <option value="2">2 children</option>
                      <option value="3">3 children</option>
                      <option value="4+">4 or more</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Child age range */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Child / Children age range</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" required value={data.childAges || ''}
                    onChange={(e) => setData({ ...data, childAges: e.target.value })}
                    placeholder="e.g. 8 and 11" className={inputBase} />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">What support are you applying for?</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {REASON_OPTIONS.map((opt) => {
                    const active = data.reason === opt;
                    return (
                      <button type="button" key={opt}
                        onClick={() => setData({ ...data, reason: opt })}
                        className={`text-left px-4 py-3 rounded-xl border-2 text-[13px] transition-all ${
                          active
                            ? 'border-brand-400 bg-brand-50 text-brand-700 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Household */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Approximate household income (optional, used only to assess need)</label>
                <select value={data.household || ''}
                  onChange={(e) => setData({ ...data, household: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 text-sm bg-white">
                  <option value="">Select range</option>
                  {HOUSEHOLD_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Story */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Tell us briefly about your child and why this matters</label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                  <textarea required rows={4} value={data.story || ''}
                    onChange={(e) => setData({ ...data, story: e.target.value })}
                    placeholder="Their interests, what they have already tried, why this opportunity matters to your family."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm bg-white resize-none" />
                </div>
              </div>

              <button type="submit" disabled={status === 'loading'}
                className="w-full btn-primary justify-center text-[15px] py-4 group">
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <>Submit application <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </button>

              <p className="text-[12px] text-slate-400 text-center pt-1">
                By submitting you agree to our <Link href="/privacy" className="text-brand-500 hover:underline">privacy policy</Link>. We never share your data.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
