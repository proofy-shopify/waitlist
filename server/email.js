// Transactional emails sent through Resend (https://resend.com).

const COLORS = { blue: '#0EA5E9', navy: '#0B1733', text: '#3B465F', faint: '#7A8499', bg: '#EAF6FD', line: '#E3EAF2' };

const escape = s =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function layout({ preheader, heading, body, button, fallbackUrl, footer }) {
  const font = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;">
      <tr><td style="padding:36px 36px 8px;font-family:${font};">
        <p style="margin:0 0 28px;font-size:18px;font-weight:700;font-style:italic;letter-spacing:-0.02em;color:${COLORS.navy};">proofy</p>
        <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;letter-spacing:-0.03em;color:${COLORS.navy};">${escape(heading)}</h1>
        ${body.map(p => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${COLORS.text};">${p}</p>`).join('\n        ')}
      </td></tr>
      ${
        button
          ? `<tr><td style="padding:8px 36px 8px;font-family:${font};">
        <a href="${escape(button.url)}" style="display:inline-block;padding:13px 26px;border-radius:999px;background:${COLORS.blue};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${escape(button.label)}</a>
      </td></tr>
      <tr><td style="padding:16px 36px 0;font-family:${font};">
        <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.faint};">Button not working? Paste this link into your browser:<br><a href="${escape(fallbackUrl)}" style="color:${COLORS.blue};word-break:break-all;">${escape(fallbackUrl)}</a></p>
      </td></tr>`
          : ''
      }
      <tr><td style="padding:28px 36px 32px;font-family:${font};">
        <p style="margin:0;padding-top:18px;border-top:1px solid ${COLORS.line};font-size:12px;line-height:1.6;color:${COLORS.faint};">${footer}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function footerHtml(cfg, unsubscribeUrl) {
  const site = cfg.siteUrl.replace(/^https?:\/\//, '');
  return `You’re getting this because you joined the Proofy waitlist at ${escape(site)}. <a href="${escape(
    unsubscribeUrl
  )}" style="color:${COLORS.faint};">Unsubscribe</a>`;
}

export function confirmEmail(cfg, { confirmUrl, unsubscribeUrl }) {
  const subject = 'Confirm your spot on the Proofy waitlist';
  const html = layout({
    preheader: 'One click and you’re on the list.',
    heading: 'Confirm your spot',
    body: [
      'Thanks for joining the Proofy waitlist. Proofy turns the best comments on your Facebook and Instagram ads into reviews on your Shopify store.',
      'Click the button below to confirm your email and lock in your place in line.'
    ],
    button: { label: 'Confirm my spot', url: confirmUrl },
    fallbackUrl: confirmUrl,
    footer: `${footerHtml(cfg, unsubscribeUrl)}<br>If you didn’t sign up, ignore this email and you won’t hear from us again.`
  });
  const text = [
    'Confirm your spot on the Proofy waitlist',
    '',
    'Thanks for joining. Open this link to confirm your email and lock in your place in line:',
    confirmUrl,
    '',
    'If you didn’t sign up, ignore this email and you won’t hear from us again.',
    `Unsubscribe: ${unsubscribeUrl}`
  ].join('\n');
  return { subject, html, text };
}

export function welcomeEmail(cfg, { unsubscribeUrl }) {
  const subject = 'You’re on the Proofy waitlist';
  const html = layout({
    preheader: 'We’ll email you the moment Proofy is ready.',
    heading: 'You’re on the list',
    body: [
      'Thanks for joining the Proofy waitlist. Proofy turns the best comments on your Facebook and Instagram ads into reviews on your Shopify store.',
      'We’re letting stores in a few at a time. We’ll email you as soon as your invite is ready.'
    ],
    footer: footerHtml(cfg, unsubscribeUrl)
  });
  const text = [
    'You’re on the Proofy waitlist',
    '',
    'Thanks for joining. We’ll email you as soon as your invite is ready.',
    '',
    `Unsubscribe: ${unsubscribeUrl}`
  ].join('\n');
  return { subject, html, text };
}

// Sends an email. Returns true when sent. Without RESEND_API_KEY it only logs (handy in development).
export async function sendEmail(cfg, { to, subject, html, text, unsubscribeUrl, idempotencyKey }) {
  if (!cfg.resendKey || !cfg.mailFrom) {
    console.warn(`[waitlist] RESEND_API_KEY or MAIL_FROM not set: email to ${to} not sent. Subject: "${subject}"\n${text}`);
    return false;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.resendKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
    },
    body: JSON.stringify({
      from: cfg.mailFrom,
      to: [to],
      subject,
      html,
      text,
      ...(cfg.mailReplyTo ? { reply_to: cfg.mailReplyTo } : {}),
      headers: {
        // One-click unsubscribe (RFC 8058): Gmail and Yahoo show an "Unsubscribe" button using these.
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    }),
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) {
    throw new Error(`Resend failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
  return true;
}
