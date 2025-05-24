// start/controllers/user_controller.ts
import UserRole from '#models/user_role'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  public async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')

    const query = UserRole.query()
      .preload('user', (userQuery) => {
        userQuery.preload('documentType').preload('workday')
      })
      .preload('role')

    if (search) {
      query.whereHas('user', (userQuery) => {
        userQuery
          .whereILike('first_name', `%${search}%`)
          .orWhereILike('first_last_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      })
    }

    const paginator = await query.paginate(page, limit)

    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  public async get({ params, response }: HttpContext) {
    const userRole = await UserRole.query()
      .where('user_id', params.id)
      .preload('user', (userQuery) => {
        userQuery.preload('documentType').preload('workday')
      })
      .preload('role')
      .first()

    if (!userRole) {
      return response.notFound({ message: 'User not found or role not assigned' })
    }

    return response.ok({
      ...userRole.user.serialize(),
      role: userRole.role!.name,
      role_id: userRole.role_id,
    })
  }

  public async create({ request, response }: HttpContext) {
    const userData = request.only([
      'first_name',
      'middle_name',
      'first_last_name',
      'second_last_name',
      'document_type_id',
      'document_number',
      'email',
      'password',
      'phone_number',
      'workday_id',
    ])
    const roleId = request.input('role_id')

    const user = await User.create(userData)

    await UserRole.create({
      user_id: user.id,
      role_id: roleId,
    })

    await user.load('documentType')
    await user.load('workday')

    return response.created({
      ...user.serialize(),
      role_id: roleId,
      document_type: user.documentType!.name,
      workday: user.workday?.journal ?? null,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const userData = request.only([
      'first_name',
      'middle_name',
      'first_last_name',
      'second_last_name',
      'document_type_id',
      'document_number',
      'email',
      'password',
      'phone_number',
      'workday_id',
    ])
    const roleId = request.input('role_id')

    user.merge(userData)
    await user.save()

    if (roleId) {
      await UserRole.updateOrCreate({ user_id: user.id }, { role_id: roleId })
    }

    await user.load('documentType')
    await user.load('workday')

    return response.ok({
      ...user.serialize(),
      role_id: roleId,
      document_type: user.documentType!.name,
      workday: user.workday?.journal ?? null,
    })
  }

  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    await UserRole.query().where('user_id', user.id).delete()
    await user.delete()

    return response.ok({ message: 'User deleted successfully' })
  }
}
