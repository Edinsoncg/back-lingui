import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserRole from '#models/user_role'

export default class InactiveUsersController {
  // LISTAR USUARIOS INACTIVOS
  public async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')

    const queryUser = User.query()
      .where('is_active', false)
      .preload('documentType')
      .preload('workday')
      .preload('roles')
      .if(search, (query) => {
        query.where((builder) =>
          builder
            .whereILike('first_name', `%${search}%`)
            .orWhereILike('first_last_name', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        )
      })
      .orderBy('created_at', 'desc')

    const paginator = await queryUser.paginate(page, limit)

    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  // RESTAURAR USUARIO (ACTIVAR)
  public async restore({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    if (user.is_active) {
      return response.badRequest({ message: 'El usuario ya está activo' })
    }

    user.is_active = true
    await user.save()

    return response.ok({ message: 'Usuario restaurado correctamente' })
  }

  // ELIMINAR DEFINITIVAMENTE
  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    if (user.is_active) {
      return response.badRequest({ message: 'No se puede eliminar un usuario activo' })
    }

    await UserRole.query().where('user_id', user.id).delete()
    await user.delete()

    return response.ok({ message: 'Usuario eliminado definitivamente' })
  }
}
