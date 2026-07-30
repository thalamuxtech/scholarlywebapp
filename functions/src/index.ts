/**
 * ScholarlyEcho Cloud Functions: admin-triggered email via Brevo.
 *
 * Scope note: there are deliberately NO Firestore-triggered automatic emails
 * here. Every send is explicitly initiated by a signed-in admin from
 * /admin/dashboard/email. Transactional automation can be layered on later.
 *
 * Security model:
 *  - All callables require an authenticated caller whose admin_users/{uid} doc
 *    has role == 'admin'. This mirrors isAdmin() in firestore.rules.
 *  - The Brevo API key lives in Secret Manager (BREVO_API_KEY) and is only ever
 *    read inside the function process.
 */

import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

import { sendEmail, sendBatch, isValidEmail, type Recipient } from './brevo';
import { renderEmail, bodyFromPlainText, h1, button, panel, p, BRAND, escapeHtml } from './template';

admin.initializeApp();
const db = admin.firestore();

const BREVO_API_KEY = defineSecret('BREVO_API_KEY');

// europe-west1 is a reasonable default for a Nigeria/Europe/US audience; change
// if the Firestore location differs meaningfully.
setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

/* ───────────────────────── Authorization ───────────────────────── */

/**
 * Throws unless the caller is a signed-in admin. Reads the same admin_users doc
 * the Firestore rules use, so there is one source of truth for who is an admin.
 */
async function assertAdmin(req: CallableRequest): Promise<string> {
  const uid = req.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }
  const snap = await db.doc(`admin_users/${uid}`).get();
  if (!snap.exists || snap.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Admin access is required to send email.');
  }
  return uid;
}

/**
 * Diagnostic: reports the caller's own uid and whether an admin_users doc grants
 * them admin. Requires only sign-in, never reveals anyone else's data, and is
 * safe to keep: it is how an admin self-checks why access was denied.
 */
export const whoAmI = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'You must be signed in.');

  const snap = await db.doc(`admin_users/${uid}`).get();
  const total = (await db.collection('admin_users').count().get()).data().count;

  return {
    uid,
    email: req.auth?.token?.email ?? null,
    hasDoc: snap.exists,
    role: snap.exists ? (snap.data()?.role ?? null) : null,
    isAdmin: snap.exists && snap.data()?.role === 'admin',
    adminUsersCount: total,
  };
});

/**
 * Bootstrap: grants admin to the caller, but ONLY while the admin_users
 * collection is completely empty. Once any admin exists this always throws, so
 * it cannot be used to escalate privileges. Existing admins add others from the
 * dashboard instead.
 */
export const claimFirstAdmin = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'You must be signed in.');

  const existing = await db.collection('admin_users').limit(1).get();
  if (!existing.empty) {
    throw new HttpsError(
      'failed-precondition',
      'An admin already exists. Ask an existing admin to grant you access.'
    );
  }

  await db.doc(`admin_users/${uid}`).set({
    role: 'admin',
    email: req.auth?.token?.email ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    note: 'Bootstrapped as the first admin.',
  });

  return { ok: true, uid, role: 'admin' };
});

/* ───────────────────────── Template rendering ───────────────────────── */

export type TemplateId = 'announcement' | 'newsletter' | 'program-invite';

interface ComposeInput {
  templateId: TemplateId;
  subject: string;
  heading: string;
  /** Admin-authored plain text. Escaped before rendering. */
  bodyText: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** Extra detail rendered in a callout panel. */
  panelText?: string;
  preheader?: string;
}

/** Builds the final HTML for a composed email, personalised per recipient. */
function buildHtml(input: ComposeInput, recipient?: Recipient, previewCsp = false): string {
  const firstName = recipient?.name?.trim().split(/\s+/)[0];
  const greeting = firstName
    ? p(`Hi ${escapeHtml(firstName)},`)
    : p('Hi there,');

  const parts: string[] = [
    h1(input.heading),
    greeting,
    bodyFromPlainText(input.bodyText),
  ];

  if (input.panelText?.trim()) {
    parts.push(panel(bodyFromPlainText(input.panelText)));
  }
  if (input.ctaLabel?.trim() && input.ctaUrl?.trim()) {
    parts.push(button(input.ctaLabel.trim(), input.ctaUrl.trim()));
  }

  parts.push(
    p(`Questions? Just reply to this email and it reaches us directly.`),
    p(`<span style="color:${BRAND.muted};">The ScholarlyEcho team</span>`)
  );

  return renderEmail({
    bodyHtml: parts.join('\n'),
    preheader: input.preheader?.trim() || input.heading,
    previewCsp,
  });
}

/** Plain-text fallback, derived from the same authored content. */
function buildText(input: ComposeInput): string {
  const lines = [input.heading, '', input.bodyText];
  if (input.panelText?.trim()) lines.push('', input.panelText.trim());
  if (input.ctaLabel && input.ctaUrl) lines.push('', `${input.ctaLabel}: ${input.ctaUrl}`);
  lines.push('', 'Questions? Reply to this email.', '', 'The ScholarlyEcho team', BRAND.siteUrl);
  return lines.join('\n');
}

