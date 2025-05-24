import Classroom from '#models/classroom'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClassroomsController {
  public async list({ response }: HttpContext) {
    const classroom = await Classroom.all()
    return response.ok(classroom)
  }
}
