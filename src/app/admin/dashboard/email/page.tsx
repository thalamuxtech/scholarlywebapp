'use client';

/**
 * Admin email composer.
 *
 * Flow is deliberately gated: compose -> preview -> send a real test to yourself
 * -> only then can you broadcast. The broadcast button stays disabled until a
 * test has actually been delivered for the current draft, so nothing reaches a
 * live audience that has not been seen in a real inbox first.
 */

import { cloneElement, useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  Mail, Send, Eye, Loader2, CheckCircle2, AlertTriangle, Users, TestTube2,
  RefreshCw, X, Info,
} from 'lucide-react';
import {
  previewEmail, sendTestEmail, countAudience, sendBroadcast, parseEmailList,
  whoAmI, claimFirstAdmin,
  type EmailDraft, type AudienceId, type TemplateId, type BroadcastOutcome, type WhoAmI,
} from '@/lib/email';

const TEMPLATES: { id: TemplateId; label: string; hint: string }[] = [
  { id: 'announcement', label: 'Announcement', hint: 'Cohort news, dates, general updates.' },
  { id: 'newsletter', label: 'Newsletter', hint: 'Regular roundup. Includes an unsubscribe link.' },
  { id: 'program-invite', label: 'Program invite', hint: 'Invite a list to register for a program.' },
];

const AUDIENCES: { id: AudienceId; label: string; hint: string }[] = [
  { id: 'newsletter', label: 'Newsletter subscribers', hint: 'Everyone who signed up via a newsletter form.' },
  { id: 'all-submissions', label: 'All contacts', hint: 'Every unique email that ever submitted a form.' },
  { id: 'custom', label: 'Specific addresses', hint: 'Paste the exact recipients below.' },
];

const EMPTY_DRAFT: EmailDraft = {
  templateId: 'announcement',
  subject: '',
  heading: '',
  bodyText: '',
  panelText: '',
  ctaLabel: '',
  ctaUrl: '',
  preheader: '',
};

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; message: string }
  | { kind: 'ok'; message: string }
  | { kind: 'error'; message: string };

