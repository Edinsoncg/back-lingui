import { StudentProgressFactory } from '#database/factories/student_progress_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await StudentProgressFactory.createMany(70)
  }
}
