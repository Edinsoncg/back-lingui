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

    const queryUser = User.query()
      .where('is_active', true)
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
      .orderBy('id', 'asc')

    const paginator = await queryUser.paginate(page, limit)

    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  public async get({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('documentType')
      .preload('workday')
      .preload('roles') // Trae los roles como array
      .first()

    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    // Extraer IDs y nombres de roles
    const role_ids = user.roles.map((r) => r.id)
    const roles = user.roles.map((r) => ({ id: r.id, name: r.name }))

    // Cargar idiomas si el usuario tiene rol de profesor (id: 3)
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
      roles,
      languages,
      workday: user.workday?.journal ?? null,
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

    user.is_active = false
    await user.save()

    return response.ok({ message: 'User deactivated successfully' })
  }
}
