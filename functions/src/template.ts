/**
 * Branded HTML email shell for ScholarlyEcho.
 *
 * Email clients are not browsers. Constraints that drive every choice here:
 *  - Gmail strips <style> blocks in some contexts, so all critical styling is
 *    inline on the element.
 *  - Outlook (Word rendering engine) ignores flexbox, grid, max-width on divs,
 *    and border-radius. Layout is therefore nested tables with fixed widths.
 *  - The logo is a hosted PNG, never base64 or CID. See BRAND.logoUrl.
 *  - Dark-mode clients may invert backgrounds, so text colour is never left to
 *    default and the header keeps its own dark background.
 */

export const BRAND = {
  name: 'ScholarlyEcho',
  tagline: 'Learn · Inspire · Engage',
  // Hosted PNG. Must be deployed and returning 200 BEFORE the first send:
  // Gmail caches a failed fetch and recipients keep seeing a broken image.
  // Served from the apex domain, which Firebase Hosting also answers.
  logoUrl: 'https://scholarlyecho.com/brand/logo-email.png',
  siteUrl: 'https://scholarlyecho.com',
  supportEmail: 'info@scholarlyecho.com',
  purple: '#6e42ff',
  ink: '#0f172a',
  body: '#475569',
  muted: '#64748b',
  hairline: '#e2e8f0',
  canvas: '#f1f5f9',
} as const;

/** A call-to-action button. Uses a table so Outlook renders the fill. */
export function button(label: string, href: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
    <tr>
      <td align="center" bgcolor="${BRAND.purple}" style="border-radius:12px;">
        <a href="${escapeAttr(href)}"
           style="display:inline-block;padding:14px 30px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/** A muted callout panel for secondary detail (dates, next steps). */
export function panel(innerHtml: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="margin:24px 0;background-color:${BRAND.canvas};border-radius:12px;">
    <tr>
      <td style="padding:18px 20px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:${BRAND.body};">
        ${innerHtml}
      </td>
    </tr>
  </table>`;
}

export interface ShellOptions {
  /** Inner body HTML (already escaped/trusted markup). */
  bodyHtml: string;
  /** Short summary shown in the inbox list next to the subject. */
  preheader: string;
  /**
   * When true, injects a CSP meta tag that permits images but forbids scripts.
   * Used for the admin preview iframe so the frame can load the hosted logo
   * without needing a sandbox that would also block it. Never set for real
   * sends: mail clients strip meta CSP anyway, and it only adds bytes.
   */
  previewCsp?: boolean;
}

/**
 * Wraps body content in the branded shell: dark header with logo, white content
 * card, footer with contact and optional unsubscribe.
 */
export function renderEmail({ bodyHtml, preheader, previewCsp }: ShellOptions): string {
  const year = new Date().getUTCFullYear();

  // Preview-only: allow remote images, block scripts and everything else.
  const csp = previewCsp
    ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https:;">`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="x-apple-disable-message-reformatting">
${csp}
<title>${escapeHtml(BRAND.name)}</title>
<!--[if mso]>
<style>body,table,td,a{font-family:Arial,Helvetica,sans-serif !important;}</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.canvas};">

<!-- Preheader: shown in the inbox preview, hidden in the rendered email. -->
<div style="display:none;font-size:1px;color:${BRAND.canvas};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  ${escapeHtml(preheader)}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:${BRAND.canvas};">
  <tr>
    <td align="center" style="padding:28px 12px;">

      <!-- 600px is the safe maximum for Outlook and mobile clients. -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="width:600px;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.hairline};">

        <!-- Header -->
        <tr>
          <td align="center" bgcolor="#0d1333"
              style="background-color:#0d1333;padding:30px 24px 26px;">
            <img src="${BRAND.logoUrl}" alt="${escapeHtml(BRAND.name)}"
                 width="132" height="105"
                 style="display:block;width:132px;height:auto;border:0;outline:none;text-decoration:none;">
            <div style="margin-top:14px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#a89bff;">
              ${escapeHtml(BRAND.tagline)}
            </div>
          </td>
        </tr>

        <!-- Gradient hairline: amber -> pink -> purple, per brand spec. -->
        <tr>
          <td style="height:3px;line-height:3px;font-size:0;
                     background-color:${BRAND.purple};
                     background-image:linear-gradient(90deg,#f59e0b 0%,#ec4899 50%,#6e42ff 100%);">&nbsp;</td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:34px 34px 12px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.body};">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:22px 34px 30px;border-top:1px solid ${BRAND.hairline};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${BRAND.muted};">
            <div style="margin-bottom:6px;">
              <a href="${BRAND.siteUrl}" style="color:${BRAND.purple};text-decoration:none;font-weight:600;">${BRAND.siteUrl.replace('https://', '')}</a>
              &nbsp;·&nbsp;
              <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.purple};text-decoration:none;">${BRAND.supportEmail}</a>
            </div>
            <div style="color:#94a3b8;">
              &copy; ${year} ${escapeHtml(BRAND.name)}
            </div>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Heading + paragraph helpers so templates stay declarative. */
export function h1(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:1.25;font-weight:800;color:${BRAND.ink};letter-spacing:-0.02em;">${escapeHtml(text)}</h1>`;
}

export function p(html: string): string {
  return `<p style="margin:0 0 16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.body};">${html}</p>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/**
 * Renders admin-authored plain text into email paragraphs. Blank lines split
 * paragraphs; the text is escaped, so admins cannot inject markup.
 */
export function bodyFromPlainText(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => p(escapeHtml(para).replace(/\n/g, '<br>')))
    .join('\n');
}