function validateCompose(data: unknown): ComposeInput {
  const d = (data ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

  const subject = str(d.subject);
  const heading = str(d.heading);
  const bodyText = str(d.bodyText);

  if (!subject) throw new HttpsError('invalid-argument', 'Subject is required.');
  if (subject.length > 200) throw new HttpsError('invalid-argument', 'Subject must be 200 characters or fewer.');
  if (!heading) throw new HttpsError('invalid-argument', 'Heading is required.');
  if (!bodyText) throw new HttpsError('invalid-argument', 'Body text is required.');
  if (bodyText.length > 20000) throw new HttpsError('invalid-argument', 'Body is too long.');

  const ctaUrl = str(d.ctaUrl);
  if (ctaUrl && !/^https?:\/\//i.test(ctaUrl)) {
    throw new HttpsError('invalid-argument', 'The button link must start with http:// or https://');
  }

  const templateId = str(d.templateId) as TemplateId;
  const allowed: TemplateId[] = ['announcement', 'newsletter', 'program-invite'];

  return {
    templateId: allowed.includes(templateId) ? templateId : 'announcement',
    subject,
    heading,
    bodyText,
    ctaLabel: str(d.ctaLabel) || undefined,
    ctaUrl: ctaUrl || undefined,
    panelText: str(d.panelText) || undefined,
    preheader: str(d.preheader) || undefined,
  };
}

/* ───────────────────────── Callables ───────────────────────── */

/**
 * Returns the rendered HTML for the composer's live preview. No email is sent,
 * so this needs no Brevo key.
 */
export const previewEmail = onCall(async (req) => {
  await assertAdmin(req);
  const input = validateCompose(req.data);
  return {
    // previewCsp: the iframe renders this without a sandbox, so the document's
    // own CSP is what blocks scripts while still allowing the hosted logo.
    html: buildHtml(input, { email: 'preview@example.com', name: 'Amina' }, true),
    subject: input.subject,
  };
});

/**
 * Sends a single test email to an address the admin specifies, so the exact
 * rendering can be checked in a real inbox before any broadcast.
 */
export const sendTestEmail = onCall({ secrets: [BREVO_API_KEY] }, async (req) => {
  await assertAdmin(req);

  const to = (req.data as Record<string, unknown>)?.testEmail;
  if (!isValidEmail(to)) {
    throw new HttpsError('invalid-argument', 'Enter a valid test email address.');
  }
  const input = validateCompose(req.data);

  // CC/BCC are included so the test reflects exactly what a real send produces.
  const d = (req.data ?? {}) as Record<string, unknown>;
  const cc = parseExtras(d.cc, 'CC');
  const bcc = parseExtras(d.bcc, 'BCC');

  // [TEST] prefix keeps test sends obvious in the inbox.
  const result = await sendEmail(BREVO_API_KEY.value(), {
    to: [{ email: to.trim() }],
    subject: `[TEST] ${input.subject}`,
    html: buildHtml(input, { email: to.trim() }),
    text: buildText(input),
    tag: 'test',
    cc,
    bcc,
  });

  if (!result.ok) {
    throw new HttpsError('internal', result.error ?? 'Brevo rejected the test send.');
  }
  return { ok: true, messageId: result.messageId ?? null };
});

export type AudienceId = 'newsletter' | 'all-submissions' | 'custom';

/** Resolves an audience to a de-duplicated recipient list. */
async function resolveAudience(
  audience: AudienceId,
  customEmails: string[]
): Promise<Recipient[]> {
  if (audience === 'custom') {
    const seen = new Set<string>();
    const out: Recipient[] = [];
    for (const raw of customEmails) {
      const email = raw.trim().toLowerCase();
      if (isValidEmail(email) && !seen.has(email)) {
        seen.add(email);
        out.push({ email });
      }
    }
    return out;
  }

  // Firestore has no DISTINCT, so de-duplicate here: one person may have
  // submitted several forms and must not receive the same broadcast twice.
  const query =
    audience === 'newsletter'
      ? db.collection('submissions').where('formType', '==', 'newsletter')
      : db.collection('submissions');

  const snap = await query.get();
  const byEmail = new Map<string, Recipient>();

  for (const doc of snap.docs) {
    const d = doc.data() as Record<string, unknown>;
    const email = typeof d.email === 'string' ? d.email.trim().toLowerCase() : '';
    if (!isValidEmail(email)) continue;
    if (d.unsubscribed === true) continue;

    if (!byEmail.has(email)) {
      const name =
        (typeof d.name === 'string' && d.name.trim()) ||
        (typeof d.parentName === 'string' && d.parentName.trim()) ||
        undefined;
      byEmail.set(email, name ? { email, name } : { email });
    }
  }

  return Array.from(byEmail.values());
}

/** Counts an audience without sending, so the admin sees the size up front. */
export const countAudience = onCall(async (req) => {
  await assertAdmin(req);
  const d = (req.data ?? {}) as Record<string, unknown>;
  const audience = (typeof d.audience === 'string' ? d.audience : 'newsletter') as AudienceId;
  const custom = Array.isArray(d.customEmails) ? (d.customEmails as string[]) : [];
  const recipients = await resolveAudience(audience, custom);
  return { count: recipients.length };
});

/**
 * Resolves an audience to the actual recipient list so the admin can review it
 * and remove people before sending. Capped to keep the payload sane; the count
 * is reported separately so a truncated list is never mistaken for the whole.
 */
export const listAudience = onCall(async (req) => {
  await assertAdmin(req);
  const d = (req.data ?? {}) as Record<string, unknown>;
  const audience = (typeof d.audience === 'string' ? d.audience : 'newsletter') as AudienceId;
  const custom = Array.isArray(d.customEmails) ? (d.customEmails as string[]) : [];

  const all = await resolveAudience(audience, custom);
  const LIMIT = 2000;
  return {
    recipients: all.slice(0, LIMIT),
    total: all.length,
    truncated: all.length > LIMIT,
  };
});

/** Parses and de-duplicates a CC or BCC list from client input. */
function parseExtras(value: unknown, field: string): Recipient[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const raw of value) {
    const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
    if (!email) continue;
    if (!isValidEmail(email)) {
      throw new HttpsError('invalid-argument', `"${email}" in ${field} is not a valid email address.`);
    }
    if (!seen.has(email)) {
      seen.add(email);
      out.push({ email });
    }
  }
  // Brevo caps recipients per message; keep the fixed extras well under it.
  if (out.length > 20) {
    throw new HttpsError('invalid-argument', `${field} is limited to 20 addresses.`);
  }
  return out;
}

