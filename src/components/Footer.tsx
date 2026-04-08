'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Twitter, Instagram, Youtube, Linkedin, Facebook,
  Mail, MapPin, Heart, Globe, Brain, BookOpen, Lock
} from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

const footerLinks = {
  Learn: [
    { label: 'Learning Hub', href: '/learning-hub' },
    { label: 'AI & Product Tracks', href: '/learning-hub#ai-tracks' },
    { label: 'Code Prodigy', href: '/learning-hub/code-prodigy' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Scholarship & Aid', href: '/pricing#scholarship' },
  ],
  Inspire: [
    { label: 'Spotlight Media', href: '/spotlight-media' },
    { label: 'Thesis Spotlight', href: '/spotlight-media/thesis' },
    { label: 'Blog & Resources', href: '/blog' },
    { label: 'Guest Applications', href: '/spotlight-media#apply' },
  ],
  Engage: [
    { label: 'Edutainment', href: '/edutainment' },
    { label: 'Events & Hackathons', href: '/events' },
    { label: 'Sezwor Mode Waitlist', href: '/edutainment#sezwor' },
    { label: 'School Bookings', href: '/school-booking' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Impact', href: '/impact' },
    { label: 'Contact', href: '/contact' },
    { label: 'Partner With Us', href: '/contact#partner' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press', href: '/about#press' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter/X' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

const regions = ['Africa', 'North America', 'Europe', 'Asia Pacific'];

export default function Footer() {
  return (
    <footer className="text-slate-300 pt-20 pb-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070c1b 0%, #0a0f20 50%, #080d1c 100%)' }}>
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.2) 30%, rgba(168,85,247,0.3) 50%, rgba(236,72,153,0.2) 70%, transparent 100%)' }} />
      {/* Subtle bg orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">

        {/* ── Newsletter CTA Banner ── */}
        <div className="mb-16 rounded-3xl p-8 md:p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3a15b0 0%, #6e42ff 30%, #a855f7 65%, #ec4899 100%)' }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(16,185,129,0.12) 0%, transparent 50%)' }} />
          {/* Inner border */}
          <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />
          {/* Floating dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 30}%` }}
              animate={{ y: [-8, 8, -8], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/80 text-xs font-semibold mb-3">
                <Globe className="w-3 h-3" /> Serving 20+ countries globally
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Stay ahead of the curve
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Programs, scholarships, research spotlights, and opportunities — delivered to your inbox weekly.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <NewsletterForm variant="light" />
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 mb-14">

          {/* Brand Column */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image src="/logo-white.png" alt="ScholarlyEcho" fill className="object-contain" />
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ScholarlyEcho
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-full sm:max-w-[280px]">
              A knowledge-first global youth empowerment ecosystem. Disrupting education globally — one learner at a time.
            </p>

            {/* Global reach */}
            <div className="flex flex-wrap gap-2 mb-5">
              {regions.map((r) => (
                <span key={r} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-[11px] font-medium">
                  {r}
                </span>
              ))}
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Maryland, United States</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:scholarlyechos@gmail.com" className="hover:text-white transition-colors">
                  scholarlyechos@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Globe className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Global · Online-first</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-[11px] uppercase tracking-[0.1em]">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 text-[13px] hover:text-white transition-all duration-200 inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider with badges ── */}
        <div className="border-t border-slate-800 pt-8 mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              { icon: BookOpen, label: 'Accredited Programs', color: 'text-brand-400' },
              { icon: Brain, label: 'AI-Ready Curriculum', color: 'text-purple-400' },
              { icon: Globe, label: 'Global Community', color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <Icon className={cn('w-3.5 h-3.5', color)} />
                <span className="text-slate-400 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-[12px]">
            <span>© 2026 ScholarlyEcho Inc. Crafted with</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>for the world's youth.</span>
          </div>

          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-brand-600 hover:text-white transition-all duration-200 hover:scale-105"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <Link href="/admin/login" aria-label="Admin"
              className="ml-3 text-slate-700 hover:text-slate-400 transition-colors duration-200">
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/child-safety" className="hover:text-slate-300 transition-colors">Child Safety</Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
