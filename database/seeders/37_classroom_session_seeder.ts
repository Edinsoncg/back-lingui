import { ClassroomSessionFactory } from '#database/factories/classroom_session_factory'
import ClassroomSession from '#models/classroom_session'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const classroomSession = await ClassroomSession.create({
      classroom_id: 1,
      modality_id: 1,
      level_id: 1,
      unit_id: 1,
      component_id: 1,
      teacher_user_language_id: 1,
      class_type_id: 1,
      start_at: new Date('2023-10-01T10:00:00Z'),
      end_at: new Date('2023-10-01T11:00:00Z'),
      duration: 60,
    })
    await ClassroomSessionFactory.createMany(69)
  }
}
