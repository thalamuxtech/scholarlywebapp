'use client';

/**
 * Client bindings for the email Cloud Functions.
 *
 * Every call is admin-gated server-side (see functions/src/index.ts). Nothing
 * here is trusted: the UI hides the page from non-admins for convenience, but
 * the function itself is what actually enforces access.
 */

import { httpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { functions } from './firebase';

export type TemplateId = 'announcement' | 'newsletter' | 'program-invite';
export type AudienceId = 'newsletter' | 'all-submissions' | 'custom';

export interface EmailDraft {
  templateId: TemplateId;
  subject: string;
  heading: string;
  bodyText: string;
  panelText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  preheader?: string;
}

export interface BroadcastOutcome {
  ok: boolean;
  sent: number;
  failed: number;
  total: number;
  errors: { email: string; error: string }[];
}

/** Turns a callable error into a message safe and useful to show an admin. */
function toMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = String((err as { message: unknown }).message);
    // Firebase prefixes callable errors; strip it for readability.
    return m.replace(/^functions\/[a-z-]+:?\s*/i, '') || fallback;
  }
  return fallback;
}

export async function previewEmail(draft: EmailDraft): Promise<{ html: string }> {
  try {
    const fn = httpsCallable<EmailDraft, { html: string; subject: string }>(functions, 'previewEmail');
    const res: HttpsCallableResult<{ html: string; subject: string }> = await fn(draft);
    return { html: res.data.html };
  } catch (err) {
    throw new Error(toMessage(err, 'Could not render the preview.'));
  }
}

export async function sendTestEmail(draft: EmailDraft, testEmail: string): Promise<void> {
  try {
    const fn = httpsCallable<EmailDraft & { testEmail: string }, { ok: boolean }>(functions, 'sendTestEmail');
    await fn({ ...draft, testEmail });
  } catch (err) {
    throw new Error(toMessage(err, 'Could not send the test email.'));
  }
}

export async function countAudience(
  audience: AudienceId,
  customEmails: string[] = []
): Promise<number> {
  try {
    const fn = httpsCallable<{ audience: AudienceId; customEmails: string[] }, { count: number }>(
      functions,
      'countAudience'
    );
    const res = await fn({ audience, customEmails });
    return res.data.count;
  } catch (err) {
    throw new Error(toMessage(err, 'Could not count that audience.'));
  }
}

export async function sendBroadcast(
  draft: EmailDraft,
  audience: AudienceId,
  customEmails: string[] = []
): Promise<BroadcastOutcome> {
  try {
    const fn = httpsCallable<
      EmailDraft & { audience: AudienceId; customEmails: string[]; confirm: true },
      BroadcastOutcome
    >(functions, 'sendBroadcast');
    const res = await fn({ ...draft, audience, customEmails, confirm: true });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err, 'The broadcast failed to send.'));
  }
}

export interface WhoAmI {
  uid: string;
  email: string | null;
  hasDoc: boolean;
  role: string | null;
  isAdmin: boolean;
  adminUsersCount: number;
}

/** Reports whether the signed-in user is recognised as an admin, and why not. */
export async function whoAmI(): Promise<WhoAmI> {
  try {
    const fn = httpsCallable<void, WhoAmI>(functions, 'whoAmI');
    const res = await fn();
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err, 'Could not check your admin status.'));
  }
}

/** Grants admin to the current user, only if no admin exists yet. */
export async function claimFirstAdmin(): Promise<void> {
  try {
    const fn = httpsCallable<void, { ok: boolean }>(functions, 'claimFirstAdmin');
    await fn();
  } catch (err) {
    throw new Error(toMessage(err, 'Could not claim admin access.'));
  }
}

/** Splits a pasted list of addresses on commas, semicolons, or newlines. */
export function parseEmailList(raw: string): string[] {
  return raw
    .split(/[,;\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
