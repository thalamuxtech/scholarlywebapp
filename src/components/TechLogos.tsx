'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type Logo = {
  name: string;
  color: string;       // brand color
  bg: string;          // tinted background for the icon tile
  glyph: React.ReactNode;
};

const LOGOS: Logo[] = [
  {
    name: 'Scratch',
    color: '#FCBD2D',           // Scratch yellow accent
    bg: 'rgba(252,189,45,0.14)',
    glyph: (
      // Real Scratch Cat artwork (official asset from Scratch Wiki)
      <Image
        src="/logos/scratch-cat.png"
        alt="Scratch"
        width={44}
        height={44}
        className="object-contain"
      />
    ),
  },
  {
    name: 'MIT App Inventor',
    color: '#A5C739',
    bg: 'rgba(165,199,57,0.16)',
    glyph: (
      // App Inventor brand mark — green rounded square with white bee silhouette
      <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
        <rect x="2" y="2" width="44" height="44" rx="9" fill="#A5C739"/>
        {/* Bee body */}
        <ellipse cx="24" cy="28" rx="9" ry="7" fill="#fff"/>
        <rect x="20" y="22" width="8" height="2.5" fill="#A5C739"/>
        <rect x="20" y="27" width="8" height="2.5" fill="#A5C739"/>
        <rect x="20" y="32" width="8" height="2" fill="#A5C739"/>
        {/* Head */}
        <circle cx="24" cy="18" r="4.5" fill="#fff"/>
        {/* Antennae */}
        <path d="M21 14 L19 10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        <path d="M27 14 L29 10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        <circle cx="19" cy="10" r="1" fill="#fff"/>
        <circle cx="29" cy="10" r="1" fill="#fff"/>
        {/* Wings */}
        <ellipse cx="16" cy="24" rx="3.5" ry="2" fill="#fff" opacity="0.8"/>
        <ellipse cx="32" cy="24" rx="3.5" ry="2" fill="#fff" opacity="0.8"/>
      </svg>
    ),
  },
  {
    name: 'Android',
    color: '#3DDC84',
    bg: 'rgba(61,220,132,0.14)',
    glyph: (
      // Android robot head — official green
      <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
        <path fill="#3DDC84" d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7619h24c-.3432-4.103-2.6889-7.5752-6.1185-9.4405"/>
      </svg>
    ),
  },
  {
    name: 'Makeblock',
    color: '#FF6900',           // Makeblock orange (mBot/brand accent)
    bg: 'rgba(255,105,0,0.12)',
    glyph: (
      // Robot head silhouette — Makeblock's mBot inspired mark
      <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden>
        <rect x="2" y="2" width="44" height="44" rx="9" fill="#FF6900"/>
        {/* Robot head */}
        <rect x="12" y="14" width="24" height="20" rx="4" fill="#fff"/>
        {/* Eyes */}
        <circle cx="18" cy="22" r="2.5" fill="#FF6900"/>
        <circle cx="30" cy="22" r="2.5" fill="#FF6900"/>
        {/* Mouth */}
        <rect x="17" y="28" width="14" height="2.5" rx="1.2" fill="#FF6900"/>
        {/* Antenna */}
        <line x1="24" y1="14" x2="24" y2="9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="8" r="2" fill="#fff"/>
        {/* Side ports */}
        <rect x="9" y="20" width="3" height="6" rx="1" fill="#fff"/>
        <rect x="36" y="20" width="3" height="6" rx="1" fill="#fff"/>
      </svg>
    ),
  },
];

type TechLogosProps = {
  theme?: 'dark' | 'light';
  eyebrow?: string;
  className?: string;
  compact?: boolean;
};

export default function TechLogos({ theme = 'light', eyebrow, className = '', compact = false }: TechLogosProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const subColor = isDark ? 'text-white/45' : 'text-slate-400';
  const tileBg = isDark
    ? 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]'
    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md';
  const pad = compact ? 'px-3 py-2' : 'px-4 py-3';
  const iconSize = compact ? 'w-10 h-10' : 'w-12 h-12';

  return (
    <div className={className}>
      {eyebrow && (
        <div className={`text-[11px] font-bold uppercase tracking-[0.14em] ${subColor} text-center mb-4`}>
          {eyebrow}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {LOGOS.map((logo, i) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            className={`flex items-center gap-3 rounded-2xl border ${tileBg} ${pad} transition-all duration-200`}>
            <div className={`${iconSize} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden`}
              style={{ background: logo.bg }}>
              {logo.glyph}
            </div>
            <span className={`text-[13px] sm:text-[14px] font-bold ${textColor} whitespace-nowrap pr-1`}>
              {logo.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
