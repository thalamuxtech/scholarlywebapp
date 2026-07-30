'use client';

/**
 * Admin email composer.
 *
 * Flow: compose -> preview -> optionally send a real test -> broadcast. The test
 * send and CC/BCC are all optional. Testing is not enforced, but the draft is
 * fingerprinted so the UI can say whether the exact current content has been
 * tested, and the confirmation dialog calls out an untested send.
 */

import { cloneElement, useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  Mail, Send, Eye, Loader2, CheckCircle2, AlertTriangle, Users, TestTube2,
  RefreshCw, X, Info, UserPlus,
} from 'lucide-react';
import {
  previewEmail, sendTestEmail, listAudience, sendBroadcast, parseEmailList,
  whoAmI, claimFirstAdmin,
  type EmailDraft, type AudienceId, type TemplateId, type BroadcastOutcome, type WhoAmI,
  type Recipient,
} from '@/lib/email';

const TEMPLATES: { id: TemplateId; label: string; hint: string }[] = [
  { id: 'announcement', label: 'Announcement', hint: 'Cohort news, dates, general updates.' },
  { id: 'newsletter', label: 'Newsletter', hint: 'Regular roundup for subscribers.' },
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
  /** The editable send list, resolved from the audience then hand-adjusted. */
  const [recipients, setRecipients] = useState<Recipient[] | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [addRaw, setAddRaw] = useState('');
  const [ccRaw, setCcRaw] = useState('');
  const [bccRaw, setBccRaw] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
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

  const customEmails = useMemo(() => parseEmailList(customRaw), [customRaw]);
  const ccList = useMemo(() => parseEmailList(ccRaw), [ccRaw]);
  const bccList = useMemo(() => parseEmailList(bccRaw), [bccRaw]);
  const isComplete = Boolean(draft.subject.trim() && draft.heading.trim() && draft.bodyText.trim());
  const audienceCount = recipients?.length ?? null;

  /**
   * The draft as it will actually be sent. CC/BCC are part of that, so they
   * belong to the tested fingerprint below: changing either must invalidate a
   * previous test rather than let it stand.
   */
  const draftWithExtras = useMemo<EmailDraft>(
    () => ({ ...draft, cc: ccList, bcc: bccList }),
    [draft, ccList, bccList]
  );

  /**
   * Fingerprint of the current draft. A test send is only valid for the exact
   * content that was tested, so editing anything clears the "tested" state.
   */
  const draftKey = useMemo(() => JSON.stringify(draftWithExtras), [draftWithExtras]);
  const [testedKey, setTestedKey] = useState<string | null>(null);
  const hasTestedThisDraft = testedKey === draftKey;

  const set = <K extends keyof EmailDraft>(key: K, value: EmailDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  /* ── Recipient list ── */

  /** Loads the audience into the editable list, discarding any prior edits. */
  const loadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await listAudience(audience, customEmails);
      setRecipients(res.recipients);
      setTruncated(res.truncated);
      if (res.truncated) {
        setStatus({
          kind: 'error',
          message: `That audience has ${res.total.toLocaleString()} people; only the first ${res.recipients.length.toLocaleString()} were loaded for editing.`,
        });
      }
    } catch (err) {
      setRecipients(null);
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Could not load recipients.' });
    } finally {
      setLoadingList(false);
    }
  }, [audience, customEmails]);

  // Reload whenever the audience changes. Edits are intentionally discarded:
  // silently carrying removals across a different audience would be misleading.
  useEffect(() => {
    void loadList();
  }, [loadList]);

  const removeRecipient = (email: string) =>
    setRecipients((list) => (list ?? []).filter((r) => r.email !== email));

  /** Adds typed addresses, skipping duplicates and anything malformed. */
  const addRecipients = () => {
    const parsed = parseEmailList(addRaw);
    if (parsed.length === 0) return;

    const existing = new Set((recipients ?? []).map((r) => r.email.toLowerCase()));
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const additions: Recipient[] = [];
    const rejected: string[] = [];

    for (const raw of parsed) {
      const email = raw.toLowerCase();
      if (!valid.test(email)) { rejected.push(raw); continue; }
      if (existing.has(email)) continue;
      existing.add(email);
      additions.push({ email });
    }

    setRecipients((list) => [...(list ?? []), ...additions]);
    setAddRaw('');
    setStatus(
      rejected.length
        ? { kind: 'error', message: `Skipped ${rejected.length} invalid: ${rejected.slice(0, 3).join(', ')}` }
        : { kind: 'ok', message: `Added ${additions.length} ${additions.length === 1 ? 'recipient' : 'recipients'}.` }
    );
  };

  const visibleRecipients = useMemo(() => {
    const list = recipients ?? [];
    const q = recipientFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => r.email.includes(q) || (r.name ?? '').toLowerCase().includes(q));
  }, [recipients, recipientFilter]);

  /* ── Preview ── */
  const doPreview = async () => {
    if (!isComplete) return;
    setStatus({ kind: 'working', message: 'Rendering preview…' });
    try {
      const { html } = await previewEmail(draftWithExtras);
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
      await sendTestEmail(draftWithExtras, testEmail.trim());
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
      const res = await sendBroadcast(draftWithExtras, audience, customEmails, recipients ?? undefined);
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
              {loadingList ? (
                <span className="text-slate-500 inline-flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading recipients…
                </span>
              ) : audienceCount === null ? (
                <span className="text-slate-500">No recipients loaded.</span>
              ) : (
                <span>
                  <span className="font-bold tabular-nums">{audienceCount.toLocaleString()}</span>{' '}
                  {audienceCount === 1 ? 'recipient' : 'recipients'} will receive this
                </span>
              )}
              <button type="button" onClick={loadList} disabled={busy || loadingList}
                className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-50 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Reload
              </button>
            </div>
          </Card>

          {/* ─── Editable recipient list ─── */}
          <Card title="Recipients">
            <p className="text-[12.5px] text-slate-600 mb-3.5 leading-relaxed">
              This is the exact list that will be sent to. Remove anyone with the
              &times;, or add addresses below. Each person receives their own
              message and never sees the others.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <input value={addRaw} onChange={(e) => setAddRaw(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRecipients(); } }}
                className={inputCls} placeholder="add@example.com, another@example.com"
                aria-label="Add recipients" />
              <button type="button" onClick={addRecipients} disabled={!addRaw.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[13px] whitespace-nowrap hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                <UserPlus className="w-4 h-4" /> Add
              </button>
            </div>

            {(recipients?.length ?? 0) > 8 && (
              <input value={recipientFilter} onChange={(e) => setRecipientFilter(e.target.value)}
                className={`${inputCls} mb-2.5`} placeholder="Filter this list…"
                aria-label="Filter recipients" />
            )}

            {truncated && (
              <div className="flex items-start gap-2 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2.5">
                <Info className="w-3.5 h-3.5 mt-px flex-shrink-0 text-amber-600" />
                <span>This audience was too large to load fully. Only the loaded addresses will be sent to.</span>
              </div>
            )}

            {loadingList ? (
              <div className="py-8 text-center text-slate-500 text-[13px]">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading…
              </div>
            ) : (recipients?.length ?? 0) === 0 ? (
              <div className="py-7 text-center text-slate-500 text-[13px] bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No recipients. Add addresses above, or pick a different audience.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5 max-h-[260px] overflow-y-auto p-1 rounded-xl border border-slate-200 bg-slate-50/60">
                  {visibleRecipients.map((r) => (
                    <span key={r.email}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-white border border-slate-200 text-[12px] text-slate-800 max-w-full">
                      <span className="truncate" title={r.name ? `${r.name} <${r.email}>` : r.email}>
                        {r.name ? `${r.name} · ` : ''}{r.email}
                      </span>
                      <button type="button" onClick={() => removeRecipient(r.email)}
                        aria-label={`Remove ${r.email}`}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {recipientFilter.trim() && (
                  <p className="text-[11.5px] text-slate-500 mt-2">
                    Showing {visibleRecipients.length.toLocaleString()} of{' '}
                    {(recipients?.length ?? 0).toLocaleString()}. Sending goes to the full list,
                    not just the filtered view.
                  </p>
                )}
              </>
            )}
          </Card>

          {/* ─── CC / BCC ─── */}
          <Card title="CC and BCC">
            <p className="text-[12.5px] text-slate-600 mb-3.5 leading-relaxed">
              Added to <em>every</em> message, so keep these to a few fixed
              addresses such as yourself or a colleague. Putting the audience
              here would expose every address to everyone.
            </p>

            <Field label="CC" hint="Visible to the recipient of each message.">
              <input value={ccRaw} onChange={(e) => setCcRaw(e.target.value)}
                className={inputCls} placeholder="colleague@scholarlyecho.com" />
            </Field>
            <Field label="BCC" hint="Hidden from recipients. Useful for an archive copy.">
              <input value={bccRaw} onChange={(e) => setBccRaw(e.target.value)}
                className={inputCls} placeholder="archive@scholarlyecho.com" />
            </Field>

            {(ccList.length > 0 || bccList.length > 0) && (
              <div className="text-[12px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                Each of the {(audienceCount ?? 0).toLocaleString()} messages will also copy{' '}
                {ccList.length > 0 && <><span className="font-semibold">{ccList.length} CC</span></>}
                {ccList.length > 0 && bccList.length > 0 && ' and '}
                {bccList.length > 0 && <><span className="font-semibold">{bccList.length} BCC</span></>}
                .{' '}
                {(ccList.length + bccList.length) * (audienceCount ?? 0) > 100 && (
                  <span className="text-amber-800">
                    That is a lot of extra deliveries against your daily quota.
                  </span>
                )}
              </div>
            )}
          </Card>

          <Card title="Test and send">
            <div className="mb-4">
              <label htmlFor="test-email" className="block text-[12.5px] font-bold text-slate-800 mb-1.5">
                Send a test to <span className="font-normal text-slate-500">(optional)</span>
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
                A real send to one address, so you see exactly what recipients get.
              </p>
            </div>

            {/* Testing is recommended, not required: this advises rather than blocks. */}
            {hasTestedThisDraft ? (
              <div className="flex items-start gap-2.5 text-[12.5px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 mb-4">
                <CheckCircle2 className="w-4 h-4 mt-px flex-shrink-0 text-emerald-600" />
                <span>This exact draft has been tested. Editing any field clears this.</span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-[12.5px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 mb-4">
                <Info className="w-4 h-4 mt-px flex-shrink-0 text-slate-500" />
                <span>
                  Not tested yet. A test send is optional, but recommended for anything
                  going to more than a handful of people.
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={doPreview} disabled={busy || !isComplete}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-brand-500/25 text-brand-600 font-bold text-[13px] hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                <Eye className="w-4 h-4" /> Refresh preview
              </button>
              <button type="button" onClick={() => setConfirmOpen(true)}
                disabled={busy || !isComplete || !audienceCount}
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
                {/* With testing optional, this is the last chance to notice. */}
                {!hasTestedThisDraft && (
                  <p className="text-amber-800 text-[12.5px] mt-2 leading-relaxed font-semibold">
                    You have not sent a test of this draft.
                  </p>
                )}
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
              {ccList.length > 0 && (
                <div className="flex gap-2">
                  <dt className="text-slate-500 w-20 flex-shrink-0">CC</dt>
                  <dd className="text-slate-800 break-all">{ccList.join(', ')}</dd>
                </div>
              )}
              {bccList.length > 0 && (
                <div className="flex gap-2">
                  <dt className="text-slate-500 w-20 flex-shrink-0">BCC</dt>
                  <dd className="text-slate-800 break-all">{bccList.join(', ')}</dd>
                </div>
              )}
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
