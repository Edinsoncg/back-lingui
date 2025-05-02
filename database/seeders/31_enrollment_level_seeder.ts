import { EnrollmentLevelFactory } from '#database/factories/enrollment_level_factory'
import EnrollmentLevel from '#models/enrollment_level'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const enrollmentLevel = await EnrollmentLevel.create({
      student_language_id: 1,
      level_id: 1,
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-12-31'),
    })
    await EnrollmentLevelFactory.createMany(69)
  }
}
