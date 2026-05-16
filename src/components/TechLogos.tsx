'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Tech Logos: used across the website to showcase the actual
   tools, languages and platforms taught in our programs.
   Each logo entry carries its brand color so we can tint the
   monochrome simple-icons SVGs and the surrounding chip.
   ───────────────────────────────────────────────────────────── */

type Logo = {
  name: string;
  color: string;            // brand color
  bg: string;               // tinted chip background
  /** Either a path to a raster image (PNG/WEBP/JPG) OR an SVG path used with brand color via mask */
  img?: string;
  /** Path to a monochrome SVG that should be tinted with `color` */
  svg?: string;
};

/* ── Visual / Block Coding (kids' entry) ───────────────────── */
const BLOCK_CODING: Logo[] = [
  { name: 'Scratch',          color: '#FF8C1A', bg: 'rgba(255,140,26,0.10)', img: '/logos/scratch.png' },
  { name: 'MIT App Inventor', color: '#A5C739', bg: 'rgba(165,199,57,0.12)', img: '/logos/mit-app-inventor.png' },
  { name: 'Makeblock',        color: '#0BA8DD', bg: 'rgba(11,168,221,0.10)', img: '/logos/makeblock.png' },
];

/* ── Web: frontend & backend ──────────────────────────────── */
const WEB: Logo[] = [
  { name: 'HTML5',      color: '#E34F26', bg: 'rgba(227,79,38,0.10)',   svg: '/logos/html5.svg' },
  { name: 'CSS3',       color: '#1572B6', bg: 'rgba(21,114,182,0.10)',  svg: '/logos/css3.svg' },
  { name: 'JavaScript', color: '#F7DF1E', bg: 'rgba(247,223,30,0.18)',  svg: '/logos/javascript.svg' },
  { name: 'TypeScript', color: '#3178C6', bg: 'rgba(49,120,198,0.10)',  svg: '/logos/typescript.svg' },
  { name: 'React',      color: '#61DAFB', bg: 'rgba(97,218,251,0.12)',  svg: '/logos/react.svg' },
  { name: 'Next.js',    color: '#000000', bg: 'rgba(0,0,0,0.06)',       svg: '/logos/nextdotjs.svg' },
  { name: 'Node.js',    color: '#5FA04E', bg: 'rgba(95,160,78,0.10)',   svg: '/logos/nodedotjs.svg' },
];

/* ── Languages ─────────────────────────────────────────────── */
const LANGUAGES: Logo[] = [
  { name: 'Python', color: '#3776AB', bg: 'rgba(55,118,171,0.10)', svg: '/logos/python.svg' },
  { name: 'Java',   color: '#ED8B00', bg: 'rgba(237,139,0,0.12)',  svg: '/logos/openjdk.svg' },
  { name: 'Dart',   color: '#0175C2', bg: 'rgba(1,117,194,0.10)',  svg: '/logos/dart.svg' },
  { name: 'Swift',  color: '#FA7343', bg: 'rgba(250,115,67,0.10)', svg: '/logos/swift.svg' },
];

/* ── Mobile ────────────────────────────────────────────────── */
const MOBILE: Logo[] = [
  { name: 'Android',        color: '#3DDC84', bg: 'rgba(61,220,132,0.12)', img: '/logos/android-3d.webp' },
  { name: 'iOS',            color: '#0F172A', bg: 'rgba(15,23,42,0.06)',   img: '/logos/ios.jpg' },
  { name: 'Flutter',        color: '#02569B', bg: 'rgba(2,86,155,0.10)',   svg: '/logos/flutter.svg' },
  { name: 'Android Studio', color: '#3DDC84', bg: 'rgba(61,220,132,0.10)', svg: '/logos/androidstudio.svg' },
];

/* ── Desktop / GUI / Intelligent Systems ───────────────────── */
const DESKTOP: Logo[] = [
  { name: 'PyQt / Qt', color: '#41CD52', bg: 'rgba(65,205,82,0.10)', svg: '/logos/qt.svg' },
  { name: 'PyCharm',   color: '#21D789', bg: 'rgba(33,215,137,0.10)', svg: '/logos/pycharm.svg' },
];

