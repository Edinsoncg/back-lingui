// app/controllers/houses_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import House from '#models/house'
import { createValidator, updateValidator } from '#validators/house'

export default class HouseController {
  async list({ response }: HttpContext) {
    const houses = await House.all()
    return response.ok(houses)
  }

  async get({ params, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) {
      return response.notFound({ message: 'House not found' })
    }
    return response.ok(house)
  }

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const house = await House.create(payload)
    return response.created(house)
  }

  async update({ params, request, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) {
      return response.notFound({ message: 'House not found' })
    }
    const payload = await request.validateUsing(updateValidator)
    house.merge(payload)
    await house.save()
    return response.ok(house)
  }

  async destroy({ params, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) {
      return response.notFound({ message: 'House not found' })
    }
    await house.delete()
    return response.ok({ message: 'House deleted successfully' })
  }
}