/**
 * Broadcasts to a resolved audience, one message per recipient so addresses are
 * never disclosed between them. Writes an audit record to email_broadcasts.
 */
export const sendBroadcast = onCall(
  { secrets: [BREVO_API_KEY], timeoutSeconds: 540, memory: '512MiB' },
  async (req) => {
    const uid = await assertAdmin(req);
    const input = validateCompose(req.data);

    const d = (req.data ?? {}) as Record<string, unknown>;
    const audience = (typeof d.audience === 'string' ? d.audience : 'newsletter') as AudienceId;
    const custom = Array.isArray(d.customEmails) ? (d.customEmails as string[]) : [];

    // Require an explicit confirmation flag so a broadcast cannot be triggered
    // by an accidental or replayed call.
    if (d.confirm !== true) {
      throw new HttpsError('failed-precondition', 'Broadcast must be explicitly confirmed.');
    }

    const cc = parseExtras(d.cc, 'CC');
    const bcc = parseExtras(d.bcc, 'BCC');

    /**
     * The admin can send an edited list (people removed, others added) rather
     * than the raw audience. It is still validated and de-duplicated here: the
     * client list is a request, not a trusted input.
     */
    let recipients: Recipient[];
    if (Array.isArray(d.recipients) && d.recipients.length > 0) {
      const seen = new Set<string>();
      recipients = [];
      for (const raw of d.recipients as unknown[]) {
        const r = (raw ?? {}) as { email?: unknown; name?: unknown };
        const email = typeof r.email === 'string' ? r.email.trim().toLowerCase() : '';
        if (!isValidEmail(email) || seen.has(email)) continue;
        seen.add(email);
        const name = typeof r.name === 'string' && r.name.trim() ? r.name.trim() : undefined;
        recipients.push(name ? { email, name } : { email });
      }
    } else {
      recipients = await resolveAudience(audience, custom);
    }

    if (recipients.length === 0) {
      throw new HttpsError('failed-precondition', 'There are no valid recipients to send to.');
    }

    const startedAt = admin.firestore.FieldValue.serverTimestamp();
    const outcome = await sendBatch(
      BREVO_API_KEY.value(),
      recipients,
      (r) => ({
        subject: input.subject,
        html: buildHtml(input, r),
        text: buildText(input),
      }),
      'broadcast',
      { cc, bcc }
    );

    // Audit trail: who sent what, to how many, and what failed.
    await db.collection('email_broadcasts').add({
      sentBy: uid,
      audience,
      subject: input.subject,
      heading: input.heading,
      templateId: input.templateId,
      recipientCount: recipients.length,
      cc: cc.map((r) => r.email),
      bcc: bcc.map((r) => r.email),
      // Whether the admin hand-edited the list rather than sending the raw audience.
      listEdited: Array.isArray(d.recipients) && d.recipients.length > 0,
      sent: outcome.sent,
      failed: outcome.failed,
      errors: outcome.errors,
      startedAt,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { ok: true, ...outcome, total: recipients.length };
  }
);
