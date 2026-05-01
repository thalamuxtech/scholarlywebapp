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
    color: '#FF8C1A',
    bg: 'rgba(255,140,26,0.10)',
    glyph: (
      <Image src="/logos/scratch.png" alt="Scratch" width={48} height={48}
        className="object-contain" />
    ),
  },
  {
    name: 'MIT App Inventor',
    color: '#A5C739',
    bg: 'rgba(165,199,57,0.12)',
    glyph: (
      <Image src="/logos/mit-app-inventor.png" alt="MIT App Inventor" width={48} height={48}
        className="object-contain" />
    ),
  },
  {
    name: 'Android',
    color: '#3DDC84',
    bg: 'rgba(61,220,132,0.14)',
    glyph: (
      // Android robot — official simple-icons mark
      <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
        <path fill="#3DDC84" d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7619h24c-.3432-4.103-2.6889-7.5752-6.1185-9.4405"/>
      </svg>
    ),
  },
  {
    name: 'Makeblock',
    color: '#0BA8DD',
    bg: 'rgba(11,168,221,0.10)',
    glyph: (
      <Image src="/logos/makeblock.png" alt="Makeblock" width={56} height={48}
        className="object-contain" />
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
