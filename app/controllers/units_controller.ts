import Unit from '#models/unit'
import type { HttpContext } from '@adonisjs/core/http'

export default class UnitsController {
  public async index({ response }: HttpContext) {
    const units = await Unit.all()
    return response.ok(units)
  }
}
