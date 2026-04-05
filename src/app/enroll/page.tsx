'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Mic2, Brain, Trophy, ArrowRight, CheckCircle2,
  User, Mail, Phone, MapPin, GraduationCap, Loader2, Sparkles
} from 'lucide-react';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';

const programs = [
  {
    id: 'learning-hub',
    icon: BookOpen,
    title: 'Learning Hub',
    subtitle: 'Coding & Tech Education',
    desc: 'Enroll in our 5-level Coders Ladder — from Scratch to building real SaaS products.',
    color: 'from-brand-500 to-purple-600',
    light: 'bg-brand-50 text-brand-600 border-brand-100',
    fields: ['name', 'email', 'phone', 'dob', 'country', 'state', 'plan', 'level', 'priorExperience', 'siblings'],
  },
  {
    id: 'inspire-media',
    icon: Mic2,
    title: 'Inspire Media',
    subtitle: 'Spotlight & Podcast',
    desc: 'Apply to be featured on the Edu Spotlight Podcast or Thesis Spotlight series.',
    color: 'from-amber-400 to-orange-500',
    light: 'bg-amber-50 text-amber-600 border-amber-100',
    fields: ['name', 'email', 'phone', 'topic', 'bio'],
  },
  {
    id: 'ai-assessment',
    icon: Brain,
    title: 'Free AI Track Assessment',
    subtitle: 'AI Developer & Product Builder',
    desc: 'Take a free assessment to determine your readiness for our AI Developer or Product Builder tracks.',
    color: 'from-pink-500 to-rose-500',
    light: 'bg-rose-50 text-rose-600 border-rose-100',
    fields: ['name', 'email', 'phone', 'dob', 'priorExperience', 'experience'],
  },
  {
    id: 'code-prodigy',
    icon: Trophy,
    title: 'Code Prodigy',
    subtitle: 'Elite Application',
    desc: 'Apply to our elite program for exceptional learners — hackathons, industry mentors, and real projects.',
    color: 'from-amber-400 to-orange-500',
    light: 'bg-amber-50 text-amber-700 border-amber-100',
    fields: ['name', 'email', 'phone', 'dob', 'country', 'state', 'priorExperience', 'portfolio', 'motivation'],
  },
];

