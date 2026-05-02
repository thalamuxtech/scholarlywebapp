'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, ArrowRight, Clock, Tag, TrendingUp,
  Mic2, Brain, Globe, Sparkles, Search, Users
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import NewsletterForm from '@/components/NewsletterForm';

const featured = {
  tag: 'AI Education',
  tagColor: 'bg-brand-50 text-brand-600',
  title: 'How AI is Reshaping Youth Education Across Africa: And Why It Matters Now',
  excerpt: 'From Lagos classrooms to London studios, a new generation of learners is building with artificial intelligence tools that didn\'t exist five years ago. We explore what this means for educators, parents, and policymakers.',
  author: 'ScholarlyEcho Editorial',
  date: 'March 20, 2026',
  readTime: '8 min read',
  color: 'from-brand-500 to-purple-600',
};

const posts = [
  {
    tag: 'Learning', tagColor: 'bg-emerald-50 text-emerald-600',
    title: '5 Things to Know Before Enrolling Your Child in an Online Coding Program',
    excerpt: 'Not all programs are equal. Here\'s what to look for: curriculum depth, tutor quality, project outcomes, and pricing transparency.',
    author: 'Adaeze Obi', date: 'March 15, 2026', readTime: '5 min read',
    icon: BookOpen, color: 'from-emerald-400 to-teal-500',
  },
  {
    tag: 'Research', tagColor: 'bg-amber-50 text-amber-600',
    title: 'Thesis to Impact: How Dr. Kwame\'s Research on Youth Mental Health Reached 30 Schools',
    excerpt: 'A PhD that sat unpublished for two years found its audience through the ScholarlyEcho Thesis Spotlight: and changed 30 schools in Ghana.',
    author: 'Spotlight Media Team', date: 'March 10, 2026', readTime: '6 min read',
    icon: Mic2, color: 'from-amber-400 to-orange-500',
  },
  {
    tag: 'AI', tagColor: 'bg-purple-50 text-purple-600',
    title: 'What is Prompt Engineering: and Why Every Student Should Learn It',
    excerpt: 'Prompt engineering is the most immediately marketable AI skill of 2026. Here\'s a beginner-friendly breakdown of what it is and how to start.',
    author: 'ScholarlyEcho AI Team', date: 'March 5, 2026', readTime: '4 min read',
    icon: Brain, color: 'from-purple-500 to-indigo-600',
  },
  {
    tag: 'Impact', tagColor: 'bg-rose-50 text-rose-600',
    title: 'From Scratch to SaaS: The Story of David M., 18, and SchoolSync',
    excerpt: 'David started at Level 1 with no coding experience. Four years later, he launched a live SaaS product with 400+ users. This is his story.',
    author: 'Kezia Amara', date: 'Feb 28, 2026', readTime: '7 min read',
    icon: TrendingUp, color: 'from-rose-400 to-pink-500',
  },
  {
    tag: 'Events', tagColor: 'bg-teal-50 text-teal-600',
    title: 'What to Expect at the ScholarlyEcho AI Hackathon 2026',
    excerpt: '80 teams, 48 hours, $5,000 in prizes. Here\'s everything you need to know to participate: and win.',
    author: 'Events Team', date: 'Feb 22, 2026', readTime: '4 min read',
    icon: Sparkles, color: 'from-teal-400 to-cyan-500',
  },
  {
    tag: 'Community', tagColor: 'bg-blue-50 text-blue-600',
    title: 'Building in Public: Why Transparency Is at the Heart of ScholarlyEcho',
    excerpt: 'We publish our impact data, our challenges, and our decisions. Here\'s why we believe radical transparency is the right approach for an education platform.',
    author: 'ScholarlyEcho Founders', date: 'Feb 18, 2026', readTime: '5 min read',
    icon: Globe, color: 'from-blue-400 to-brand-500',
  },
];

const categories = ['All', 'AI Education', 'Learning', 'Research', 'Impact Stories', 'Events', 'Community'];

export default function BlogPage() {
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
      <section className="py-6 bg-white/90 backdrop-blur-xl border-b border-slate-100/60 sticky top-16 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat, i) => (
              <button key={cat}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all ${i === 0 ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl group hover:shadow-2xl transition-shadow duration-300">
              <div className={`h-2 bg-gradient-to-r ${featured.color}`} />
              <div className="p-6 sm:p-10 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-600">
                    Featured
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                    {featured.tag}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed mb-6 max-w-3xl">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-[12px] text-slate-400">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {featured.author}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
                    <span>{featured.date}</span>
                  </div>
                  <Link href="#"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-white bg-gradient-to-r ${featured.color} hover:opacity-90 transition-opacity`}>
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {posts.map((post, i) => {
              const Icon = post.icon;
              return (
                <motion.article key={post.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="premium-card group hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-3 ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-[14px] sm:text-[15px] leading-snug mb-3 group-hover:text-brand-600 transition-colors flex-1"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-[12px] sm:text-[13px] leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-secondary px-8 py-3 text-[14px]">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

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
