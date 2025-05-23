import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Student from '#models/student'
import { StudentFactory } from '#database/factories/student_factory'

export default class extends BaseSeeder {
  async run() {
    const student = await Student.create({
      user_id: 1,
      student_code: '2335',
      status_id: 1,
    })
    await StudentFactory.createMany(69)
  }
}
