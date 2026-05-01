'use client';

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
      // Scratch Cat silhouette — simple-icons monochrome glyph
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
        <path d="M11.406 11.312c-.78-.123-1.198-.654-.99-2.295l.023-.198c.175-1.426.321-1.743.996-1.706.198.013.426.135.737.392.347.297.793.566 1.28.776.99.426 2.092.59 3.225.421l-.165-1.096-.006-.04c-.165-1.108.075-1.788.726-1.99l.06-.018c.5-.142.812-.013 1.042.46.215.435.314 1.075.27 1.84-.04.728-.198 1.43-.456 2.024l-.013.04c-.295.674-.704 1.243-1.198 1.66-.484.408-1.071.68-1.74.797-.668.119-1.4.075-2.165-.143l-.06-.018c-.3-.085-.578-.18-.83-.286-.247-.105-.466-.219-.654-.341-.187-.122-.34-.252-.45-.385-.06-.073-.1-.143-.123-.21-.026-.075-.034-.149-.022-.222z M5 13.5c0-.553.448-1 1-1s1 .447 1 1-.448 1-1 1-1-.447-1-1zm12 4.5c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM12 19c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"/>
      </svg>
    ),
  },
  {
    name: 'MIT App Inventor',
    color: '#7CA419',
    bg: 'rgba(165,199,57,0.14)',
    glyph: (
      // Stylized "Ai" mark with bee accent
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <rect x="2" y="3" width="20" height="18" rx="4" fill="#A5C739"/>
        <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Ai</text>
      </svg>
    ),
  },
  {
    name: 'Android',
    color: '#3DDC84',
    bg: 'rgba(61,220,132,0.12)',
    glyph: (
      // Android robot head — simple-icons monochrome
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
        <path d="M17.523 15.34l1.357-2.35a.282.282 0 0 0-.103-.385.281.281 0 0 0-.385.103l-1.376 2.383C15.766 14.464 13.94 14.057 12 14.057s-3.766.407-5.016.99l-1.376-2.383a.282.282 0 1 0-.488.283l1.357 2.35C4.13 16.45 2.491 18.756 2.25 21.5h19.5c-.241-2.744-1.88-5.05-4.227-6.16zM7.046 19.355a.834.834 0 1 1 0-1.668.834.834 0 0 1 0 1.668zm9.908 0a.834.834 0 1 1 0-1.668.834.834 0 0 1 0 1.668z M21.75 10.5a1.13 1.13 0 0 0-1.13 1.13v4.74a1.13 1.13 0 1 0 2.26 0v-4.74a1.13 1.13 0 0 0-1.13-1.13zM2.25 10.5a1.13 1.13 0 0 0-1.13 1.13v4.74a1.13 1.13 0 1 0 2.26 0v-4.74A1.13 1.13 0 0 0 2.25 10.5z"/>
      </svg>
    ),
  },
  {
    name: 'Makeblock',
    color: '#0BA8DD',
    bg: 'rgba(11,168,221,0.12)',
    glyph: (
      // Stacked block mark
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
        <rect x="3" y="4" width="7" height="16" rx="1.5" fill="#0BA8DD"/>
        <rect x="14" y="4" width="7" height="16" rx="1.5" fill="#0BA8DD"/>
        <rect x="3" y="10" width="18" height="4" fill="#0BA8DD" opacity="0.5"/>
      </svg>
    ),
  },
];

type TechLogosProps = {
  /** "dark" = on dark backgrounds (white text), "light" = on light backgrounds (slate text) */
  theme?: 'dark' | 'light';
  /** Show "Built with" eyebrow text */
  eyebrow?: string;
  className?: string;
  /** Compact (smaller chips) */
  compact?: boolean;
};

export default function TechLogos({ theme = 'light', eyebrow, className = '', compact = false }: TechLogosProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const subColor = isDark ? 'text-white/45' : 'text-slate-400';
  const tileBg = isDark ? 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md';
  const pad = compact ? 'px-3 py-2' : 'px-4 py-3';
  const iconSize = compact ? 'w-9 h-9' : 'w-11 h-11';

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
            className={`flex items-center gap-2.5 rounded-xl border ${tileBg} ${pad} transition-all duration-200`}>
            <div className={`${iconSize} rounded-lg flex items-center justify-center flex-shrink-0`}
              style={{ background: logo.bg, color: logo.color }}>
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
