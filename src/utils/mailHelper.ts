import * as env from '../config/env.config'
import * as logger from '../utils/logger'

export type SendMailOptionsCompat = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

const asArray = (v: string | string[]) => (Array.isArray(v) ? v : [v])

export const sendMail = async (mailOptions: SendMailOptionsCompat) => {
  try {
    if (!env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is missing in env')
    }

    const to = asArray(mailOptions.to)

    const fromEmail = mailOptions.from || env.MAIL_FROM
    if (!fromEmail) {
      throw new Error('MAIL_FROM is missing')
    }

    const payload = {
      sender: { email: fromEmail },
      to: to.map(email => ({ email })),
      subject: mailOptions.subject,
      htmlContent: mailOptions.html,
      textContent: mailOptions.text,
    }

    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      logger.error('Email send failed via Brevo', { status: resp.status, errText })
      throw new Error(`Brevo error ${resp.status}: ${errText}`)
    }

    logger.info('Email sent via Brevo', { to, subject: mailOptions.subject })
    return { ok: true, provider: 'brevo' }
  } catch (error: any) {
    logger.error('Email send failed', error)
    throw new Error('Email send failed: ' + (error?.message || String(error)))
  }
}
