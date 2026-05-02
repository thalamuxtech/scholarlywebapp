'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  School, BookOpen, Trophy, Zap, Users, CheckCircle2,
  ArrowRight, Calendar, Sparkles, Rocket, Globe, Loader2,
  Mail, Phone, MapPin, User, GraduationCap
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { CourseStack } from '@/components/TechLogos';

const programs = [
  {
    title: 'Summer Coding Bootcamp',
    duration: '4–8 weeks',
    desc: 'Intensive project-based coding program during summer break. Students build real projects from scratch to deployment with a final challenge showcase.',
    icon: Zap,
    color: 'from-brand-500 to-purple-600',
    features: ['Ages 5–18 · All skill levels', 'Scratch, Python, App Inventor, AI tracks', 'Final project challenge + showcase', 'Certificates & awards ceremony'],
  },
  {
    title: 'After-School Coding Program',
    duration: 'Term-based (10–14 weeks)',
    desc: 'Weekly project-based sessions integrated into the school calendar. Students progress through our Coders Ladder building portfolio-ready projects.',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    features: ['1–2 sessions per week', 'Curriculum-aligned projects', 'Monthly parent progress reports', 'End-of-term project presentation'],
  },
  {
    title: 'Holiday Intensive',
    duration: '1–2 weeks',
    desc: 'Short intensive program during school holidays. Students complete a full project cycle: from idea to working prototype: in a fast-paced, fun environment.',
    icon: Rocket,
    color: 'from-amber-500 to-orange-500',
    features: ['Easter, mid-term & Christmas breaks', 'Build & present a complete project', 'Team challenges & hackathon format', 'Industry guest speakers'],
  },
  {
    title: 'Custom School Partnership',
    duration: 'Flexible',
    desc: 'Tailored project-based coding curriculum integrated into your school. Co-branded programs, teacher training, and dedicated ScholarlyEcho instructor support.',
    icon: School,
    color: 'from-purple-500 to-pink-500',
    features: ['Custom curriculum design', 'On-site or virtual delivery', 'Teacher training & capacity building', 'Co-branded certification'],
  },
];

const benefits = [
  { icon: Trophy, title: 'Project-Based Learning', desc: 'Every program ends with students presenting real projects they built: apps, websites, AI tools, and games.' },
  { icon: GraduationCap, title: 'Final Challenge', desc: 'Each program culminates in a challenge or hackathon where students compete, collaborate, and showcase their work.' },
  { icon: Users, title: 'Small Groups', desc: 'Classes of 5–20 students ensure personalized attention. Every student gets hands-on support from certified instructors.' },
  { icon: Globe, title: 'Global Curriculum', desc: 'Our 5-level Coders Ladder is trusted by schools and homeschooling families across 5+ countries. Project-based, age-appropriate, and constantly updated.' },
  { icon: Sparkles, title: 'Certified Instructors', desc: 'Google CS-First certified instructors with 12+ years of coding education experience and advanced CS/AI degrees.' },
  { icon: Calendar, title: 'Flexible Scheduling', desc: 'Programs designed around school calendars: summer, term-time, holidays, or custom schedules.' },
];

export default function SchoolBookingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', school: '', role: '', students: '', program: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const result = await submitForm('contact', { ...formData, subject: 'School Booking' });
    if (result.success) {
      setStatus('success');
      showToast('success', 'Booking inquiry submitted! We\'ll respond within 24 hours.');
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 65%)' }} />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] mb-6">
            <School className="w-3.5 h-3.5 text-emerald-400" /> School Programs · Project-Based Learning
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-[1.15] tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Bring <span className="gradient-text-animated">Project-Based Coding</span> to Your School
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/40 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Bootcamps, after-school programs, and custom partnerships: every program ends with students presenting real projects they built.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#booking-form" className="btn-primary text-[15px] px-8 py-4">
              Book a Program <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/12 text-white/70 font-semibold hover:bg-white/[0.06] transition-all">
              View Pricing
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(16,185,129,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* Programs */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <BookOpen className="w-3.5 h-3.5" /> Available Programs
            </div>
            <h2 className="section-heading mb-4">Choose a Program for Your <span className="gradient-text">School</span></h2>
            <p className="section-subheading mx-auto">Every program is project-based with a final challenge where students present what they built.</p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 gap-5">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div key={prog.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="premium-card group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${prog.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prog.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500 flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{prog.title}</h3>
                      <span className="text-xs text-slate-400 font-medium">{prog.duration}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{prog.desc}</p>
                  <ul className="space-y-2">
                    {prog.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools / Tech Logos: full curriculum */}
      <section className="py-14 sm:py-18 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-[-0.02em] mb-2"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              The full stack we bring to your school
            </h3>
            <p className="text-slate-500 text-[13.5px] sm:text-[14.5px] max-w-xl mx-auto">
              From block coding for the youngest students to AI, mobile app development, and desktop builds for older cohorts.
            </p>
          </SectionWrapper>
          <CourseStack theme="light" />
          <div className="mt-8 text-center text-[13px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-amber-500" />
            We also accept <span className="font-bold text-slate-700">specialized curriculum requests</span> tailored to your school&apos;s needs.
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 md:py-24 mesh-bg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Trophy className="w-3.5 h-3.5" /> Why Schools Choose Us
            </div>
            <h2 className="section-heading mb-4">Project-Based. <span className="gradient-text">Results-Driven.</span></h2>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="premium-card group">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <SectionWrapper className="text-center mb-10">
            <div className="section-tag mx-auto mb-5">
              <Mail className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h2 className="section-heading mb-4">Book a Program for Your School</h2>
            <p className="section-subheading mx-auto">Fill out the form below and our team will respond within 24 hours with a tailored proposal.</p>
          </SectionWrapper>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Inquiry Submitted!</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Thank you for your interest. Our school partnerships team will respond within 24 hours.</p>
                <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', phone: '', school: '', role: '', students: '', program: '', message: '' }); }}
                  className="btn-primary">Submit Another Inquiry <ArrowRight className="w-4 h-4" /></button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Your Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@school.edu"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 8900"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">School Name *</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" required value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} placeholder="School / Institution name"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Your Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors bg-white">
                      <option value="">Select...</option>
                      <option>Principal / Head Teacher</option>
                      <option>Administrator</option>
                      <option>Teacher / STEM Coordinator</option>
                      <option>Parent (PTA)</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Program Interest</label>
                    <select value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors bg-white">
                      <option value="">Select...</option>
                      <option>Summer Coding Bootcamp</option>
                      <option>After-School Coding Program</option>
                      <option>Holiday Intensive</option>
                      <option>Custom School Partnership</option>
                      <option>Not sure: advise me</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Estimated Number of Students</label>
                  <input type="text" value={formData.students} onChange={(e) => setFormData({ ...formData, students: e.target.value })} placeholder="e.g. 20–50 students"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Additional Details</label>
                  <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your school, any specific requirements, preferred dates, etc."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none" />
                </div>
                <motion.button type="submit" disabled={status === 'loading'} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl gradient-bg text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(110,66,255,0.35)] hover:shadow-[0_8px_30px_rgba(110,66,255,0.5)] hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2.5">
                  {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Booking Inquiry <ArrowRight className="w-5 h-5" /></>}
                </motion.button>
                <p className="text-center text-xs text-slate-400">We typically respond within 24 hours with a tailored proposal.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
