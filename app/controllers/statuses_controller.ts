import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'

export default class StatusesController {
  public async list({ response }: HttpContext) {
    const status = await Status.all()
    return response.ok(status)
  }
}