/* ── AI / ML / LLMs ────────────────────────────────────────── */
const AI: Logo[] = [
  { name: 'OpenAI',     color: '#0F172A', bg: 'rgba(15,23,42,0.06)',  svg: '/logos/openai.svg' },
  { name: 'Claude',     color: '#D97757', bg: 'rgba(217,119,87,0.10)', svg: '/logos/anthropic.svg' },
  { name: 'Gemini',     color: '#4285F4', bg: 'rgba(66,133,244,0.10)', svg: '/logos/googlegemini.svg' },
  { name: 'Kimi AI',    color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },         // wordmark fallback
  { name: 'TensorFlow', color: '#FF6F00', bg: 'rgba(255,111,0,0.10)',  svg: '/logos/tensorflow.svg' },
  { name: 'PyTorch',    color: '#EE4C2C', bg: 'rgba(238,76,44,0.10)',  svg: '/logos/pytorch.svg' },
  { name: 'Hugging Face', color: '#FFD21E', bg: 'rgba(255,210,30,0.18)', svg: '/logos/huggingface.svg' },
];

/* ── Idea2MVP: free / open-source AI builders & models ─────── */
const IDEA2MVP: Logo[] = [
  // Free / open-weight LLMs & chat
  { name: 'Qwen',         color: '#615CED', bg: 'rgba(97,92,237,0.10)' },
  { name: 'DeepSeek',     color: '#4D6BFE', bg: 'rgba(77,107,254,0.10)' },
  { name: 'Mistral',      color: '#FA520F', bg: 'rgba(250,82,15,0.10)' },
  { name: 'Llama',        color: '#0866FF', bg: 'rgba(8,102,255,0.10)' },
  { name: 'Hugging Face', color: '#FFD21E', bg: 'rgba(255,210,30,0.18)', svg: '/logos/huggingface.svg' },
  { name: 'Ollama',       color: '#0F172A', bg: 'rgba(15,23,42,0.06)' },
  { name: 'OpenRouter',   color: '#6366F1', bg: 'rgba(99,102,241,0.10)' },
  { name: 'LMArena',      color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  { name: 'Groq',         color: '#F55036', bg: 'rgba(245,80,54,0.10)' },
  // AI builders (free tiers)
  { name: 'Lovable',      color: '#FF4FA1', bg: 'rgba(255,79,161,0.10)' },
  { name: 'Bolt.new',     color: '#0F172A', bg: 'rgba(15,23,42,0.06)' },
  { name: 'v0',           color: '#0F172A', bg: 'rgba(15,23,42,0.06)' },
  { name: 'Replit',       color: '#F26207', bg: 'rgba(242,98,7,0.10)' },
  { name: 'Glide',        color: '#7B61FF', bg: 'rgba(123,97,255,0.10)' },
  // Free backends, design, analytics
  { name: 'Supabase',     color: '#3FCF8E', bg: 'rgba(63,207,142,0.10)' },
  { name: 'Figma',        color: '#A259FF', bg: 'rgba(162,89,255,0.10)' },
  { name: 'PostHog',      color: '#F54E00', bg: 'rgba(245,78,0,0.10)' },
  { name: 'n8n',          color: '#EA4B71', bg: 'rgba(234,75,113,0.10)' },
];

/* ── Categorized groups for display on pages ───────────────── */
export type CategoryKey = 'block' | 'web' | 'languages' | 'mobile' | 'desktop' | 'ai' | 'idea2mvp' | 'all';

export const CATEGORIES: Record<CategoryKey, { label: string; eyebrow?: string; logos: Logo[] }> = {
  block:     { label: 'Block & Visual Coding', eyebrow: 'Beginner-friendly', logos: BLOCK_CODING },
  web:       { label: 'Web Design & Web Apps',  eyebrow: 'Frontend + backend stacks', logos: WEB },
  languages: { label: 'Programming Languages',  eyebrow: 'Real, text-based code', logos: LANGUAGES },
  mobile:    { label: 'Mobile Apps (Android & iOS)', eyebrow: 'Cross-platform & native', logos: MOBILE },
  desktop:   { label: 'Desktop & Intelligent Systems', eyebrow: 'GUI frameworks & desktop builds', logos: DESKTOP },
  ai:        { label: 'AI · ML · LLMs · Prompt Engineering', eyebrow: 'Frontier models & frameworks', logos: AI },
  idea2mvp:  { label: 'Free & Open AI Builders / Models', eyebrow: 'Free-tier and open-source tools we ship with', logos: IDEA2MVP },
  all:       { label: 'Tools we teach with', logos: [...BLOCK_CODING, ...WEB, ...LANGUAGES, ...MOBILE, ...DESKTOP, ...AI] },
};

/* ─────────────────────────────────────────────────────────────
   <LogoChip />: single chip rendering
   ───────────────────────────────────────────────────────────── */

function LogoChip({ logo, theme = 'light', compact = false }: { logo: Logo; theme?: 'light' | 'dark'; compact?: boolean }) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const tileBg = isDark
    ? 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.18]'
    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md';
  const pad = compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5';
  const iconSize = compact ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35 }}
      className={`flex items-center gap-2.5 rounded-xl border ${tileBg} ${pad} transition-all duration-200`}>
      <div className={`${iconSize} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}
        style={{ background: logo.bg }}>
        {logo.img ? (
          <Image src={logo.img} alt={logo.name}
            width={compact ? 32 : 40} height={compact ? 32 : 40}
            className="object-contain w-full h-full p-1" />
        ) : logo.svg ? (
          // Tint the monochrome SVG by applying a mask + brand color background
          <span aria-hidden
            style={{
              display: 'block',
              width: compact ? 22 : 26,
              height: compact ? 22 : 26,
              backgroundColor: logo.color,
              WebkitMask: `url(${logo.svg}) center / contain no-repeat`,
              mask: `url(${logo.svg}) center / contain no-repeat`,
            }} />
        ) : (
          // Wordmark fallback (e.g., Kimi AI)
          <span className="font-extrabold text-[11px] tracking-tight"
            style={{ color: logo.color, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            {logo.name.split(' ')[0]}
          </span>
        )}
      </div>
      <span className={`text-[12.5px] sm:text-[13px] font-bold ${textColor} whitespace-nowrap pr-0.5`}>
        {logo.name}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   <TechLogos />: single category, default to "block" for
   backward compatibility (the older summer-coding strip).
   ───────────────────────────────────────────────────────────── */

type TechLogosProps = {
  theme?: 'dark' | 'light';
  eyebrow?: string;
  category?: CategoryKey;
  className?: string;
  compact?: boolean;
};

export default function TechLogos({ theme = 'light', eyebrow, category = 'block', className = '', compact = false }: TechLogosProps) {
  const isDark = theme === 'dark';
  const subColor = isDark ? 'text-white/45' : 'text-slate-400';
  const logos = CATEGORIES[category].logos;
  const eyebrowText = eyebrow ?? CATEGORIES[category].eyebrow ?? CATEGORIES[category].label;

  return (
    <div className={className}>
      {eyebrowText && (
        <div className={`text-[11px] font-bold uppercase tracking-[0.14em] ${subColor} text-center mb-4`}>
          {eyebrowText}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {logos.map((logo) => (
          <LogoChip key={logo.name} logo={logo} theme={theme} compact={compact} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   <CourseStack />: full curriculum showcase: stacked categories
   with their eyebrow + chips. Used on Learning Hub, About,
   homepage curriculum section.
   ───────────────────────────────────────────────────────────── */

export function CourseStack({ theme = 'light', categories, className = '', compact = true }: {
  theme?: 'light' | 'dark';
  categories?: CategoryKey[];
  className?: string;
  compact?: boolean;
}) {
  const isDark = theme === 'dark';
  const labelColor = isDark ? 'text-white' : 'text-slate-900';
  const subColor = isDark ? 'text-white/45' : 'text-slate-400';
  const list = categories ?? (['block', 'web', 'languages', 'mobile', 'desktop', 'ai'] as CategoryKey[]);

  return (
    <div className={`space-y-7 sm:space-y-8 ${className}`}>
      {list.map((key, i) => {
        const cat = CATEGORIES[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}>
            <div className="flex items-baseline justify-between gap-3 mb-3 sm:mb-4">
              <h3 className={`text-[14px] sm:text-[15px] font-extrabold ${labelColor} tracking-tight`}
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
                {cat.label}
              </h3>
              {cat.eyebrow && (
                <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${subColor} hidden sm:inline`}>
                  {cat.eyebrow}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {cat.logos.map((logo) => (
                <LogoChip key={logo.name} logo={logo} theme={theme} compact={compact} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
