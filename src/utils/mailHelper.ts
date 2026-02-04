import { Resend } from 'resend'
import * as env from '../config/env.config'
import * as logger from '../utils/logger'

const resend = new Resend(env.RESEND_API_KEY)

export type SendMailOptionsCompat = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

export const sendMail = async (mailOptions: SendMailOptionsCompat) => {
  try {
    const to = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to]

    const payload = {
      from: mailOptions.from || env.RESEND_FROM,
      to,
      subject: mailOptions.subject,
      ...(mailOptions.html ? { html: mailOptions.html } : {}),
      ...(mailOptions.text ? { text: mailOptions.text } : {}),
    }

    // must have at least html or text
    if (!payload.html && !payload.text) {
      payload.text = ''
    }

    const response = await resend.emails.send(payload as any)

    logger.info('Email sent via Resend', response)
    return response
  } catch (error: any) {
    logger.error('Email send failed', error)
    throw new Error('Email send failed: ' + (error?.message || String(error)))
  }
}