export default function EmailComposerPage() {
  const [draft, setDraft] = useState<EmailDraft>(EMPTY_DRAFT);
  const [audience, setAudience] = useState<AudienceId>('newsletter');
  const [customRaw, setCustomRaw] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<BroadcastOutcome | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [access, setAccess] = useState<WhoAmI | null>(null);
  const [claiming, setClaiming] = useState(false);

  // Resolve admin status on mount. The Cloud Functions enforce this server-side
  // regardless; surfacing it here just explains *why* a send was refused.
  const checkAccess = useCallback(async () => {
    try {
      setAccess(await whoAmI());
    } catch {
      setAccess(null);
    }
  }, []);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  const doClaimAdmin = async () => {
    setClaiming(true);
    setStatus({ kind: 'working', message: 'Granting admin access…' });
    try {
      await claimFirstAdmin();
      await checkAccess();
      setStatus({ kind: 'ok', message: 'You are now an admin. Email sending is enabled.' });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Could not claim admin.' });
    } finally {
      setClaiming(false);
    }
  };

  /**
   * Fingerprint of the current draft. A test send is only valid for the exact
   * content that was tested, so editing anything clears the "tested" state.
   */
  const draftKey = useMemo(() => JSON.stringify(draft), [draft]);
  const [testedKey, setTestedKey] = useState<string | null>(null);
  const hasTestedThisDraft = testedKey === draftKey;

  const customEmails = useMemo(() => parseEmailList(customRaw), [customRaw]);
  const isComplete = Boolean(draft.subject.trim() && draft.heading.trim() && draft.bodyText.trim());

  const set = <K extends keyof EmailDraft>(key: K, value: EmailDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  /* ── Audience size ── */
  const refreshCount = useCallback(async () => {
    try {
      setAudienceCount(null);
      const n = await countAudience(audience, customEmails);
      setAudienceCount(n);
    } catch {
      setAudienceCount(null);
    }
  }, [audience, customEmails]);

  useEffect(() => {
    if (audience === 'custom') {
      setAudienceCount(customEmails.length);
      return;
    }
    void refreshCount();
  }, [audience, customEmails.length, customEmails, refreshCount]);

  /* ── Preview ── */
  const doPreview = async () => {
    if (!isComplete) return;
    setStatus({ kind: 'working', message: 'Rendering preview…' });
    try {
      const { html } = await previewEmail(draft);
      setPreviewHtml(html);
      setStatus({ kind: 'idle' });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Preview failed.' });
    }
  };

  /* ── Test send ── */
  const doTest = async () => {
    if (!isComplete || !testEmail.trim()) return;
    setStatus({ kind: 'working', message: `Sending test to ${testEmail.trim()}…` });
    try {
      await sendTestEmail(draft, testEmail.trim());
      setTestedKey(draftKey);
      setStatus({ kind: 'ok', message: `Test sent to ${testEmail.trim()}. Check the inbox, then broadcast.` });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Test send failed.' });
    }
  };

  /* ── Broadcast ── */
  const doBroadcast = async () => {
    setConfirmOpen(false);
    setStatus({ kind: 'working', message: 'Sending broadcast. Keep this tab open…' });
    setOutcome(null);
    try {
      const res = await sendBroadcast(draft, audience, customEmails);
      setOutcome(res);
      setStatus({
        kind: res.failed > 0 ? 'error' : 'ok',
        message:
          res.failed > 0
            ? `Sent ${res.sent} of ${res.total}. ${res.failed} failed.`
            : `Sent to all ${res.sent} recipients.`,
      });
      setTestedKey(null);
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Broadcast failed.' });
    }
  };

  const busy = status.kind === 'working';

  return (
    <div className="max-w-[1400px]">
      <header className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <Mail className="w-6 h-6 text-brand-600" /> Email
        </h1>
        <p className="text-slate-600 text-sm mt-1.5">
          Compose, preview, send yourself a test, then broadcast. Sent from{' '}
          <span className="font-semibold text-slate-800">info@scholarlyecho.com</span> via Brevo.
        </p>
      </header>

      {/* Admin-access diagnostic. Explains a permission-denied before the admin
          wastes time composing, and offers the one-time bootstrap if no admin
          record exists at all. */}
      {access && !access.isAdmin && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="font-extrabold text-amber-900 text-[15px] mb-1.5"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Your account is not recognised as an admin
              </h2>
              <p className="text-[13px] text-amber-900/85 leading-relaxed mb-2">
                Sending email requires an <code className="font-mono text-[12px]">admin_users</code> record
                with <code className="font-mono text-[12px]">role: &quot;admin&quot;</code>. Signing in is not
                sufficient on its own.
              </p>
              <dl className="text-[12.5px] text-amber-900/80 grid sm:grid-cols-2 gap-x-6 gap-y-1 mb-3">
                <div className="flex gap-2 min-w-0">
                  <dt className="text-amber-800/70 flex-shrink-0">Signed in as</dt>
                  <dd className="font-semibold truncate">{access.email ?? 'unknown'}</dd>
                </div>
                <div className="flex gap-2 min-w-0">
                  <dt className="text-amber-800/70 flex-shrink-0">Your record</dt>
                  <dd className="font-semibold">
                    {access.hasDoc ? `exists, role: ${access.role ?? 'none'}` : 'does not exist'}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-amber-800/70 flex-shrink-0">Admins configured</dt>
                  <dd className="font-semibold tabular-nums">{access.adminUsersCount}</dd>
                </div>
              </dl>

              {access.adminUsersCount === 0 ? (
                <>
                  <p className="text-[13px] text-amber-900/85 mb-3">
                    No admins exist yet, so you can claim the first admin record now.
                  </p>
                  <button type="button" onClick={doClaimAdmin} disabled={claiming}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-[13px] hover:bg-amber-700 disabled:opacity-50 transition-colors cursor-pointer">
                    {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Make me an admin
                  </button>
                </>
              ) : (
                <p className="text-[13px] text-amber-900/85">
                  An admin already exists, so this cannot be self-granted. Ask an existing admin to add
                  a document at <code className="font-mono text-[12px]">admin_users/{access.uid}</code>{' '}
                  with <code className="font-mono text-[12px]">role: &quot;admin&quot;</code>.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start">
        {/* ─── Composer ─── */}
        <div className="space-y-5">
          <Card title="Template">
            <div className="grid sm:grid-cols-3 gap-2.5">
              {TEMPLATES.map((t) => (
                <button key={t.id} type="button" onClick={() => set('templateId', t.id)}
                  className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    draft.templateId === t.id
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/25'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                  <div className="font-bold text-[13px] text-slate-900">{t.label}</div>
                  <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">{t.hint}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Content">
            <Field label="Subject" required hint="Shown in the inbox. Keep under about 60 characters.">
              <input value={draft.subject} onChange={(e) => set('subject', e.target.value)}
                maxLength={200} className={inputCls} placeholder="Summer Coding 2026 starts June 29" />
            </Field>

            <Field label="Preview text" hint="The grey line after the subject in most inboxes.">
              <input value={draft.preheader} onChange={(e) => set('preheader', e.target.value)}
                className={inputCls} placeholder="Two tracks, six weeks, one shipped project." />
            </Field>

            <Field label="Heading" required hint="The large heading inside the email.">
              <input value={draft.heading} onChange={(e) => set('heading', e.target.value)}
                className={inputCls} placeholder="Registration is open" />
            </Field>

            <Field label="Body" required hint="Plain text. Leave a blank line between paragraphs.">
              <textarea value={draft.bodyText} onChange={(e) => set('bodyText', e.target.value)}
                rows={8} className={`${inputCls} resize-y font-normal leading-relaxed`}
                placeholder={'Summer Coding 2026 opens on Monday, June 29.\n\nYour child picks a track, builds a capstone, and demos it on Demo Day.'} />
            </Field>

            <Field label="Highlight panel" hint="Optional. Rendered in a grey callout box.">
              <textarea value={draft.panelText} onChange={(e) => set('panelText', e.target.value)}
                rows={3} className={`${inputCls} resize-y`}
                placeholder={'Starts: Monday, June 29, 2026\nPrice: $245 per child'} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Button label" hint="Optional.">
                <input value={draft.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)}
                  className={inputCls} placeholder="Reserve Your Seat" />
              </Field>
              <Field label="Button link" hint="Must start with https://">
                <input value={draft.ctaUrl} onChange={(e) => set('ctaUrl', e.target.value)}
                  className={inputCls} placeholder="https://scholarly-echo.web.app/summer-coding-2026" />
              </Field>
            </div>
          </Card>

          <Card title="Audience">
            <div className="space-y-2 mb-4">
              {AUDIENCES.map((a) => (
                <label key={a.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    audience === a.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <input type="radio" name="audience" checked={audience === a.id}
                    onChange={() => setAudience(a.id)} className="mt-1 accent-brand-600 cursor-pointer" />
                  <span>
                    <span className="block font-bold text-[13px] text-slate-900">{a.label}</span>
                    <span className="block text-[11.5px] text-slate-600 leading-snug">{a.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {audience === 'custom' && (
              <Field label="Recipients" hint="Separate with commas, semicolons, or new lines.">
                <textarea value={customRaw} onChange={(e) => setCustomRaw(e.target.value)}
                  rows={4} className={`${inputCls} resize-y font-mono text-[12.5px]`}
                  placeholder="parent1@example.com, parent2@example.com" />
              </Field>
            )}

            <div className="flex items-center gap-2 text-[13px] text-slate-700 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200">
              <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {audienceCount === null ? (
                <span className="text-slate-500">Counting recipients…</span>
              ) : (
                <span>
                  <span className="font-bold tabular-nums">{audienceCount.toLocaleString()}</span>{' '}
                  {audienceCount === 1 ? 'recipient' : 'recipients'}
                </span>
              )}
              {audience !== 'custom' && (
                <button type="button" onClick={refreshCount} disabled={busy}
                  className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-50 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              )}
            </div>
          </Card>

          <Card title="Test, then send">
            <div className="mb-4">
              <label htmlFor="test-email" className="block text-[12.5px] font-bold text-slate-800 mb-1.5">
                Send a test to <span className="text-rose-500 ml-0.5" aria-hidden>*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input id="test-email" type="email" value={testEmail} aria-describedby="test-email-hint"
                  onChange={(e) => setTestEmail(e.target.value)}
                  className={inputCls} placeholder="you@example.com" autoComplete="email" />
                <button type="button" onClick={doTest} disabled={busy || !isComplete || !testEmail.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[13px] whitespace-nowrap hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  <TestTube2 className="w-4 h-4" /> Send test
                </button>
              </div>
              <p id="test-email-hint" className="text-[11.5px] text-slate-500 mt-1.5 leading-snug">
                A real send, so you see exactly what recipients get.
              </p>
            </div>

            {/* Gate explanation: why Broadcast may be disabled. */}
            {!hasTestedThisDraft && (
              <div className="flex items-start gap-2.5 text-[12.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
                <Info className="w-4 h-4 mt-px flex-shrink-0 text-amber-600" />
                <span>
                  Send a test of this exact draft before broadcasting. Editing any field
                  requires a fresh test.
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={doPreview} disabled={busy || !isComplete}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-brand-500/25 text-brand-600 font-bold text-[13px] hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                <Eye className="w-4 h-4" /> Refresh preview
              </button>
              <button type="button" onClick={() => setConfirmOpen(true)}
                disabled={busy || !isComplete || !hasTestedThisDraft || !audienceCount}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-[13px] shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer">
                <Send className="w-4 h-4" /> Broadcast
                {audienceCount ? ` to ${audienceCount.toLocaleString()}` : ''}
              </button>
            </div>
          </Card>

          {/* Status */}
          {status.kind !== 'idle' && (
            <div role="status" aria-live="polite"
              className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] border ${
                status.kind === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : status.kind === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
              {status.kind === 'working' && <Loader2 className="w-4 h-4 mt-px animate-spin flex-shrink-0" />}
              {status.kind === 'ok' && <CheckCircle2 className="w-4 h-4 mt-px flex-shrink-0" />}
              {status.kind === 'error' && <AlertTriangle className="w-4 h-4 mt-px flex-shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          {outcome && outcome.errors.length > 0 && (
            <Card title="Failed recipients">
              <ul className="space-y-1.5 text-[12.5px]">
                {outcome.errors.map((e) => (
                  <li key={e.email} className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-mono text-slate-800">{e.email}</span>
                    <span className="text-rose-700">{e.error}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* ─── Live preview ─── */}
        <div className="lg:sticky lg:top-6">
          <Card title="Preview" bodyClass="p-0 overflow-hidden">
            {previewHtml ? (
              <iframe
                title="Email preview"
                srcDoc={previewHtml}
                // No sandbox attribute: a fully-sandboxed frame gets an opaque
                // origin and silently blocks the hosted logo. Scripts are
                // instead blocked by the CSP meta tag the server injects into
                // the preview document (default-src 'none'; img-src https:).
                referrerPolicy="no-referrer"
                className="w-full h-[720px] border-0 bg-white"
              />
            ) : (
              <div className="h-[720px] flex flex-col items-center justify-center text-center px-8 text-slate-500">
                <Eye className="w-9 h-9 mb-3 text-slate-300" />
                <p className="text-[13.5px] font-semibold text-slate-700 mb-1">No preview yet</p>
                <p className="text-[12.5px] leading-relaxed">
                  Fill in the subject, heading, and body, then choose Refresh preview.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ─── Broadcast confirmation ─── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-sm"
          role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 id="confirm-title" className="font-extrabold text-slate-900 text-[17px]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Send to {audienceCount?.toLocaleString()} {audienceCount === 1 ? 'person' : 'people'}?
                </h2>
                <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">
                  This sends immediately and cannot be recalled.
                </p>
              </div>
              <button type="button" onClick={() => setConfirmOpen(false)}
                aria-label="Cancel" className="ml-auto text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <dl className="text-[13px] bg-slate-50 rounded-xl p-3.5 mb-5 space-y-1.5 border border-slate-200">
              <div className="flex gap-2">
                <dt className="text-slate-500 w-20 flex-shrink-0">Subject</dt>
                <dd className="font-semibold text-slate-900">{draft.subject}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-500 w-20 flex-shrink-0">Audience</dt>
                <dd className="text-slate-800">{AUDIENCES.find((a) => a.id === audience)?.label}</dd>
              </div>
            </dl>

            <div className="flex gap-2.5 justify-end">
              <button type="button" onClick={() => setConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-[13px] hover:bg-slate-50 cursor-pointer transition-colors">
                Cancel
              </button>
              <button type="button" onClick={doBroadcast}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-[13px] shadow-md cursor-pointer">
                <Send className="w-4 h-4" /> Send now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Small presentational helpers ─────────────── */

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[13.5px] text-slate-900 ' +
  'placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors';

function Card({ title, children, bodyClass = 'p-5' }: {
  title: string; children: React.ReactNode; bodyClass?: string;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="px-5 py-3.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </h2>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/**
 * Wraps a single form control with a real <label for>. The id is injected into
 * the child element via cloneElement so the label points at the actual input
 * rather than a wrapper div, which would not be announced by screen readers.
 */
function Field({ label, children, hint, required }: {
  label: string; children: React.ReactElement; hint?: string; required?: boolean;
}) {
  const generated = useId();
  const child = children as React.ReactElement<{ id?: string; 'aria-describedby'?: string }>;
  const controlId = child.props.id ?? `field-${generated}`;
  const hintId = hint ? `${controlId}-hint` : undefined;

  return (
    <div className="mb-4 last:mb-0">
      <label htmlFor={controlId} className="block text-[12.5px] font-bold text-slate-800 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5" aria-hidden>*</span>}
      </label>
      {cloneElement(child, { id: controlId, 'aria-describedby': hintId })}
      {hint && <p id={hintId} className="text-[11.5px] text-slate-500 mt-1.5 leading-snug">{hint}</p>}
    </div>
  );
}
