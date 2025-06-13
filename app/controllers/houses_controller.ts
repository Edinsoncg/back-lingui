import House from '#models/house'
import { createHouseValidator } from '#validators/house'
import { updateHouseValidator } from '#validators/house'
import type { HttpContext } from '@adonisjs/core/http'

export default class HousesController {
  async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = House.query()

    if (name) {
      query.whereILike('name', `%${name}%`)
    }

    query.orderBy('created_at', 'desc')

    const paginator = await query.paginate(page, limit)

    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  async get({ params, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) return response.notFound({ message: 'House not found' })
    return response.ok(house)
  }

  async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createHouseValidator)
    const house = await House.create(data)
    return response.created(house)
  }

  async update({ params, request, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) return response.notFound({ message: 'House not found' })

    const data = await request.validateUsing(updateHouseValidator)
    house.merge(data)
    await house.save()

    return response.ok(house)
  }

  async destroy({ params, response }: HttpContext) {
    const house = await House.find(params.id)
    if (!house) return response.notFound({ message: 'House not found' })

    await house.delete()
    return response.ok({ message: 'House deleted successfully' })
  }
}
