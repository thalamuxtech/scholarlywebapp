'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, BookOpen, Mic2, Gamepad2,
  Code2, Brain, Trophy, FlaskConical, Globe,
  Sparkles, ArrowRight, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  {
    label: 'Learn',
    href: '/learning-hub',
    mega: true,
    sections: [
      {
        heading: 'Programs',
        items: [
          { label: 'Learning Hub', href: '/learning-hub', desc: 'Coding for all ages — Explorer to Code Prodigy', icon: BookOpen, color: 'text-brand-500 bg-brand-50' },
          { label: 'AI & Product Tracks', href: '/learning-hub#ai-tracks', desc: 'AI Developer (Level 4) · Product Builder (Level 5)', icon: Brain, color: 'text-purple-500 bg-purple-50' },
          { label: 'Code Prodigy', href: '/learning-hub/code-prodigy', desc: 'Elite program for exceptional learners', icon: Trophy, color: 'text-amber-500 bg-amber-50' },
        ],
      },
      {
        heading: 'Resources',
        items: [
          { label: 'Pricing & Packages', href: '/pricing', desc: 'Transparent, flexible plans in USD', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Scholarship & Aid', href: '/pricing#scholarship', desc: 'Access regardless of budget', icon: TrendingUp, color: 'text-rose-500 bg-rose-50' },
        ],
      },
    ],
  },
  {
    label: 'Inspire',
    href: '/spotlight-media',
    mega: true,
    sections: [
      {
        heading: 'Media',
        items: [
          { label: 'Spotlight Media', href: '/spotlight-media', desc: 'Podcasts, stories & thought leadership', icon: Mic2, color: 'text-amber-500 bg-amber-50' },
          { label: 'Thesis Spotlight', href: '/spotlight-media/thesis', desc: 'Research translated into community action', icon: FlaskConical, color: 'text-teal-500 bg-teal-50' },
        ],
      },
    ],
  },
  {
    label: 'Engage',
    href: '/edutainment',
    mega: true,
    sections: [
      {
        heading: 'Products',
        items: [
          { label: 'Edutainment', href: '/edutainment', desc: 'Game shows, challenges, competitions', icon: Gamepad2, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Events', href: '/events', desc: 'Hackathons, bootcamps & global summits', icon: Globe, color: 'text-blue-500 bg-blue-50' },
        ],
      },
    ],
  },
  { label: 'Impact', href: '/impact' },
  { label: 'About', href: '/about' },
];

type MegaSection = { heading: string; items: { label: string; href: string; desc: string; icon: React.ElementType; color: string }[] };
type NavLink = { label: string; href: string; mega?: boolean; sections?: MegaSection[] };

function MegaMenu({ link, onClose }: { link: NavLink; onClose: () => void }) {
  if (!link.sections) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15),0_8px_24px_-8px_rgba(110,66,255,0.08)] border border-slate-100/60 overflow-hidden"
      style={{ width: link.sections.length > 1 ? '560px' : '320px' }}
    >
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #6e42ff, #a855f7, #ec4899)' }} />

      <div className={cn('p-5 grid gap-5', link.sections.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {link.sections.map((section) => (
          <div key={section.heading}>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-3 px-2">
              {section.heading}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-150 group"
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', item.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-400 leading-snug mt-0.5">{item.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-4">
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready to get started?</span>
          <Link
            href="/learning-hub"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:gap-2.5 transition-all duration-200"
          >
            Enroll today <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-0'
          : 'bg-transparent py-0'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className={cn('flex items-center justify-between transition-all duration-500', scrolled ? 'h-16' : 'h-24')}>

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="relative flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: scrolled ? '40px' : '86px',
                height: scrolled ? '40px' : '86px',
                marginTop: scrolled ? '0px' : '28px',
                filter: scrolled ? 'none' : 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
              }}
            >
              <Image
                src="/logo-black.png"
                alt="ScholarlyEcho"
                fill
                className={cn('object-contain transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')}
                priority
              />
              <Image
                src="/logo-white.png"
                alt="ScholarlyEcho"
                fill
                className={cn('object-contain transition-opacity duration-300', scrolled ? 'opacity-0' : 'opacity-100')}
                priority
              />
            </div>
            <div>
              <span
                className={cn(
                  'font-bold text-[17px] tracking-[-0.02em] transition-colors duration-300 block',
                  scrolled ? 'text-slate-900' : 'text-white'
                )}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                ScholarlyEcho
              </span>
              <span className={cn('text-[10px] font-medium tracking-[0.06em] uppercase transition-colors duration-300 block leading-none mt-0.5', scrolled ? 'text-brand-500' : 'text-white/50')}>
                Learn · Inspire · Engage
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((link) => {
              const hasMega = link.mega && link.sections;
              const isActive = activeMenu === link.label;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasMega && handleEnter(link.label)}
                  onMouseLeave={handleLeave}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-1 px-4 py-2 text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 group',
                      scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/75 hover:text-white'
                    )}
                  >
                    {link.label}
                    {hasMega && (
                      <ChevronDown className={cn('w-3 h-3 transition-transform duration-200 opacity-60', isActive ? 'rotate-180' : '')} />
                    )}
                    {/* Underline hover effect */}
                    <span className={cn(
                      'absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left',
                      scrolled ? 'bg-brand-500' : 'bg-white'
                    )} />
                  </Link>

                  <AnimatePresence>
                    {hasMega && isActive && (
                      <MegaMenu link={link} onClose={() => setActiveMenu(null)} />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* ── CTA Area ── */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={cn(
                'hidden lg:inline-flex items-center text-[13px] font-medium px-3 py-2 rounded-lg transition-all duration-200',
                scrolled ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-white/65 hover:text-white hover:bg-white/10'
              )}
            >
              Sign In
            </Link>

            <Link
              href="/learning-hub"
              className={cn(
                'hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-250',
                scrolled
                  ? 'gradient-bg text-white shadow-[0_4px_16px_rgba(110,66,255,0.3)] hover:shadow-[0_8px_24px_rgba(110,66,255,0.4)] hover:-translate-y-0.5'
                  : 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-white hover:bg-white/[0.14]'
              )}
            >
              Enroll Free
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors',
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-slate-100 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-800 font-semibold text-[15px] hover:bg-brand-50 hover:text-brand-600 transition-colors active:bg-brand-100"
                  >
                    {link.label}
                  </Link>
                  {link.sections && (
                    <div className="ml-3 mt-0.5 space-y-0.5 mb-1 pb-1 border-b border-slate-50">
                      {link.sections.flatMap((s) => s.items).map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 text-[13px] hover:bg-slate-50 hover:text-brand-600 transition-colors active:bg-slate-100"
                          >
                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', item.color)}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-700">{item.label}</div>
                              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 pb-2 border-t border-slate-100 flex flex-col gap-2.5">
                <Link href="/learning-hub" onClick={() => setMobileOpen(false)}
                  className="btn-primary justify-center text-[14px] py-3.5">
                  Enroll Free
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)}
                  className="btn-secondary justify-center text-[14px] py-3.5">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
