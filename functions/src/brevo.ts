/**
 * Minimal Brevo (formerly Sendinblue) transactional email client.
 *
 * Uses the REST API over native fetch rather than the @getbrevo/brevo SDK: one
 * endpoint is all we need, and skipping the dependency keeps cold starts fast.
 *
 * API key is read from the BREVO_API_KEY secret (see index.ts). It is never
 * logged, and never sent to the client.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

/**
 * The verified sender. Brevo will silently drop mail from an unverified sender,
 * so this address must be authenticated in Brevo (Senders, Domains & IPs) with
 * SPF/DKIM configured on the domain.
 *
 * The user sends as info@scholarlyecho.com via Google Workspace "send as" for
 * scholarlyechos@gmail.com; replies land in the Gmail inbox.
 */
export const SENDER = {
  name: 'ScholarlyEcho',
  email: 'info@scholarlyecho.com',
} as const;

/**
 * Where replies land. Safe to use info@scholarlyecho.com: Cloudflare Email
 * Routing publishes MX (route1-3.mx.cloudflare.net) and forwards this address
 * to the Gmail inbox. Verified by a delivered test message on 2026-07-29.
 *
 * Gmail "send as" is also configured for info@ via the Brevo SMTP relay, so a
 * reply typed in Gmail goes back out as info@scholarlyecho.com and the whole
 * thread stays on the domain.
 */
export const REPLY_TO = {
  name: 'ScholarlyEcho',
  email: 'info@scholarlyecho.com',
} as const;

export interface Recipient {
  email: string;
  name?: string;
}

export interface SendEmailInput {
  to: Recipient[];
  subject: string;
  html: string;
  /** Plain-text alternative. Improves deliverability; some clients prefer it. */
  text?: string;
  /** Tag for filtering in Brevo's dashboard, e.g. 'broadcast' or 'test'. */
  tag?: string;
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  /** Safe-to-surface error description. Never contains the API key. */
  error?: string;
}

/**
 * Sends one email to one or more recipients via Brevo.
 *
 * Note on privacy: every address in `to` is visible to every other recipient.
 * Broadcasts must therefore send one message per recipient, not one message
 * with many `to` entries. See sendBatch.
 */
export async function sendEmail(apiKey: string, input: SendEmailInput): Promise<SendResult> {
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: SENDER,
        replyTo: REPLY_TO,
        to: input.to.map((r) => (r.name ? { email: r.email, name: r.name } : { email: r.email })),
        subject: input.subject,
        htmlContent: input.html,
        ...(input.text ? { textContent: input.text } : {}),
        ...(input.tag ? { tags: [input.tag] } : {}),
      }),
    });

    if (!res.ok) {
      // Brevo returns { code, message }. Surface the message but never the key.
      const detail = await res.text().catch(() => '');
      let message = `Brevo responded ${res.status}`;
      try {
        const parsed = JSON.parse(detail) as { message?: string };
        if (parsed?.message) message = `${message}: ${parsed.message}`;
      } catch {
        if (detail) message = `${message}: ${detail.slice(0, 200)}`;
      }
      return { ok: false, error: message };
    }

    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, messageId: data.messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return { ok: false, error: `Failed to reach Brevo: ${message}` };
  }
}

export interface BatchOutcome {
  sent: number;
  failed: number;
  /** First few failures, for surfacing in the admin UI. */
  errors: { email: string; error: string }[];
}

/**
 * Sends individually to each recipient so addresses are never disclosed between
 * them. Runs in small concurrent chunks: enough to be fast, low enough to stay
 * under Brevo's rate limits and the function's memory ceiling.
 */
export async function sendBatch(
  apiKey: string,
  recipients: Recipient[],
  build: (r: Recipient) => { subject: string; html: string; text?: string },
  tag: string,
  chunkSize = 10
): Promise<BatchOutcome> {
  const outcome: BatchOutcome = { sent: 0, failed: 0, errors: [] };

  for (let i = 0; i < recipients.length; i += chunkSize) {
    const chunk = recipients.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(async (r) => {
        const { subject, html, text } = build(r);
        const res = await sendEmail(apiKey, { to: [r], subject, html, text, tag });
        return { email: r.email, res };
      })
    );

    for (const { email, res } of results) {
      if (res.ok) {
        outcome.sent += 1;
      } else {
        outcome.failed += 1;
        if (outcome.errors.length < 10) {
          outcome.errors.push({ email, error: res.error ?? 'Unknown error' });
        }
      }
    }
  }

  return outcome;
}

/** Conservative email shape check. Real validation is the send itself. */
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