const fieldConfig: Record<string, { label: string; type: string; placeholder: string; icon: React.ElementType; rows?: number }> = {
  name: { label: 'Full Name', type: 'text', placeholder: 'Your full name', icon: User },
  email: { label: 'Email Address', type: 'email', placeholder: 'your@email.com', icon: Mail },
  phone: { label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900', icon: Phone },
  dob: { label: 'Date of Birth', type: 'date', placeholder: '', icon: GraduationCap },
  country: { label: 'Country', type: 'text', placeholder: 'e.g. United States, Nigeria, UK', icon: MapPin },
  state: { label: 'State / Region', type: 'text', placeholder: 'e.g. Maryland, Lagos', icon: MapPin },
  plan: { label: 'Pricing Plan', type: 'select', placeholder: '', icon: Sparkles },
  level: { label: 'Preferred Level', type: 'select', placeholder: '', icon: GraduationCap },
  priorExperience: { label: 'Prior Coding Experience', type: 'select', placeholder: '', icon: Brain },
  siblings: { label: 'Number of Siblings Enrolling', type: 'select', placeholder: '', icon: User },
  topic: { label: 'Topic / Research Area', type: 'text', placeholder: 'e.g. AI in Education, Public Health', icon: Sparkles },
  bio: { label: 'Short Bio / Background', type: 'textarea', placeholder: 'Tell us about yourself and your work...', icon: User, rows: 3 },
  experience: { label: 'AI/Tech Readiness', type: 'select', placeholder: '', icon: Brain },
  portfolio: { label: 'Portfolio / GitHub URL', type: 'url', placeholder: 'https://github.com/yourname', icon: Sparkles },
  motivation: { label: 'Why Code Prodigy?', type: 'textarea', placeholder: 'Why do you want to join the elite program? What are you building?', icon: Sparkles, rows: 4 },
};

const planOptions = ['Starter — $75/mo (1 session/week)', 'Standard — $200/mo (2 sessions/week)', 'Premium 1-on-1 — $350/mo', 'Code Prodigy — $450/mo (Elite)', 'Not sure — help me choose'];
const priorExpOptions = ['No prior experience', 'Scratch / block-based coding', 'Basic Python or JavaScript', 'HTML/CSS websites', 'Built apps or projects before', 'Comfortable with multiple languages'];
const siblingOptions = ['Just me (no siblings)', '1 sibling (10% off 2nd child)', '2 siblings (10% + 15% off)', '3+ siblings (contact us)'];

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const levelOptions = ['Explorer (Ages 5–10)', 'Builder (Ages 10–13)', 'Creator (Ages 13–16)', 'AI Developer (Ages 14+)', 'Product Builder (Ages 16+)'];
const experienceOptions = ['Complete beginner', 'Basic HTML/CSS', 'Comfortable with Python/JS', 'Built apps/projects before', 'Professional developer'];

export default function EnrollPage() {
  const [active, setActive] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    setStatus('loading');
    const data: Record<string, string> = { program: active, ...formData };
    if (data.dob) { data.age = String(calculateAge(data.dob)); }
    const result = await submitForm('enrollment', data);
    if (result.success) {
      setStatus('success');
      showToast('success', 'Application submitted! We\'ll be in touch within 48 hours.');
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  const reset = () => {
    setActive(null);
    setFormData({});
    setStatus('idle');
  };

  const program = programs.find((p) => p.id === active);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" /> Enrollment
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Choose Your <span className="gradient-text-animated">Path</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/40 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Select a program below to get started. Each form takes less than 2 minutes.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* Programs / Form */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              /* ── Success State ── */
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Application Submitted!
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-slate-500 mb-8 max-w-md mx-auto">
                  Thank you for your interest in {program?.title}. Our team will review your application and reach out within 48 hours.
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={reset} className="btn-primary">
                    Apply for Another Program <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/" className="btn-secondary">Back to Home</Link>
                </motion.div>
              </motion.div>
            ) : !active ? (
              /* ── Program Selection ── */
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  {programs.map((prog, i) => {
                    const Icon = prog.icon;
                    return (
                      <motion.button key={prog.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => { setActive(prog.id); setFormData({}); }}
                        className="premium-card text-left group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${prog.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prog.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-500`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">{prog.subtitle}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{prog.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">{prog.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all duration-300">
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setActive(null); setFormData({}); }}
                  className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1.5 transition-colors">
                  ← Back to programs
                </button>

                {program && (() => {
                  const Icon = program.icon;
                  return (
                    <div className="max-w-lg mx-auto">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {program.title}
                          </h2>
                          <p className="text-slate-400 text-sm">{program.subtitle}</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        {program.fields.filter((k) => k !== 'state').map((key, i) => {
                          const field = fieldConfig[key];
                          if (!field) return null;
                          const FIcon = field.icon;

                          // Country + State side by side
                          if (key === 'country' && program.fields.includes('state')) {
                            const stateField = fieldConfig['state'];
                            return (
                              <motion.div key="country-state" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">{field.label}</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input type="text" value={formData.country || ''} required
                                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                      placeholder={field.placeholder}
                                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">{stateField.label}</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input type="text" value={formData.state || ''} required
                                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                      placeholder={stateField.placeholder}
                                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm" />
                                  </div>
                                </div>
                              </motion.div>
                            );
                          }

                          return (
                            <motion.div key={key}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}>
                              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">{field.label}</label>
                              {field.type === 'select' ? (
                                <select value={formData[key] || ''} required
                                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-700 text-sm bg-white">
                                  <option value="">Select...</option>
                                  {(key === 'plan' ? planOptions : key === 'level' ? levelOptions : key === 'priorExperience' ? priorExpOptions : key === 'siblings' ? siblingOptions : experienceOptions).map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : field.type === 'textarea' ? (
                                <textarea value={formData[key] || ''} required rows={field.rows || 3}
                                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm resize-none" />
                              ) : (
                                <div className="relative">
                                  <FIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                  <input type={field.type} value={formData[key] || ''}
                                    required={!field.label.includes('optional')}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    placeholder={field.placeholder}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-brand-400 transition-colors text-slate-800 placeholder:text-slate-300 text-sm" />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}

                        <motion.button type="submit" disabled={status === 'loading'}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                          className={`w-full py-4 rounded-xl font-bold text-white text-[15px] bg-gradient-to-r ${program.color} shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5`}>
                          {status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Submit Application <ArrowRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
