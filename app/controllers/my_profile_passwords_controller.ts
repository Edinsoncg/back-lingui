import { updatePasswordValidator } from '#validators/profile_password'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class MyProfilePasswordsController {
  public async update({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { current_password, new_password } = await request.validateUsing(updatePasswordValidator)

    const isValid = await hash.verify(user.password, current_password)

    if (!isValid) {
      return response.unauthorized({ message: 'Current password is incorrect.' })
    }

    user.password = new_password
    await user.save()

    return response.ok({ message: 'Password updated successfully.' })
  }
}
