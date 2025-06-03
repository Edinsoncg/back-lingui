import { ClassroomSessionFactory } from '#database/factories/classroom_session_factory'
import ClassroomSession from '#models/classroom_session'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const startAt = new Date('2025-05-26T10:00:00Z')
    const endAt = new Date('2025-05-26T12:00:00Z')
    const duration = (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60) // duración en horas

    const classroomSession = await ClassroomSession.create({
      classroom_id: 1,
      modality_id: 1,
      unit_id: 1,
      teacher_user_language_id: 1,
      class_type_id: 1,
      start_at: startAt,
      end_at: endAt,
      duration: duration,
    })
    await ClassroomSessionFactory.createMany(69)
  }
}
