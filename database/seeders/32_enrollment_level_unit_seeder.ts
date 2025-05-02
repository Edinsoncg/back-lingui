import { EnrollmentLevelUnitFactory } from '#database/factories/enrollment_level_unit_factory'
import EnrollmentLevelUnit from '#models/enrollment_level_unit'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const enrollmentLevel = await EnrollmentLevelUnit.create({
      enrollment_level_id: 1,
      unit_id: 1,
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-12-31'),
    })
    await EnrollmentLevelUnitFactory.createMany(69)
  }
}
