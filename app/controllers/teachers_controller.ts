import TeacherUserLanguage from '#models/teacher_user_language'
import type { HttpContext } from '@adonisjs/core/http'

export default class TeachersController {
  public async list({ response }: HttpContext) {
    const teacher = await TeacherUserLanguage.query()
      .preload('user', (query) => {
        query.select('id', 'first_name', 'first_last_name')
      })
      .preload('language', (query) => {
        query.select('id', 'name')
      })
    return response.ok(teacher)
  }
}
