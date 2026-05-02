'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail, MessageSquare, School, Mic2,
  Handshake, Send, CheckCircle2, ArrowRight, Sparkles,
  Globe, Brain, Clock, Users, Building2, FlaskConical
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { COUNTRIES, US_STATES, US_COUNTRY, OTHER_OPTION } from '@/lib/locations';

const inquiryTypes = [
  { id: 'enrollment', label: 'Program Enrollment', icon: CheckCircle2, desc: 'Enroll a learner or get a free assessment' },
  { id: 'ai-track', label: 'AI / Product Track', icon: Brain, desc: 'Enquire about the AI Developer (Level 4) or Product Builder (Level 5) tracks' },
  { id: 'school', label: 'School / Institution', icon: School, desc: 'Bulk enrollment, curriculum integration, or event booking' },
  { id: 'research', label: 'Research / Media', icon: FlaskConical, desc: 'Thesis spotlight application or media collaboration' },
  { id: 'partner', label: 'Partnership / Sponsorship', icon: Handshake, desc: 'Corporate, NGO, or government partnerships' },
  { id: 'general', label: 'General Inquiry', icon: MessageSquare, desc: 'Any other question or feedback' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState('enrollment');
  const [formData, setFormData] = useState<Record<string, string>>({ role: 'Parent / Guardian' });
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const countrySel = formData.countrySelect || '';
  const isCountryOther = countrySel === OTHER_OPTION;
  const isUS = countrySel === US_COUNTRY;
  const stateSel = formData.stateSelect || '';
  const isStateOther = stateSel === OTHER_OPTION;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { countrySelect, stateSelect, countryOther, stateOther, ...clean } = formData;
    void countrySelect; void stateSelect; void countryOther; void stateOther;
    const result = await submitForm('contact', { ...clean, subject: selectedType });
    setSending(false);
    if (result.success) {
      setSubmitted(true);
      setFormData({ role: 'Parent / Guardian' });
      showToast('success', 'Message sent! Our team will respond within 24–48 hours.');
    } else {
      showToast('error', result.error || 'Failed to send. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-18 md:pt-32 md:pb-24 noise-overlay overflow-hidden" style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[13px] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> We respond within 24 hours globally
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Let's Build Together
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Enrollment, partnerships, research, events, sponsorships, school bookings: we're here for all of it.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Contact Grid ── */}
      <section className="py-14 sm:py-18 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 lg:gap-14">

            {/* Left: Info */}
            <div className="space-y-7">
              <SectionWrapper>
                <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  How to Reach Us
                </h2>

                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'General', value: 'scholarlyechos@gmail.com', href: 'mailto:scholarlyechos@gmail.com', color: 'bg-brand-100 text-brand-600' },
                    { icon: Globe, label: 'Operations', value: 'Online-first · Global reach', href: '#', color: 'bg-emerald-100 text-emerald-600' },
                  ].map(({ icon: Icon, label, value, href, color }) => (
                    <a key={label} href={href}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</div>
                        <div className="text-slate-800 font-semibold text-[13px] group-hover:text-brand-600 transition-colors">{value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </SectionWrapper>

              <SectionWrapper delay={0.1}>
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <div className="font-bold text-slate-900 mb-4 text-[14px]">Response Times</div>
                  <div className="space-y-3">
                    {[
                      { t: 'Enrollment requests', v: 'Within 6 hrs', color: 'text-emerald-600' },
                      { t: 'General inquiries', v: 'Within 24 hrs', color: 'text-brand-600' },
                      { t: 'School partnerships', v: 'Within 48 hrs', color: 'text-amber-600' },
                      { t: 'Scholarship applications', v: '3–5 business days', color: 'text-slate-600' },
                    ].map(({ t, v, color }) => (
                      <div key={t} className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-500">{t}</span>
                        <span className={`font-bold ${color}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>

              <SectionWrapper delay={0.2}>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7)' }}>
                  <div className="p-5">
                    <Brain className="w-8 h-8 text-white/80 mb-3" />
                    <div className="text-white font-bold text-[14px] mb-1.5">Free AI Track Assessment</div>
                    <div className="text-white/65 text-[12px] leading-relaxed mb-4">
                      Not sure which AI track is right for your learner? Book a free 20-min assessment call with our team.
                    </div>
                    <Link href="/contact" className="inline-flex items-center gap-1.5 text-white font-bold text-[12px] hover:gap-2.5 transition-all">
                      Book free assessment <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </SectionWrapper>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-16 rounded-3xl bg-slate-50 border border-slate-200">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-sm text-[14px] leading-relaxed">
                    Thank you for reaching out to ScholarlyEcho. Our team will respond within the timeframe shown on the left.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleContactSubmit}
                  className="space-y-6"
                >
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      What are you reaching out about? *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {inquiryTypes.map(({ id, label, icon: Icon, desc }) => (
                        <button key={id} type="button" onClick={() => setSelectedType(id)}
                          className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                            selectedType === id
                              ? 'border-brand-400 bg-brand-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}>
                          <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selectedType === id ? 'text-brand-600' : 'text-slate-400'}`} />
                          <div>
                            <div className={`font-semibold text-[13px] ${selectedType === id ? 'text-brand-700' : 'text-slate-700'}`}>{label}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Full Name *</label>
                      <input required type="text" placeholder="Your full name" value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email *</label>
                      <input required type="email" placeholder="your@email.com" value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                    </div>
                  </div>

                  {/* Phone + Role */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone (WhatsApp ok)</label>
                      <input type="tel" placeholder="+1 234 567 8900" value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">You are a...</label>
                      <select value={formData.role || 'Parent / Guardian'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-[14px] bg-white appearance-none cursor-pointer">
                        <option>Parent / Guardian</option>
                        <option>Student (self-enrolling)</option>
                        <option>Teacher / Educator</option>
                        <option>School Administrator</option>
                        <option>Researcher / Academic</option>
                        <option>Corporate / NGO Partner</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Country + State */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Country *</label>
                      <select required value={countrySel}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData({
                            ...formData,
                            countrySelect: v,
                            country: v === OTHER_OPTION ? (formData.countryOther || '') : v,
                            stateSelect: '', state: '', stateOther: '',
                          });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-[14px] bg-white appearance-none cursor-pointer">
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value={OTHER_OPTION}>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5">State / Region</label>
                      {isUS ? (
                        <select value={stateSel}
                          onChange={(e) => {
                            const v = e.target.value;
                            setFormData({ ...formData, stateSelect: v, state: v === OTHER_OPTION ? (formData.stateOther || '') : v });
                          }}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-[14px] bg-white appearance-none cursor-pointer">
                          <option value="">Select state...</option>
                          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          <option value={OTHER_OPTION}>Other</option>
                        </select>
                      ) : (
                        <input type="text" placeholder="e.g. Lagos, London" value={formData.state || ''}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value, stateOther: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                      )}
                    </div>
                  </div>
                  {isCountryOther && (
                    <div>
                      <input type="text" required placeholder="Enter your country" value={formData.countryOther || ''}
                        onChange={(e) => setFormData({ ...formData, countryOther: e.target.value, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                    </div>
                  )}
                  {isUS && isStateOther && (
                    <div>
                      <input type="text" required placeholder="Enter your state" value={formData.stateOther || ''}
                        onChange={(e) => setFormData({ ...formData, stateOther: e.target.value, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-[14px]" />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Message *</label>
                    <textarea required rows={5} placeholder="Tell us what you need, and we'll find the best path forward..."
                      value={formData.message || ''} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 resize-none text-[14px]" />
                  </div>

                  <button type="submit" disabled={sending}
                    className="w-full btn-primary justify-center py-4 text-[15px] font-bold disabled:opacity-60">
                    {sending ? 'Sending...' : <>Send Message <Send className="w-5 h-5" /></>}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    By submitting you agree to our{' '}
                    <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
                    We never share your data or spam you.
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Section ── */}
      <section id="partner" className="py-14 sm:py-18 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Handshake className="w-3.5 h-3.5" /> Partner With Us
            </div>
            <h2 className="section-heading mb-5">Build Africa & the World's Future Together</h2>
            <p className="section-subheading mx-auto">
              We partner with schools, NGOs, corporate sponsors, governments, and researchers who share our vision
              for a generation of capable, confident, globally-minded young people.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: School, title: 'Schools & Universities', desc: 'Integrate our coding and AI curriculum. Bulk enrollment, teacher training, and co-branded certification programs.', color: 'bg-brand-100 text-brand-600' },
              { icon: Building2, title: 'Corporate & CSR', desc: 'Sponsor learners, co-brand programs, or fund community hackathons as part of your ESG and CSR strategy.', color: 'bg-amber-100 text-amber-600' },
              { icon: Globe, title: 'Governments & NGOs', desc: 'National youth tech programs, digital literacy drives, and community development collaboration.', color: 'bg-emerald-100 text-emerald-600' },
              { icon: Mic2, title: 'Media & Content', desc: 'Co-create podcast series, research spotlights, and story campaigns that inspire youth globally.', color: 'bg-purple-100 text-purple-600' },
              { icon: FlaskConical, title: 'Research Partners', desc: 'Connect academic research to real-world implementation through our Thesis Spotlight platform.', color: 'bg-teal-100 text-teal-600' },
              { icon: Users, title: 'Community Leaders', desc: 'Bring ScholarlyEcho programs to your community: we provide resources, training, and support.', color: 'bg-rose-100 text-rose-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1.5 text-[14px]">{title}</h4>
                <p className="text-slate-500 text-[12px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
