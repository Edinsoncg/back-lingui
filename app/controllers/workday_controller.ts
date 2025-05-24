// start/controllers/workday_controller.ts
import Workday from '#models/workday'
import type { HttpContext } from '@adonisjs/core/http'

export default class WorkdayController {
  public async list({ response }: HttpContext) {
    const workdays = await Workday.all()
    return response.ok(workdays)
  }
}
