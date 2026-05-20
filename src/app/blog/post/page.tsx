'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, limit, onSnapshot, doc as fbDoc, getDocs, type FirestoreError } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/firebase';
import {
  ArrowLeft, Clock, Users, Calendar, Sparkles, ArrowRight, Loader2, Heart,
  ImageIcon
} from 'lucide-react';
import {
  type Post, isPublished, gradientFor, tagColorFor, formatPostDate,
  totalLikes, likePost, usePosts,
} from '@/lib/posts';
import NewsletterForm from '@/components/NewsletterForm';

/** localStorage key for a single browser's like state per post. */
const likedKey = (postId: string) => `se_blog_liked_${postId}`;

/** Shared aurora background for buttons / accents (matches /events and /blog cards). */
const AURORA_BG_ANIMATED: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899, #3b82f6, #6e42ff)',
  backgroundSize: '300% 300%',
  animation: 'aurora 6s ease infinite',
};

function PostContent() {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<string>('');
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'not-found' | 'forbidden'>('loading');
  const [liked, setLiked] = useState(false);
  const [likeBurst, setLikeBurst] = useState(0); // bumps each click to drive a small animation
  const [optimisticLikes, setOptimisticLikes] = useState(0); // visual bump until the server-side value catches up
  const [postRevision, setPostRevision] = useState(0); // increments every time the post doc snapshot fires

  // All published posts (used to render related/read-more cards at the bottom).
  const { posts: allPosts } = usePosts();

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

  // 1) One-shot getDocs by slug. We use getDocs (not onSnapshot) here so that
  //    rule rejections surface a real error we can introspect and tell the
  //    visitor "this is a permission problem" rather than a misleading 404.
  // 2) After we have the doc id, attach an onSnapshot to that exact doc so
  //    the like count stays live.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    let docUnsub: (() => void) | undefined;

    setStatus('loading');

    (async () => {
      try {
        // IMPORTANT: include where('status', '==', 'published') so the query
        // aligns with the Firestore rule's read constraint. Without it the
        // rule engine cannot prove the result set is publishable and rejects
        // the entire query for unauthenticated visitors.
        const snap = await getDocs(
          query(
            collection(db, 'posts'),
            where('slug', '==', slug),
            where('status', '==', 'published'),
            limit(1),
          )
        );
        if (cancelled) return;

        const docRef = snap.docs[0];
        if (!docRef) {
          setStatus('not-found');
          return;
        }

        // Subscribe to live doc updates (likes etc.).
        docUnsub = onSnapshot(
          fbDoc(db, 'posts', docRef.id),
          (d) => {
            if (cancelled) return;
            if (!d.exists()) { setStatus('not-found'); return; }
            const data = { id: d.id, ...(d.data() as Omit<Post, 'id'>) } as Post;
            if (!isPublished(data)) { setStatus('not-found'); return; }
            setPost(data);
            setStatus('ok');
            setPostRevision((n) => n + 1);
          },
          (err: FirestoreError) => {
            // Live subscription failed but we already have the doc from getDocs.
            // Leave the page in 'ok' state with the snapshot we have.
            console.warn('Live post listener stopped:', err.code, err.message);
          }
        );
      } catch (err) {
        if (cancelled) return;
        const fbErr = err as FirestoreError;
        if (fbErr?.code === 'permission-denied') {
          console.error(
            'Firestore denied the public read on /posts. ' +
            'Make sure firestore.rules has been deployed: firebase deploy --only firestore:rules',
            fbErr
          );
          setStatus('forbidden');
        } else {
          console.error('Failed to load post:', fbErr?.code, fbErr?.message);
          setStatus('not-found');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (docUnsub) docUnsub();
    };
  }, [slug]);

  // Restore "already liked from this browser" state from localStorage.
  useEffect(() => {
    if (!post?.id || typeof window === 'undefined') return;
    setLiked(window.localStorage.getItem(likedKey(post.id)) === '1');
  }, [post?.id]);

  const handleLike = async () => {
    if (!post?.id || liked) return;
    // Visual bump first: heart fills, count goes up by one, burst animation plays.
    setLiked(true);
    setLikeBurst((n) => n + 1);
    setOptimisticLikes((n) => n + 1);
    try {
      window.localStorage.setItem(likedKey(post.id), '1');
    } catch { /* ignore quota errors */ }
    try {
      await likePost(post.id);
      // The post-doc onSnapshot will fire and we'll clear the optimistic bump (see effect below).
    } catch (err) {
      // If the write fails, roll back the visual state.
      console.error('Failed to like post:', err);
      setLiked(false);
      setOptimisticLikes((n) => Math.max(0, n - 1));
      try { window.localStorage.removeItem(likedKey(post.id)); } catch { /* ignore */ }
    }
  };

  // When a fresh post snapshot arrives, the server-side total has caught up
  // so we can drop the optimistic bump.
  useEffect(() => {
    if (postRevision === 0) return;
    setOptimisticLikes(0);
  }, [postRevision]);

  // Related published posts: same category preferred, then newest others.
  const related = useMemo(() => {
    if (!post) return [];
    const others = allPosts.filter((p) => p.id !== post.id && isPublished(p));
    const sameCat = post.category ? others.filter((p) => p.category === post.category) : [];
    const seen = new Set(sameCat.map((p) => p.id));
    const rest = others.filter((p) => !seen.has(p.id));
    return [...sameCat, ...rest].slice(0, 6);
  }, [post, allPosts]);

  const likeCount = (post ? totalLikes(post) : 0) + optimisticLikes;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading article...
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-5">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            We couldn&apos;t load this article
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            The article exists but the site is temporarily unable to fetch it.
            Please try again in a minute or two, or open the article list.
          </p>
          <Link href="/blog" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
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

          {/* Like button (sticky-feeling, top of body) */}
          <div className="flex items-center justify-between mb-8 sm:mb-10 pb-4 border-b border-slate-100">
            <div className="text-[12px] uppercase tracking-[0.14em] font-bold text-slate-400">
              Found this useful?
            </div>
            <button
              type="button"
              onClick={handleLike}
              disabled={liked}
              aria-label={liked ? 'You liked this article' : 'Like this article'}
              className={`group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                liked
                  ? 'border-rose-300 bg-rose-50 text-rose-600 cursor-default'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/60 hover:-translate-y-0.5'
              }`}>
              <motion.span
                key={likeBurst}
                initial={likeBurst === 0 ? false : { scale: 0.6 }}
                animate={likeBurst === 0 ? undefined : { scale: [0.6, 1.35, 1] }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative inline-flex items-center justify-center"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    liked ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-500'
                  }`}
                />
                {/* tiny radial burst on click */}
                {likeBurst > 0 && (
                  <motion.span aria-hidden
                    key={`burst-${likeBurst}`}
                    initial={{ scale: 0, opacity: 0.55 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.55), transparent 65%)' }}
                  />
                )}
              </motion.span>
              <span className="font-bold text-[14px] tabular-nums">{likeCount.toLocaleString()}</span>
              <span className="text-[12px] font-semibold text-slate-500">{liked ? 'Liked' : 'Like'}</span>
            </button>
          </div>

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

          {/* Tail heart: a second chance to like once the reader reaches the end */}
          <div className="mt-12 sm:mt-14 flex flex-col items-center gap-3 text-center">
            <div className="text-[12px] uppercase tracking-[0.14em] font-bold text-slate-400">
              Did this article help you?
            </div>
            <button
              type="button"
              onClick={handleLike}
              disabled={liked}
              aria-label={liked ? 'You liked this article' : 'Like this article'}
              className={`group relative inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                liked
                  ? 'border-rose-300 bg-rose-50 text-rose-600 cursor-default'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/60 hover:-translate-y-0.5'
              }`}>
              <motion.span
                key={`tail-${likeBurst}`}
                initial={likeBurst === 0 ? false : { scale: 0.6 }}
                animate={likeBurst === 0 ? undefined : { scale: [0.6, 1.35, 1] }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative inline-flex items-center justify-center"
              >
                <Heart className={`w-6 h-6 transition-colors ${liked ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-500'}`} />
                {likeBurst > 0 && (
                  <motion.span aria-hidden
                    key={`tail-burst-${likeBurst}`}
                    initial={{ scale: 0, opacity: 0.55 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.55), transparent 65%)' }}
                  />
                )}
              </motion.span>
              <span className="font-bold text-[15px] tabular-nums">{likeCount.toLocaleString()}</span>
              <span className="text-[13px] font-semibold text-slate-500">{liked ? 'Liked' : 'Like this article'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Read more (other published posts) ── */}
      {related.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-18 md:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold mb-3 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Read More
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-[-0.02em]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  More from <span className="gradient-text-animated">the Echo</span>
                </h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-brand-600 text-[13px] font-bold hover:gap-2.5 transition-all">
                All articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <AnimatePresence>
                {related.map((p, i) => (
                  <RelatedPostCard key={p.id} post={p} index={i} />
                ))}
              </AnimatePresence>
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

/* ─────────── Related-post card (compact grid version) ─────────── */

function RelatedPostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: Math.min(index * 0.06, 0.36), type: 'spring', stiffness: 130, damping: 22 }}
      whileHover={{ y: -4 }}
      className="relative group">

      {/* Animated gradient ring (hover) */}
      <div aria-hidden
        className="absolute -inset-[1.5px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(110,66,255,0.55), rgba(168,85,247,0.55), rgba(236,72,153,0.55), rgba(110,66,255,0.55))',
          backgroundSize: '300% 300%',
          animation: 'aurora 6s ease infinite',
        }} />

      <Link
        href={`/blog/${post.slug}`}
        className="relative block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)] group-hover:shadow-[0_22px_40px_rgba(110,66,255,0.12)] transition-shadow duration-500 h-full">

        <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
          ) : (
            <div className="w-full h-full relative overflow-hidden" style={AURORA_BG_ANIMATED}>
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-white/60" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            {post.category && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${tagColorFor(post.category)}`}>
                {post.category}
              </span>
            )}
            {post.readMinutes && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" /> {post.readMinutes} min
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-slate-900 text-[15px] sm:text-[16px] leading-snug mb-2 group-hover:text-brand-600 transition-colors"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-slate-500 text-[12.5px] leading-relaxed line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            {post.publishedAt ? <span>{formatPostDate(post.publishedAt)}</span> : <span />}
            <span className="inline-flex items-center gap-1 text-brand-600 font-bold">
              Read <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
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
