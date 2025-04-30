import { BaseSeeder } from '@adonisjs/lucid/seeders'
import StudentLanguage from '#models/student_language'
import { StudentLanguageFactory } from '#database/factories/student_language_factory'

export default class extends BaseSeeder {
  async run() {
    const studentLanguages = await StudentLanguage.create({
      student_id: 1,
      language_id: 1,
    })
    await StudentLanguageFactory.createMany(69)
  }
}
