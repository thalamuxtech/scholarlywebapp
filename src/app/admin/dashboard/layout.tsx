'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  LayoutDashboard, Inbox, FolderKanban, BarChart3, Settings,
  LogOut, Bell, ChevronLeft, Menu, X, ExternalLink, Tag
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Submissions', href: '/admin/dashboard/submissions', icon: Inbox },
  { label: 'Programs', href: '/admin/dashboard/programs', icon: FolderKanban },
  { label: 'Coupons', href: '/admin/dashboard/coupons', icon: Tag },
  { label: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push('/admin/login'); }
      else { setUser(u); setLoading(false); }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const logout = async () => { await signOut(auth); router.push('/admin/login'); };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f1a]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-[3px] border-brand-500/20 border-t-brand-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">

      {/* ── Sidebar (Desktop) ── */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
        style={{ background: 'linear-gradient(180deg, #0c0f1a 0%, #111528 100%)' }}>

        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-5 h-[64px] border-b border-white/[0.06] ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo-white.png" alt="SE" fill className="object-contain" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-white font-bold text-[14px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ScholarlyEcho
              </span>
              <span className="block text-white/30 text-[9px] tracking-[0.12em] uppercase">Admin</span>
            </motion.div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                  active
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center' : ''}`}>
                {active && (
                  <motion.div layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-brand-400' : 'text-white/30 group-hover:text-white/50'}`} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-3">
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-all text-xs">
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* User */}
        <div className={`px-3 pb-4 border-t border-white/[0.06] pt-3 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[11px] truncate">{user?.email}</p>
                <p className="text-white/25 text-[10px]">Administrator</p>
              </div>
              <button onClick={logout} className="text-white/20 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center py-2 text-white/20 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 flex flex-col"
              style={{ background: 'linear-gradient(180deg, #0c0f1a 0%, #111528 100%)' }}>
              <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7"><Image src="/logo-white.png" alt="SE" fill className="object-contain" /></div>
                  <span className="text-white font-bold text-[14px]">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all ${
                        active ? 'bg-brand-500/15 text-brand-400' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                      }`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-brand-400' : 'text-white/30'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
                <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 text-red-400/60 hover:text-red-400 text-sm w-full transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-[60px] bg-white/80 backdrop-blur-xl border-b border-slate-100/60 flex items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[15px] font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {sidebarLinks.find((l) => isActive(l.href))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-all">
              View Site <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white lg:hidden">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-5 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
