import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassroomSession from '#models/classroom_session'

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
        start_at: new Date('2023-01-01'),
        end_at: new Date('2023-12-31'),
        duration: 3,
    })
    await ClassroomSession.createMany(99)
  }
}
