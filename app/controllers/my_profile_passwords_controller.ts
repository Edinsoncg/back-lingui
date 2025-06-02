import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class MyProfilePasswordsController {
  public async update({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const currentPassword = request.input('current_password')
    const newPassword = request.input('new_password')
    const confirmPassword = request.input('confirm_password')

    if (!currentPassword || !newPassword || !confirmPassword) {
      return response.badRequest({ message: 'Todos los campos son obligatorios.' })
    }

    if (newPassword !== confirmPassword) {
      return response.badRequest({ message: 'Las nuevas contraseñas no coinciden.' })
    }

    const isValid = await hash.verify(user.password, currentPassword)

    if (!isValid) {
      return response.unauthorized({ message: 'La contraseña actual es incorrecta.' })
    }

    user.password = newPassword
    await user.save()

    return response.ok({ message: 'Contraseña actualizada correctamente.' })
  }
}
