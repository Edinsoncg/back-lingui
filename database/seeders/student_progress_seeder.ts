import { StudentProgressFactory } from '#database/factories/student_progress_factory'
import StudentProgress from '#models/student_progress'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const studentProgress = await StudentProgress.create({
      student_id: 1,
      level_id: 1,
      unit_id: 1,
      component_id: 1,
    })
    await StudentProgressFactory.createMany(99)
  }
}
