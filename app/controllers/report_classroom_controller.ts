import type { HttpContext } from '@adonisjs/core/http'
import Classroom from '#models/classroom'
import ClassroomSession from '#models/classroom_session'

export default class ReportClassroomController {
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search', '').trim().toLowerCase()

    const query = Classroom.query()
      .preload('house')
      .preload('classroomSessions', (q) => q.orderBy('start_at', 'desc'))

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    const result = await query.paginate(page, limit)

    const formatted = await Promise.all(
      result.all().map(async (classroom) => {
        const sesiones = classroom.classroomSessions || []
        const ultimaClase =
          sesiones.length && sesiones[0].start_at
            ? sesiones[0].start_at.toISOString().split('T')[0]
            : 'Sin registro'

        return {
          id: classroom.id,
          nombre: classroom.name,
          capacidad: classroom.capacity,
          house: classroom.house?.name || 'N/A',
          clases_realizadas: sesiones.length,
          ultima_clase: ultimaClase,
        }
      })
    )

    return response.ok({
      data: formatted,
      total: result.getMeta().total,
    })
  }

  public async show({ params, response }: HttpContext) {
    const classroomId = Number(params.id)

    const classroom = await Classroom.query()
      .where('id', classroomId)
      .preload('house')
      .first()

    if (!classroom) {
      return response.notFound({ message: 'Salón no encontrado' })
    }

    const sesiones = await ClassroomSession.query()
      .where('classroom_id', classroomId)
      .orderBy('start_at', 'desc')
      .preload('unit', (unitQuery) => {
        unitQuery.preload('level')
      })
      .preload('modality')
      .preload('teacher', (query) => {
        query.preload('language').preload('user')
      })

    const clases = sesiones.map((clase) => ({
      id: clase.id,
      fecha: clase.start_at.toISOString().split('T')[0],
      nivel: clase.unit?.level?.name || 'N/A',
      unidad: clase.unit?.name || 'N/A',
      modalidad: clase.modality?.kind || 'N/A',
      idioma: clase.teacher?.language?.name || 'N/A',
      profesor: [
        clase.teacher?.user?.first_name,
        clase.teacher?.user?.middle_name,
        clase.teacher?.user?.first_last_name,
        clase.teacher?.user?.second_last_name
      ].filter(Boolean).join(' ') || 'Sin asignar',
      duracion: clase.duration,
    }))

    return response.ok({
      salon: {
        id: classroom.id,
        nombre: classroom.name,
        capacidad: classroom.capacity,
        house: classroom.house?.name || 'N/A',
      },
      clases,
    })
  }
}
