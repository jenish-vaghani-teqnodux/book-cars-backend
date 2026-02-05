import * as env from '../config/env.config'
import * as logger from '../utils/logger'

export type SendMailOptionsCompat = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string; // user email -> reply_to
};

const asArray = (v: string | string[]) => (Array.isArray(v) ? v : [v])

export const sendMail = async (mailOptions: SendMailOptionsCompat) => {
  try {
    if (!env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is missing in env')
}

if (!env.MAIL_FROM) {
  throw new Error('MAIL_FROM is missing in env (must be verified in SendGrid)')
}


    const to = asArray(mailOptions.to)
    const html = mailOptions.html
    const text = mailOptions.text ?? (!html ? '' : undefined)

    const payload: any = {
      personalizations: [{ to: to.map(email => ({ email })) }],
      from: { email: env.MAIL_FROM }, // ✅ always verified sender
      subject: mailOptions.subject,
      content: [
        ...(html ? [{ type: 'text/html', value: html }] : []),
        ...(text !== undefined ? [{ type: 'text/plain', value: text }] : []),
      ],
    }

    // ✅ reply_to only when user email is provided
    if (mailOptions.from) {
      payload.reply_to = { email: mailOptions.from }
    }

    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '')
      logger.error('Email send failed via SendGrid', { status: resp.status, errText })
      throw new Error(`SendGrid error ${resp.status}: ${errText}`)
    }

    logger.info('Email sent via SendGrid', { to, subject: mailOptions.subject })
    return { ok: true, provider: 'sendgrid' }
  } catch (error: any) {
    logger.error('Email send failed', error)
    throw new Error('Email send failed: ' + (error?.message || String(error)))
  }
}
