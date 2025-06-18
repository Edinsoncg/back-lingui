import ClassType from '#models/class_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClasstypesController {
  public async index({ response }: HttpContext) {
    const classtype = await ClassType.all()
    return response.ok(classtype)
  }
}
