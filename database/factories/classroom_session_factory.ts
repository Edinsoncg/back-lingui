import factory from '@adonisjs/lucid/factories'
import ClassroomSession from '#models/classroom_session'
import { faker } from '@faker-js/faker'

export const ClassroomSessionFactory = factory
  .define(ClassroomSession, async () => {
    const classroom_id = faker.number.int({ min: 1, max: 5 })
    const today = new Date()
    const inSevenDays = new Date(today)
    inSevenDays.setDate(today.getDate() + 7)

    let tries = 0
    const maxTries = 20
    let startAt: Date
    let endAt: Date
    let duration: number

    while (tries < maxTries) {
      // Fecha entre hoy y 7 días después
      const randomDate = new Date(today.getTime() + faker.number.int({ min: 0, max: 6 }) * 24 * 60 * 60 * 1000)
      const randomHour = faker.number.int({ min: 6, max: 20 }) // última clase puede empezar a las 20h si es de 1 hora

      duration = faker.number.int({ min: 1, max: Math.min(3, 21 - randomHour) }) // asegurar que no pase las 21h

      startAt = new Date(randomDate)
      startAt.setHours(randomHour, 0, 0, 0)

      endAt = new Date(startAt.getTime() + duration * 60 * 60 * 1000)

      // Validar que no haya cruce con otra sesión en ese salón y día
      const overlapping = await ClassroomSession.query()
        .where('classroom_id', classroom_id)
        .whereRaw('DATE(start_at) = ?', [startAt.toISOString().split('T')[0]])
        .andWhere((query) => {
          query
            .whereBetween('start_at', [startAt.toISOString(), endAt.toISOString()])
            .orWhereBetween('end_at', [startAt.toISOString(), endAt.toISOString()])
            .orWhereRaw('? BETWEEN start_at AND end_at', [startAt.toISOString()])
            .orWhereRaw('? BETWEEN start_at AND end_at', [endAt.toISOString()])
        })
        .first()

      if (!overlapping) break
      tries++
    }

    if (tries === maxTries) {
      throw new Error('No se pudo generar una sesión sin cruce de horarios.')
    }

    return {
      classroom_id,
      modality_id: faker.number.int({ min: 1, max: 3 }),
      unit_id: faker.number.int({ min: 1, max: 156 }),
      teacher_user_language_id: faker.number.int({ min: 1, max: 21 }),
      class_type_id: faker.number.int({ min: 1, max: 3 }),
      start_at: startAt,
      end_at: endAt,
      duration,
    }
  })
  .build()
