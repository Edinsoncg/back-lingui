// app/controllers/reset_passwords_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import User from '#models/user'

export default class ResetPasswordsController {
  public async handle({ request, response }: HttpContext) {
    const { token, new_password, confirm_password } = request.only([
      'token',
      'new_password',
      'confirm_password',
    ])

    if (!token || !new_password || !confirm_password) {
      return response.badRequest({ message: 'Faltan datos.' })
    }

    if (new_password !== confirm_password) {
      return response.badRequest({ message: 'Las contraseñas no coinciden.' })
    }

    try {
      const payload = jwt.verify(token, process.env.APP_KEY as string) as { userId: number }

      const user = await User.find(payload.userId)
      if (!user) {
        return response.notFound({ message: 'Usuario no encontrado.' })
      }

      user.password = new_password
      await user.save()

      return response.ok({ message: 'Contraseña actualizada correctamente.' })
    } catch (error) {
      return response.badRequest({ message: 'Token inválido o expirado.' })
    }
  }
}
