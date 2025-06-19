import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import MailService from '#services/MailService'
import { forgotPasswordValidator } from '#validators/forgot_password'

export default class ForgotPasswordsController {
  public async send({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'Email is not registered.' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.APP_KEY as string,
      { expiresIn: '15m' }
    )

    const resetLink = `http://147.93.114.138:8669/newpassword?token=${token}`
    const html = `
      <p>Hello ${user.first_name},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `

    await MailService.send(email, 'Password recovery', html)

    return response.ok({ message: 'Recovery email sent successfully.' })
  }
}
