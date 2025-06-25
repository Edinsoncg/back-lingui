// app/controllers/statuses_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { createValidator, updateValidator } from '#validators/status'

export default class StatusesController {
  public async list({ response }: HttpContext) {
    const status = await Status.all()
    return response.ok(status)
  }

  public async get({ params, response }: HttpContext) {
    const status = await Status.find(params.id)
    if (!status) {
      return response.notFound({ message: 'Status not found' })
    }
    return response.ok(status)
  }

  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const status = await Status.create(payload)
    return response.created(status)
  }

  public async update({ params, request, response }: HttpContext) {
    const status = await Status.find(params.id)
    if (!status) {
      return response.notFound({ message: 'Status not found' })
    }
    const payload = await request.validateUsing(updateValidator)
    status.merge(payload)
    await status.save()
    return response.ok(status)
  }

  public async destroy({ params, response }: HttpContext) {
    const status = await Status.find(params.id)
    if (!status) {
      return response.notFound({ message: 'Status not found' })
    }
    await status.delete()
    return response.ok({ message: 'Status deleted successfully' })
  }
}
