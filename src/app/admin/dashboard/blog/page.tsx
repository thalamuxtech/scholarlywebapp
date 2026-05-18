'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref as sref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import {
  BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, X, Loader2,
  Upload, ImageIcon, Search, ExternalLink, Tag as TagIcon, Sparkles, Save
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';
import {
  Post, POST_CATEGORIES, slugify, estimateReadMinutes, formatPostDate
} from '@/lib/posts';

const EMPTY: Omit<Post, 'id'> = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  category: POST_CATEGORIES[0],
  tags: [],
  imageUrl: '',
  imagePath: '',
  author: 'ScholarlyEcho Editorial',
  readMinutes: 1,
  status: 'draft',
  featured: false,
  publishedAt: '',
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Omit<Post, 'id'>>({ ...EMPTY });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) })));
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // Auto-update slug + read time when title/body change in a new post (not when editing).
  useEffect(() => {
    if (editing) return;
    setForm((f) => ({
      ...f,
      slug: f.slug || slugify(f.title || ''),
      readMinutes: estimateReadMinutes(f.body),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.body, editing]);

  const closeEditor = () => {
    setShowEditor(false);
    setEditing(null);
    setForm({ ...EMPTY });
    setTagInput('');
  };

  const startEdit = (p: Post) => {
    setEditing(p);
    setForm({
      slug: p.slug || '',
      title: p.title || '',
      excerpt: p.excerpt || '',
      body: p.body || '',
      category: p.category || POST_CATEGORIES[0],
      tags: p.tags || [],
      imageUrl: p.imageUrl || '',
      imagePath: p.imagePath || '',
      author: p.author || 'ScholarlyEcho Editorial',
      readMinutes: p.readMinutes || estimateReadMinutes(p.body),
      status: p.status || 'draft',
      featured: !!p.featured,
      publishedAt: p.publishedAt || '',
    });
    setShowEditor(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowEditor(true);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('error', 'Image must be under 8 MB.');
      return;
    }
    setUploading(true);
    try {
      // Delete previous image if it was a Storage upload.
      if (form.imagePath) {
        try { await deleteObject(sref(storage, form.imagePath)); } catch { /* ignore missing */ }
      }
      // Preserve the file extension so the storage object has a proper Content-Type hint.
      const dot = file.name.lastIndexOf('.');
      const ext = dot > -1 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      const baseName = dot > -1 ? file.name.slice(0, dot) : file.name;
      const safeBase = slugify(baseName) || 'image';
      const path = `blog/${Date.now()}-${safeBase}${ext ? `.${ext}` : ''}`;
      const r = sref(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setForm((f) => ({ ...f, imageUrl: url, imagePath: path }));
      showToast('success', 'Image uploaded.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Upload failed. Check Storage rules and try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = async () => {
    if (form.imagePath) {
      try { await deleteObject(sref(storage, form.imagePath)); } catch { /* ignore */ }
    }
    setForm((f) => ({ ...f, imageUrl: '', imagePath: '' }));
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags?.includes(v)) { setTagInput(''); return; }
    setForm((f) => ({ ...f, tags: [...(f.tags || []), v] }));
    setTagInput('');
  };
  const removeTag = (t: string) => {
    setForm((f) => ({ ...f, tags: (f.tags || []).filter((x) => x !== t) }));
  };

  const save = async () => {
    if (!form.title?.trim()) { showToast('error', 'Title is required.'); return; }
    const slug = (form.slug?.trim() || slugify(form.title));
    if (!slug) { showToast('error', 'Could not derive a slug from the title.'); return; }
    setSaving(true);
    try {
      const data: Omit<Post, 'id'> & { updatedAt: ReturnType<typeof serverTimestamp> } = {
        ...form,
        slug,
        readMinutes: form.readMinutes || estimateReadMinutes(form.body),
        publishedAt:
          form.status === 'published'
            ? (form.publishedAt && form.publishedAt.length > 0
                ? form.publishedAt
                : new Date().toISOString().slice(0, 10))
            : (form.publishedAt || ''),
        updatedAt: serverTimestamp(),
      };
      if (editing) {
        await updateDoc(doc(db, 'posts', editing.id), data as Record<string, unknown>);
        showToast('success', 'Post updated.');
      } else {
        await addDoc(collection(db, 'posts'), { ...data, createdAt: serverTimestamp() });
        showToast('success', 'Post created.');
      }
      closeEditor();
    } catch (err) {
      console.error(err);
      showToast('error', 'Save failed. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (p: Post) => {
    const next = (p.status || 'draft') === 'published' ? 'draft' : 'published';
    await updateDoc(doc(db, 'posts', p.id), {
      status: next,
      publishedAt: next === 'published'
        ? (p.publishedAt && p.publishedAt.length > 0 ? p.publishedAt : new Date().toISOString().slice(0, 10))
        : p.publishedAt || '',
      updatedAt: serverTimestamp(),
    });
    showToast('success', `Marked as ${next}.`);
  };

  const toggleFeatured = async (p: Post) => {
    await updateDoc(doc(db, 'posts', p.id), {
      featured: !p.featured,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (p: Post) => {
    const ok = await confirm({
      title: 'Delete post?',
      description: `"${p.title}" will be permanently deleted. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      itemName: p.title,
    });
    if (!ok) return;
    try {
      if (p.imagePath) {
        try { await deleteObject(sref(storage, p.imagePath)); } catch { /* ignore */ }
      }
      await deleteDoc(doc(db, 'posts', p.id));
      showToast('success', 'Post deleted.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Delete failed.');
    }
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filterStatus !== 'all' && (p.status || 'draft') !== filterStatus) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        p.title?.toLowerCase().includes(s) ||
        p.slug?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s) ||
        p.tags?.some((t) => t.toLowerCase().includes(s))
      );
    });
  }, [posts, search, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Blog Posts
          </h2>
          <p className="text-slate-500 text-[13px]">Create, edit, publish and feature articles shown on /blog.</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-md hover:-translate-y-0.5 transition-all"
          style={{ background: 'linear-gradient(135deg, #6e42ff, #a855f7, #ec4899)' }}>
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, slug, category, tag..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-400" />
        </div>
        {(['all', 'published', 'draft'] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-xl text-[12px] font-bold capitalize transition-all ${filterStatus === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-brand-300'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {!loaded ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading posts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-4">
            {posts.length === 0 ? 'No posts yet. Create the first one.' : 'No posts match your filter.'}
          </p>
          {posts.length === 0 && (
            <button onClick={startNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-md"
              style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
              <Plus className="w-4 h-4" /> New Post
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const published = (p.status || 'draft') === 'published';
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all overflow-hidden flex flex-col">
                <div className="aspect-[16/9] bg-slate-100 relative">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {published ? 'Published' : 'Draft'}
                    </span>
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1.5">
                    <span className="font-bold uppercase tracking-wider">{p.category || 'Uncategorized'}</span>
                    {p.publishedAt && <span>· {formatPostDate(p.publishedAt)}</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 text-[14px] mb-1.5 leading-snug flex-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-[12px] line-clamp-2 mb-3">{p.excerpt}</p>
                  <div className="flex items-center justify-between gap-1 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(p)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => togglePublished(p)} title={published ? 'Unpublish' : 'Publish'} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        {published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => toggleFeatured(p)} title={p.featured ? 'Unfeature' : 'Feature'} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        {p.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => remove(p)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {published && p.slug && (
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline">
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={closeEditor}>
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.18 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-4 overflow-hidden">
              <div className="px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {editing ? 'Edit post' : 'New post'}
                </h3>
                <button onClick={closeEditor} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-5 sm:px-7 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title + slug */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Title *</label>
                  <input value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. 5 things parents should ask before signing a kid up for a coding camp"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Slug</label>
                  <input value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    placeholder="auto-from-title"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-mono focus:outline-none focus:border-brand-400" />
                  <p className="text-[10px] text-slate-400 mt-1">Public URL: <span className="font-mono">/blog/{form.slug || '...'}</span></p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Excerpt</label>
                  <textarea rows={2} value={form.excerpt || ''}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="One or two sentences shown on the listing card."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 resize-none" />
                </div>

                {/* Image */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Cover image</label>
                  {form.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-100 aspect-[16/9] bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="cover" className="w-full h-full object-cover" />
                      <button type="button" onClick={removeImage}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-brand-50/40 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-brand-600 transition-all">
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> <span className="text-xs font-semibold">Uploading...</span></>
                      ) : (
                        <><Upload className="w-5 h-5" /> <span className="text-xs font-semibold">Upload from your computer</span><span className="text-[10px] text-slate-400">JPG / PNG / WebP up to 8 MB</span></>
                      )}
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                  <p className="text-[10px] text-slate-400 mt-1.5">Shown on the left side of the blog card and as the hero image on the post page.</p>
                </div>

                {/* Category + author + read minutes */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white">
                      {POST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Author</label>
                    <input value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. ScholarlyEcho Editorial"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Read time (min)</label>
                    <input type="number" min={1} value={form.readMinutes || 1}
                      onChange={(e) => setForm({ ...form, readMinutes: Math.max(1, parseInt(e.target.value || '1', 10)) })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Tags</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                        placeholder="Type and press Enter"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-slate-200 text-[13px] focus:outline-none focus:border-brand-400" />
                    </div>
                    <button type="button" onClick={addTag} className="px-3 py-2.5 rounded-lg bg-slate-100 text-slate-600 text-[12px] font-bold hover:bg-slate-200">Add</button>
                  </div>
                  {(form.tags && form.tags.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-[11px] font-bold">
                          {t}
                          <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body (markdown) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand-500" /> Body (Markdown)
                  </label>
                  <textarea rows={14} value={form.body || ''}
                    onChange={(e) => setForm({ ...form, body: e.target.value, readMinutes: estimateReadMinutes(e.target.value) })}
                    placeholder={`## Heading\n\nWrite the post in Markdown. Headings, **bold**, _italic_, lists, [links](https://example.com), \`code\`, and images all work.`}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 font-mono leading-relaxed resize-y" />
                  <p className="text-[10px] text-slate-400 mt-1">Read time auto-updates as you type.</p>
                </div>

                {/* Status + publish date + featured */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Publish date</label>
                    <input type="date" value={form.publishedAt || ''}
                      onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Featured</label>
                    <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${form.featured ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200'}`}>
                      {form.featured ? <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> : <StarOff className="w-4 h-4" />}
                      {form.featured ? 'Featured' : 'Not featured'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 sm:px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button onClick={closeEditor} className="px-4 py-2.5 rounded-xl text-slate-600 text-[13px] font-bold hover:bg-slate-100">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all"
                  style={{ background: 'linear-gradient(135deg, #6e42ff, #ec4899)' }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing ? 'Save changes' : 'Create post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
