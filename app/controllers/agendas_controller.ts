// app/controllers/agenda_controller.ts

import ClassroomSession from '#models/classroom_session'
import type { HttpContext } from '@adonisjs/core/http'

function formatToLocalISOString(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 19) // "YYYY-MM-DDTHH:MM:SS"
}

export default class AgendaController {
  public async list({ request, response }: HttpContext) {
    const date = request.input('date')
    if (!date) {
      return response.badRequest({ message: 'Parámetro "date" es obligatorio' })
    }

    try {
      const startOfDay = new Date(`${date}T00:00:00`)
      const endOfDay = new Date(`${date}T23:59:59`)

      const sessions = await ClassroomSession.query()
        .whereBetween('start_at', [startOfDay, endOfDay])
        .preload('classType')
        .preload('classroom', (query) => {
          query.preload('house')
        })
        .preload('unit', (query) => {
          query.preload('level')
        })
        .preload('teacher', (query) => {
          query.preload('user')
          query.preload('language')
        })
        .preload('attendances')

      // Transforma las fechas
      const result = sessions.map((session) => {
        return {
          ...session.toJSON(),
          startAt: formatToLocalISOString(session.start_at),
          endAt: formatToLocalISOString(session.end_at),
        }
      })

      return response.ok(result)
    } catch (error) {
      console.error('AgendaController error:', error)
      return response.internalServerError({ message: 'Error al obtener sesiones' })
    }
  }

  async get({ params, response }: HttpContext) {
    const session = await ClassroomSession.find(params.id)
    if (!session) {
      return response.notFound({ message: 'Classroom session not found' })
    }
    return response.ok(session)
  }

  async create({ request, response }: HttpContext) {
    const data = request.only([
      'classroom_id',
      'modality_id',
      'unit_id',
      'teacher_user_language_id',
      'class_type_id',
      'start_at',
      'end_at',
      'duration',
    ])

    const session = await ClassroomSession.create(data)
    return response.created(session)
  }

  async update({ params, request, response }: HttpContext) {
    const session = await ClassroomSession.find(params.id)
    if (!session) {
      return response.notFound({ message: 'Classroom session not found' })
    }

    const data = request.only([
      'classroom_id',
      'modality_id',
      'unit_id',
      'teacher_user_language_id',
      'class_type_id',
      'start_at',
      'end_at',
      'duration',
    ])

    session.merge(data)
    await session.save()

    return response.ok(session)
  }

  async destroy({ params, response }: HttpContext) {
    const session = await ClassroomSession.find(params.id)
    if (!session) {
      return response.notFound({ message: 'Classroom session not found' })
    }

    await session.delete()
    return response.ok({ message: 'Classroom session deleted successfully' })
  }
}
