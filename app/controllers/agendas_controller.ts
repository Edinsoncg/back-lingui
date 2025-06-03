// app/controllers/agenda_controller.ts

import ClassroomSession from '#models/classroom_session'
import type { HttpContext } from '@adonisjs/core/http'

export default class AgendaController {
  public async list({ request, response }: HttpContext) {
    const date = request.input('date')
    if (!date) {
      return response.badRequest({ message: 'Parámetro "date" es obligatorio' })
    }

    try {
      const startOfDay = new Date(`${date}T00:00:00.000Z`)
      const endOfDay = new Date(`${date}T23:59:59.999Z`)

      const sessions = await ClassroomSession.query()
        .whereBetween('start_at', [startOfDay, endOfDay])
        .preload('classroom')
        .preload('unit', (query) => {
          query.preload('level')
        })
        .preload('teacher', (query) => {
          query.preload('user')
          query.preload('language')
        })
        .preload('attendances')

      return response.ok(sessions)
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
      'level_id',
      'unit_id',
      'component_id',
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
      'level_id',
      'unit_id',
      'component_id',
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
