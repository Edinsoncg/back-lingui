// start/controllers/user_role_controller.ts
import UserRole from '#models/user_role'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserRoleController {
  public async list({ response }: HttpContext) {
    const userRoles = await UserRole.all()
    return response.ok(userRoles)
  }
}

//Revisar si se esta utilizando
