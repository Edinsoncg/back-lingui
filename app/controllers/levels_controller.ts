import Level from '#models/level'
import type { HttpContext } from '@adonisjs/core/http'

export default class LevelsController {
  public async index({ response }: HttpContext) {
    const levels = await Level.all()
    return response.ok(levels)
  }
}
