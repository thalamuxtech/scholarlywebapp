'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Learn', href: '/learning-hub' },
  { label: 'Inspire', href: '/spotlight-media' },
  { label: 'Engage', href: '/edutainment' },
  { label: 'Impact', href: '/impact' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className={cn('flex items-center justify-between transition-all duration-500', scrolled ? 'h-16' : 'h-24')}>

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="relative flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: scrolled ? '40px' : '76px',
                height: scrolled ? '40px' : '76px',
                marginTop: scrolled ? '0px' : '24px',
                filter: scrolled ? 'none' : 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
              }}
            >
              <Image src="/logo-black.png" alt="ScholarlyEcho" fill
                className={cn('object-contain transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')} priority />
              <Image src="/logo-white.png" alt="ScholarlyEcho" fill
                className={cn('object-contain transition-opacity duration-300', scrolled ? 'opacity-0' : 'opacity-100')} priority />
            </div>
            <div>
              <span className={cn('font-bold text-[17px] tracking-[-0.02em] transition-colors duration-300 block',
                scrolled ? 'text-slate-900' : 'text-white'
              )} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ScholarlyEcho
              </span>
              <span className={cn('text-[10px] font-medium tracking-[0.06em] uppercase transition-colors duration-300 block leading-none mt-0.5',
                scrolled ? 'text-brand-500' : 'text-white/50')}>
                Learn · Inspire · Engage
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 text-[13.5px] font-medium tracking-[-0.01em] transition-all duration-200 rounded-lg',
                    scrolled
                      ? active ? 'text-brand-600 bg-brand-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      : active ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA ── */}
          <div className="flex items-center gap-2">
            <Link href="/admin/login"
              className={cn(
                'hidden lg:inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg transition-all duration-200',
                scrolled ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-white/50 hover:text-white hover:bg-white/10'
              )}>
              <Lock className="w-3 h-3" /> Admin
            </Link>

            <Link href="/enroll"
              className={cn(
                'hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 group',
                scrolled
                  ? 'gradient-bg text-white shadow-[0_4px_16px_rgba(110,66,255,0.3)] hover:shadow-[0_8px_24px_rgba(110,66,255,0.4)] hover:-translate-y-0.5'
                  : 'bg-white/[0.08] backdrop-blur-md border border-white/15 text-white hover:bg-white/[0.14]'
              )}>
              Enroll <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200',
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div key={mobileOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
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
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100/60 shadow-[0_20px_60px_rgba(0,0,0,0.1)] z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div key={link.label}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}>
                      <Link href={link.href} onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.98]',
                          active ? 'text-brand-600 bg-brand-50' : 'text-slate-800 hover:bg-slate-50'
                        )}>
                        <span className="flex items-center gap-2">
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                          {link.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-3 pb-2 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link href="/enroll" onClick={() => setMobileOpen(false)}
                    className="btn-primary justify-center text-[14px] py-3.5 group">
                    Enroll <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/admin/login" onClick={() => setMobileOpen(false)}
                    className="btn-secondary justify-center text-[14px] py-3.5">
                    <Lock className="w-4 h-4" /> Admin Portal
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
