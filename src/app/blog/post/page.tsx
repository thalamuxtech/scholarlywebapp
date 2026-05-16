'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/firebase';
import {
  ArrowLeft, Clock, Users, Calendar, Sparkles, ArrowRight, Loader2
} from 'lucide-react';
import { type Post, isPublished, gradientFor, tagColorFor, formatPostDate } from '@/lib/posts';
import NewsletterForm from '@/components/NewsletterForm';

function PostContent() {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<string>('');
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'not-found'>('loading');

  // Resolve the slug from ?slug= or from the pretty path (/blog/<slug>).
  useEffect(() => {
    const fromQuery = searchParams.get('slug') || '';
    let resolved = fromQuery;
    if (!resolved && typeof window !== 'undefined') {
      const m = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
      if (m && m[1] && m[1] !== 'post') resolved = decodeURIComponent(m[1]);
    }
    setSlug(resolved);
  }, [searchParams]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setStatus('loading');
    (async () => {
      const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
      const snap = await getDocs(q);
      if (cancelled) return;
      const doc = snap.docs[0];
      if (!doc) { setStatus('not-found'); return; }
      const data = { id: doc.id, ...(doc.data() as Omit<Post, 'id'>) } as Post;
      if (!isPublished(data)) { setStatus('not-found'); return; }
      setPost(data);
      setStatus('ok');
    })().catch(() => setStatus('not-found'));
    return () => { cancelled = true; };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading article...
      </div>
    );
  }

  if (status === 'not-found' || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-5">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Article not found
          </h1>
          <p className="text-slate-500 text-sm mb-6">This article may have been moved, unpublished, or the link is incorrect.</p>
          <Link href="/blog" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const gradient = gradientFor(post.category);

  return (
    <div className="overflow-hidden">
      {/* ── Hero / cover ── */}
      <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 35%, #13103a 65%, #070c1b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[12px] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All articles
          </Link>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-5 flex-wrap">
            {post.category && (
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${tagColorFor(post.category)}`}>
                {post.category}
              </span>
            )}
            {post.tags?.slice(0, 3).map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/70 border border-white/10">
                {t}
              </span>
            ))}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-[-0.03em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {post.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-white/55">
            {post.author && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {post.author}</span>}
            {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatPostDate(post.publishedAt)}</span>}
            {post.readMinutes && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readMinutes} min read</span>}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />
      </section>

      {/* ── Cover image ── */}
      <section className="bg-slate-50 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.imageUrl} alt={post.title} className="w-full max-h-[520px] object-cover" />
            ) : (
              <div className={`aspect-[16/8] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Sparkles className="w-16 h-16 text-white/40" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {post.excerpt && (
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 border-l-4 border-brand-400 pl-5 italic">
              {post.excerpt}
            </p>
          )}
          <article className="prose prose-slate prose-lg max-w-none
            prose-headings:font-extrabold prose-headings:tracking-tight
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900
            prose-li:text-slate-600
            prose-blockquote:border-l-brand-400 prose-blockquote:text-slate-700
            prose-code:text-rose-600 prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.92em] prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:text-slate-100
            prose-img:rounded-2xl prose-img:shadow-md">
            {post.body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic">This article has no body content yet.</p>
            )}
          </article>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-16 sm:py-20 noise-overlay relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="max-w-xl mx-auto px-5 text-center relative z-10">
          <Sparkles className="w-10 h-10 mx-auto mb-5 text-amber-400" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Liked this article?
          </h2>
          <p className="text-white/40 text-[14px] sm:text-[15px] mb-7 leading-relaxed">
            Subscribe and get our next ones delivered weekly: real talk, not AI slop.
          </p>
          <NewsletterForm variant="dark" />
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[12px] mt-6">
            More articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading article...
      </div>
    }>
      <PostContent />
    </Suspense>
  );
}
