// app/services/MailService.ts
import nodemailer from 'nodemailer'
import env from '#start/env'

const transporter = nodemailer.createTransport({
  host: env.get('SMTP_HOST'),
  port: Number(env.get('SMTP_PORT')),
  secure: false,
  auth: {
    user: env.get('SMTP_USER'),
    pass: env.get('SMTP_PASS'),
  },
})

export default class MailService {
  static async send(to: string, subject: string, html: string) {
    await transporter.sendMail({
      from: env.get('MAIL_FROM'),
      to,
      subject,
      html,
    })
  }
}
