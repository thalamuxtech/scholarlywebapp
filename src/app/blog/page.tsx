'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ArrowRight, Clock, Sparkles, Users, ImageIcon, Filter, Calendar
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import NewsletterForm from '@/components/NewsletterForm';
import {
  usePosts, tagColorFor, formatPostDate, type Post,
} from '@/lib/posts';

/** Shared aurora animation (same recipe as event cards). */
const AURORA_BG_ANIMATED: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899, #3b82f6, #6e42ff)',
  backgroundSize: '300% 300%',
  animation: 'aurora 6s ease infinite',
};

export default function BlogPage() {
  const { posts: published, loaded } = usePosts();

  const featured: Post | null = useMemo(
    () => published.find((p) => p.featured) || published[0] || null,
    [published]
  );
  const others = useMemo(
    () => (featured ? published.filter((p) => p.id !== featured.id) : published),
    [published, featured]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    published.forEach((p) => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set)];
  }, [published]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const filteredOthers = useMemo(() => {
    if (activeCategory === 'All') return others;
    return others.filter((p) => p.category === activeCategory);
  }, [others, activeCategory]);

  return (
    <div className="overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 noise-overlay text-center overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        {/* Aurora orbs */}
        <motion.div aria-hidden
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[8%] w-[480px] h-[480px] rounded-full opacity-[0.16] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.25, 1], x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[5%] right-[8%] w-[420px] h-[420px] rounded-full opacity-[0.14] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[35%] right-[25%] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-3xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-white/70 text-[13px] font-medium mb-6 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Blog & Resources
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-[-0.03em] leading-[1.05]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Ideas Worth <span className="gradient-text-animated">Sharing</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg leading-[1.75] max-w-2xl mx-auto">
            Strategy, frameworks, and case-quality writing on coding, AI, youth education,
            and the stories behind the numbers.
          </motion.p>
        </div>

        {/* Bottom seam */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.5) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ═══ POST LIST ═══ */}
      <section className="py-14 sm:py-18 md:py-24 mesh-bg relative overflow-hidden">
        {/* Ambient orb */}
        <div aria-hidden className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <SectionWrapper className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-600 text-[12px] font-bold mb-5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Latest Articles
            </div>
            <h2 className="section-heading mb-4">
              From the <span className="gradient-text-animated">Echo</span>
            </h2>
            <p className="section-subheading mx-auto">
              Field-tested writing from the team teaching this work every week.
            </p>
          </SectionWrapper>

          {/* Loading / empty states */}
          {!loaded && (
            <div className="premium-card text-slate-400 text-sm text-center py-14">
              <Sparkles className="w-6 h-6 mx-auto mb-3 text-slate-300 animate-pulse" />
              Loading articles...
            </div>
          )}

          {loaded && published.length === 0 && (
            <div className="premium-card text-slate-400 text-sm text-center py-14">
              <BookOpen className="w-7 h-7 mx-auto mb-3 text-slate-300" />
              No articles published yet. Check back soon.
            </div>
          )}

          {/* Category filter chips (only show when we have posts and categories) */}
          {loaded && published.length > 0 && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-center flex-wrap gap-2 mb-10">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                <Filter className="w-3 h-3" /> Filter
              </span>
              {categories.map((c) => {
                const active = activeCategory === c;
                return (
                  <motion.button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                      active
                        ? 'text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700'
                    }`}>
                    {active && (
                      <motion.span layoutId="active-blog-cat-pill"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }} />
                    )}
                    <span className="relative">{c}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Featured post (shown only when activeCategory is All or the featured matches) */}
          {loaded && featured && (activeCategory === 'All' || featured.category === activeCategory) && (
            <div className="mb-6">
              <BlogCard post={featured} index={0} isFeatured />
            </div>
          )}

          {/* Other posts */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loaded && filteredOthers.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i + 1} />
              ))}
            </AnimatePresence>
            {loaded && published.length > 0 && filteredOthers.length === 0 && (!featured || featured.category !== activeCategory) && (
              <motion.div key="empty-filter"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="premium-card text-slate-400 text-sm text-center py-14">
                <Calendar className="w-7 h-7 mx-auto mb-3 text-slate-300" />
                No articles in this category yet.
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER CTA ═══ */}
      <section className="py-14 sm:py-18 md:py-24 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>

        <motion.div aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(110,66,255,0.4) 0%, transparent 60%)' }} />

        <div className="max-w-xl mx-auto px-5 text-center relative z-10">
          <SectionWrapper>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_8px_32px_rgba(245,158,11,0.4)] mb-6">
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Never miss a <span className="gradient-text-animated">story</span>
            </h2>
            <p className="text-white/55 max-w-xl mx-auto mb-8 text-[15px] leading-relaxed">
              The best articles, research spotlights, and event announcements: weekly, no spam.
            </p>
            <NewsletterForm variant="dark" />
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}

/* ─────────── Blog Card (matches Event Card design language) ─────────── */
type BlogCardProps = {
  post: Post;
  index: number;
  isFeatured?: boolean;
};

function BlogCard({ post, index, isFeatured = false }: BlogCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 120, damping: 22 }}
      whileHover={{ y: -4 }}
      className="relative group">

      {/* Animated gradient ring border */}
      <div aria-hidden
        className={`absolute -inset-[1.5px] rounded-3xl transition-opacity duration-500 -z-0 pointer-events-none ${
          isFeatured ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(110,66,255,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(110,66,255,0.6))',
          backgroundSize: '300% 300%',
          animation: 'aurora 6s ease infinite',
        }} />

      <Link href={`/blog/${post.slug}`}
        className="relative block bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] group-hover:shadow-[0_24px_48px_rgba(110,66,255,0.12)] transition-shadow duration-500 overflow-hidden">

        {/* Ambient glow */}
        <div aria-hidden
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none blur-3xl"
          style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }} />

        <div className="flex flex-col md:flex-row gap-5 relative">
          {/* Image / category panel */}
          <div className={`relative md:w-44 h-40 md:h-auto md:min-h-[140px] rounded-2xl overflow-hidden flex-shrink-0 shadow-md ${!post.imageUrl ? '' : 'bg-slate-100'}`}
            style={!post.imageUrl ? AURORA_BG_ANIMATED : undefined}>
            {post.imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imageUrl} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                {/* Shimmer on hover */}
                <motion.div aria-hidden
                  initial={{ x: '-120%' }} whileHover={{ x: '120%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              </>
            ) : (
              <>
                <motion.div aria-hidden
                  animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                  className="absolute inset-0"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.45), transparent 60%)' }} />
                <motion.div aria-hidden
                  initial={{ x: '-120%' }} animate={{ x: '120%' }}
                  transition={{ repeat: Infinity, repeatDelay: 6, duration: 2.4, ease: 'easeInOut', delay: index * 0.4 }}
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-white/60" />
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold text-white shadow-sm"
                  style={AURORA_BG_ANIMATED}>
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
              {post.category && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${tagColorFor(post.category)}`}>
                  {post.category}
                </span>
              )}
              {post.readMinutes && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  <Clock className="w-3 h-3" /> {post.readMinutes} min
                </span>
              )}
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  <Calendar className="w-3 h-3" /> {formatPostDate(post.publishedAt)}
                </span>
              )}
            </div>

            <h3 className={`font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors leading-snug ${isFeatured ? 'text-[20px] sm:text-[22px]' : 'text-[18px]'}`}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className={`text-slate-500 mb-3.5 leading-relaxed ${isFeatured ? 'text-[14px] sm:text-[15px]' : 'text-[13.5px]'}`}>
                {post.excerpt}
              </p>
            )}
            {post.author && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-400">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {post.author}</span>
              </div>
            )}
          </div>

          {/* CTA column */}
          <div className="flex flex-col items-stretch md:items-end justify-center gap-2 flex-shrink-0 md:min-w-[160px]">
            <span className="group/btn relative px-5 py-3 rounded-xl font-extrabold text-[13px] whitespace-nowrap inline-flex items-center justify-center gap-2 text-white shadow-md group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              style={AURORA_BG_ANIMATED}>
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
              <span className="relative">Read article</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
