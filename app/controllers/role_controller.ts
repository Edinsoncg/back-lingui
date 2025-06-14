// app/controllers/roles_controller.ts
import Role from '#models/role'
import { createRoleValidator, updateRoleValidator } from '#validators/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  public async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = Role.query()
    if (name) {
      query.whereILike('name', `%${name}%`)
    }

    const paginator = await query.paginate(page, limit)

    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  public async get({ params, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) return response.notFound({ message: 'Role not found' })
    return response.ok(role)
  }

  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createRoleValidator)
    const role = await Role.create(data)
    return response.created(role)
  }

  public async update({ params, request, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) return response.notFound({ message: 'Role not found' })

    const data = await request.validateUsing(updateRoleValidator)
    role.merge(data)
    await role.save()

    return response.ok(role)
  }

  public async destroy({ params, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) return response.notFound({ message: 'Role not found' })

    await role.delete()
    return response.ok({ message: 'Role deleted successfully' })
  }
}

/*
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RoleController {
  public async list({ response }: HttpContext) {
    const roles = await Role.all()
    return response.ok(roles)
  }
} */
