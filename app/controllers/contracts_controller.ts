import type { HttpContext } from '@adonisjs/core/http'
import Contract from '#models/contract'

export default class ContractsController {
  public async list({ response }: HttpContext) {
    const contract = await Contract.all()
    return response.ok(contract)
  }
}
