// app/controllers/reset_passwords_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import User from '#models/user'
import { resetPasswordValidator } from '#validators/reset_password'

export default class ResetPasswordsController {
  public async handle({ request, response }: HttpContext) {
    const { token, new_password } = await request.validateUsing(resetPasswordValidator)
    try {
      const payload = jwt.verify(token, process.env.APP_KEY as string) as { userId: number }

      const user = await User.find(payload.userId)
      if (!user) {
        return response.notFound({ message: 'User not found.' })
      }

      user.password = new_password
      await user.save()

      return response.ok({ message: 'Password updated successfully.' })
    } catch (error) {
      return response.badRequest({ message: 'Invalid or expired token.' })
    }
  }
}
