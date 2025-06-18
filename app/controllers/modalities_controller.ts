import Modality from '#models/modality'
import type { HttpContext } from '@adonisjs/core/http'

export default class ModalitiesController {
  public async list({ response }: HttpContext) {
    const modality = await Modality.all()
    return response.ok(modality)
  }
}
