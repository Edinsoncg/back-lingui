import ClassroomSession from '#models/classroom_session'
import type { HttpContext } from '@adonisjs/core/http'
import { classroomSessionCreateSchema, classroomSessionUpdateSchema } from '#validators/agenda'
import vine from '@vinejs/vine'

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
    const session = await ClassroomSession.query()
      .where('id', params.id)
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
      .preload('modality')

    if (!session) {
      return response.notFound({ message: 'Classroom session not found' })
    }
    return response.ok(session)
  }

  public async create({ request, response }: HttpContext) {
    const payload = await vine.validate({
      schema: classroomSessionCreateSchema,
      data: request.all(),
    })

    const startAt = new Date(payload.start_at)
    const duration = payload.duration
    const endAt = new Date(startAt.getTime() + duration * 60 * 60 * 1000)

    if (startAt >= endAt) {
      return response.badRequest({ message: 'La fecha de inicio debe ser anterior a la fecha de fin' })
    }

    const startHour = startAt.getHours()
    const endHour = endAt.getHours()

    if (startHour < 6 || startHour > 20) {
      return response.badRequest({ message: 'La clase debe comenzar entre las 6:00 y las 20:00 horas' })
    }

    if (endHour < 7 || endHour > 21) {
      return response.badRequest({ message: 'La clase debe terminar entre las 7:00 y las 21:00 horas' })
    }

    const overlapping = await ClassroomSession.query()
      .where('classroom_id', payload.classroom_id)
      .where((query) => {
        query.where('start_at', '<', endAt).andWhere('end_at', '>', startAt)
      })

    if (overlapping.length > 0) {
      return response.badRequest({ message: 'Ya existe una clase programada en ese horario para este salón' })
    }

    const session = await ClassroomSession.create({
      ...payload,
      start_at: startAt,
      end_at: endAt,
    })

    return response.created(session)
  }

  public async update({ params, request, response }: HttpContext) {
    const session = await ClassroomSession.find(params.id)
    if (!session) {
      return response.notFound({ message: 'Classroom session not found' })
    }

    const payload = await vine.validate({
      schema: classroomSessionUpdateSchema,
      data: request.all(),
    })

    const startAt = payload.start_at ? new Date(payload.start_at) : session.start_at
    const duration = payload.duration ?? session.duration
    const endAt = new Date(startAt.getTime() + duration * 60 * 60 * 1000)

    if (startAt >= endAt) {
      return response.badRequest({ message: 'La fecha de inicio debe ser anterior a la fecha de fin' })
    }

    const startHour = startAt.getHours()
    const endHour = endAt.getHours()

    if (startHour < 6 || startHour > 21) {
      return response.badRequest({ message: 'La clase debe comenzar entre las 6:00 y las 21:00 horas' })
    }

    if (endHour < 6 || endHour > 21) {
      return response.badRequest({ message: 'La clase debe terminar entre las 6:00 y las 21:00 horas' })
    }

    const overlapping = await ClassroomSession.query()
      .where('classroom_id', payload.classroom_id)
      .whereNot('id', session.id)
      .where((query) => {
        query.where('start_at', '<', endAt).andWhere('end_at', '>', startAt)
      })

    if (overlapping.length > 0) {
      return response.badRequest({ message: 'Ya existe una clase programada en ese horario para este salón' })
    }

    session.merge({
      ...payload,
      start_at: startAt,
      end_at: endAt,
      duration,
    })
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
