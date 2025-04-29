import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TeacherUserLanguage from '#models/teacher_user_language'
import { TeacherUserLanguageFactory } from '#database/factories/teacher_user_language_factory'

export default class extends BaseSeeder {
  async run() {
    const TeacherUserLanguage = await TeacherUserLanguage.create({
      user_id: 1,
      language_id: 1,
    })
    await TeacherUserLanguageFactory.create(30)
  }
}
