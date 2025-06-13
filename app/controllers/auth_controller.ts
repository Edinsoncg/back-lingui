import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    await user.load('roles')
    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
      token: token,
    }
  }
}
