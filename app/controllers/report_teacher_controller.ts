import type { HttpContext } from '@adonisjs/core/http'
import TeacherUserLanguage from '#models/teacher_user_language'
import ClassroomSession from '#models/classroom_session'

export default class ReportTeacherController {
  // 📋 Vista general
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search', '').trim().toLowerCase()

    const query = TeacherUserLanguage.query()
      .preload('user')
      .preload('language')
      .preload('user', (q) => q.preload('workday'))

    if (search) {
      query.whereHas('user', (q) =>
        q.whereILike('first_name', `%${search}%`)
          .orWhereILike('first_last_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      )
    }

    const result = await query.paginate(page, limit)

    const formatted = await Promise.all(
      result.all().map(async (teacher) => {
        const name = [teacher.user.first_name, teacher.user.middle_name, teacher.user.first_last_name, teacher.user.second_last_name]
          .filter(Boolean)
          .join(' ')

        const classesCount = await ClassroomSession.query()
          .where('teacher_user_language_id', teacher.id)
          .count('* as total')
          .first()

        return {
          id: teacher.id,
          nombre: name,
          idioma: teacher.language?.name || 'N/A',
          correo: teacher.user.email,
          telefono: teacher.user.phone_number,
          clases_dictadas: Number(classesCount?.$extras.total || 0),
        }
      })
    )

    return response.ok({
      data: formatted,
      total: result.getMeta().total,
    })
  }

  // 📄 Detalle por profesor
  public async show({ params, response }: HttpContext) {
    const teacherId = Number(params.id)

    const teacher = await TeacherUserLanguage.query()
      .where('id', teacherId)
      .preload('user', (q) => q.preload('workday'))
      .preload('language')
      .first()

    if (!teacher) {
      return response.notFound({ message: 'Profesor no encontrado' })
    }

    const sesiones = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId)
      .preload('unit')
      .preload('level')
      .preload('modality')
      .preload('classroom')
      .orderBy('start_at', 'desc')

    const clases = sesiones.map((clase) => ({
      id: clase.id,
      fecha: clase.start_at.toISODate(),
      nivel: clase.level?.name || 'N/A',
      unidad: clase.unit?.name || 'N/A',
      modalidad: clase.modality?.kind || 'N/A',
      salon: clase.classroom?.name || 'N/A',
      duracion: clase.duration,
    }))

    const nombre = [teacher.user.first_name, teacher.user.middle_name, teacher.user.first_last_name, teacher.user.second_last_name]
      .filter(Boolean)
      .join(' ')

    return response.ok({
      profesor: {
        id: teacher.id,
        nombre,
        correo: teacher.user.email,
        telefono: teacher.user.phone_number,
        idioma: teacher.language?.name || 'N/A',
        jornada: teacher.user.workday?.name || 'N/A',
      },
      clases,
    })
  }
}
