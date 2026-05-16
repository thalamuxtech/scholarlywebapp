'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, ArrowRight, Clock, Sparkles, Users, ImageIcon
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import NewsletterForm from '@/components/NewsletterForm';
import {
  usePosts, isPublished, gradientFor, tagColorFor, formatPostDate, type Post,
} from '@/lib/posts';

export default function BlogPage() {
  const { posts, loaded } = usePosts();
  const published = useMemo(() => posts.filter(isPublished), [posts]);

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

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] mb-6">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Blog & Resources
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Ideas Worth Sharing
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/45 text-base sm:text-lg leading-relaxed">
            Insights on AI, youth education, research, and the stories behind the numbers.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Category Filter ── */}
      {categories.length > 1 && (
        <section className="py-6 bg-white/90 backdrop-blur-xl border-b border-slate-100/60 sticky top-16 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all ${activeCategory === cat ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty / loading state ── */}
      {!loaded && (
        <section className="py-20 text-center bg-white">
          <div className="text-slate-400 text-sm">Loading articles...</div>
        </section>
      )}

      {loaded && published.length === 0 && (
        <section className="py-20 text-center bg-white">
          <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No articles published yet. Check back soon.</p>
        </section>
      )}

      {/* ── Featured Post ── */}
      {loaded && featured && (
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
            <SectionWrapper>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl group hover:shadow-2xl transition-shadow duration-300">
                <div className={`h-2 bg-gradient-to-r ${gradientFor(featured.category)}`} />
                <Link href={`/blog/${featured.slug}`} className="grid md:grid-cols-[minmax(0,1fr)_1.2fr] gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-slate-100 overflow-hidden">
                    {featured.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradientFor(featured.category)} flex items-center justify-center`}>
                        <Sparkles className="w-12 h-12 text-white/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-600">
                        Featured
                      </span>
                      {featured.category && (
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${tagColorFor(featured.category)}`}>
                          {featured.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed mb-6 max-w-3xl">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-[12px] text-slate-400">
                        {featured.author && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {featured.author}</span>}
                        {featured.readMinutes && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featured.readMinutes} min read</span>}
                        {featured.publishedAt && <span>{formatPostDate(featured.publishedAt)}</span>}
                      </div>
                      <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-white bg-gradient-to-r ${gradientFor(featured.category)} group-hover:opacity-90 transition-opacity`}>
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SectionWrapper>
          </div>
        </section>
      )}

      {/* ── Post Grid ── */}
      {loaded && filteredOthers.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredOthers.map((post, i) => (
                <motion.article key={post.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden p-0 flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex sm:block">
                      {/* Image on the left (mobile + small) / on top (desktop card) */}
                      {post.imageUrl ? (
                        <div className="w-1/3 sm:w-full aspect-square sm:aspect-[16/9] bg-slate-100 overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className={`w-1/3 sm:w-full aspect-square sm:aspect-[16/9] bg-gradient-to-br ${gradientFor(post.category)} flex items-center justify-center flex-shrink-0`}>
                          <ImageIcon className="w-7 h-7 text-white/40" />
                        </div>
                      )}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col min-w-0">
                        {post.category && (
                          <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 ${tagColorFor(post.category)}`}>
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-extrabold text-slate-900 text-[14px] sm:text-[15px] leading-snug mb-2 group-hover:text-brand-600 transition-colors flex-1"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-slate-400 text-[12px] sm:text-[13px] leading-relaxed mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                          {post.readMinutes ? (
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readMinutes} min</span>
                          ) : <span />}
                          {post.publishedAt && <span>{formatPostDate(post.publishedAt)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter CTA ── */}
      <section className="py-16 sm:py-20 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="max-w-xl mx-auto px-5 text-center relative z-10">
          <SectionWrapper>
            <Sparkles className="w-10 h-10 mx-auto mb-5 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Never Miss a Story
            </h2>
            <p className="text-white/40 text-[14px] sm:text-[15px] mb-7 leading-relaxed">
              Get our best articles, research spotlights, and event announcements: weekly, no spam.
            </p>
            <NewsletterForm variant="dark" />
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
