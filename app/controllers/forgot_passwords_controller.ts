// app/controllers/forgot_passwords_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import MailService from '#services/MailService'

export default class ForgotPasswordsController {
  public async send({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.badRequest({ message: 'El correo no está registrado.' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.APP_KEY as string,
      { expiresIn: '15m' }
    )

    const resetLink = `http://localhost:5173/newpassword?token=${token}`
    const html = `
      <p>Hola ${user.first_name},</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p><a href="${resetLink}">Haz clic aquí para restablecer tu contraseña</a></p>
      <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
    `

    await MailService.send(email, 'Recuperación de contraseña', html)

    return response.ok({ message: 'Se ha enviado el correo de recuperación.' })
  }
}
