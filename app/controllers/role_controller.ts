// start/controllers/role_controller.ts
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RoleController {
  public async list({ response }: HttpContext) {
    const roles = await Role.all()
    return response.ok(roles)
  }
}
