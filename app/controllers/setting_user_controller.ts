// start/controllers/user_controller.ts
import UserRole from '#models/user_role'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import TeacherUserLanguage from '#models/teacher_user_language'
import { createUserValidator, updateUserValidator } from '#validators/setting_user'

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
    const payload = await request.validateUsing(createUserValidator)

    const {
      role_ids,
      language_ids,
      workday_id,
      ...userData
    } = payload

    const isOnlyStudent = role_ids.length === 1 && role_ids.includes(4)
    if (isOnlyStudent && workday_id != null) {
      return response.badRequest({
        message: 'Los estudiantes no deben tener jornada (workday) asignada.',
      })
    }

    const user = await User.create({ ...userData, workday_id })

    // Asignar múltiples roles
    for (const roleId of role_ids) {
      await UserRole.create({ user_id: user.id, role_id: roleId })


      // Si es profesor y hay idiomas, crear los registros asociados
      if (roleId === 3 && language_ids?.length) {
        for (const langId of language_ids) {
          await TeacherUserLanguage.create({
            user_id: user.id,
            language_id: langId,
          })
        }
      }
    }

    await user.load('documentType')
    if (user.workday_id !== undefined) {
      await user.load('workday')
    }

    // Obtener nombres de roles
    const roles = await UserRole.query()
      .where('user_id', user.id)
      .preload('role')
    const roleNames = roles.map((r) => r.role.name)

    // Obtener idiomas (solo si es profesor)
    let languages: { id: number; name: string }[] = []
    if (role_ids.includes(3)) {
      const teacherLangs = await TeacherUserLanguage.query()
        .where('user_id', user.id)
        .preload('language')

      languages = teacherLangs.map((tl) => ({
        id: tl.language.id,
        name: tl.language.name,
      }))
    }

    return response.created({
      ...user.serialize(),
      roles: roleNames,
      languages,
      workday: user.workday?.journal ?? null,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    const payload = await request.validateUsing(updateUserValidator)

    const {
      role_ids = [],
      language_ids = [],
      workday_id,
      ...userData
    } = payload

    // Validación lógica: Estudiante no puede tener jornada
    if (role_ids.includes(4) && workday_id !== undefined && workday_id !== null) {
      return response.badRequest({
        message: 'Los estudiantes no deben tener jornada (workday) asignada.',
      })
    }

    // Actualizar datos del usuario (excepto password)
    user.merge({ ...userData, workday_id })
    await user.save()

    // Actualizar roles
    if (role_ids.length) {
      await UserRole.query().where('user_id', user.id).delete()
      for (const roleId of role_ids) {
        await UserRole.create({ user_id: user.id, role_id: roleId })
      }
    }

    // Actualizar idiomas si es profesor
    if (role_ids.includes(3)) {
      await TeacherUserLanguage.query().where('user_id', user.id).delete()
      if (language_ids.length) {
        for (const langId of language_ids) {
          await TeacherUserLanguage.create({
            user_id: user.id,
            language_id: langId,
          })
        }
      }
    }

    await user.load('documentType')
    if (user.workday_id !== undefined) {
      await user.load('workday')
    }

    // Obtener nombres de roles
    const roles = await UserRole.query()
      .where('user_id', user.id)
      .preload('role')
    const roleNames = roles.map((r) => r.role.name)

    // Obtener idiomas si es profesor
    let languages: { id: number; name: string }[] = []
    if (role_ids.includes(3)) {
      const teacherLangs = await TeacherUserLanguage.query()
        .where('user_id', user.id)
        .preload('language')
      languages = teacherLangs.map((tl) => ({
        id: tl.language.id,
        name: tl.language.name,
      }))
    }

    return response.ok({
      ...user.serialize(),
      roles: roleNames,
      languages,
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
