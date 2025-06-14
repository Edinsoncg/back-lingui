import Classroom from '#models/classroom'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClassroomsController {
  async list({ response }: HttpContext) {
    const classroom = await Classroom.query().preload('house', (query) => {
      query.select('id', 'name')
    })

    return response.ok(classroom)
  }
  async get({ params, response }: HttpContext) {
    const classroom = await Classroom.query()
      .select('id', 'name', 'capacity', 'house_id')
      .where('id', params.id)
      .first()

    if (!classroom) {
      return response.notFound({ message: 'Classroom not found' })
    }

    return response.ok(classroom)
  }

  async create({ request, response }: HttpContext) {
    const data = request.only(['name', 'capacity', 'house_id'])

    const classroom = await Classroom.create(data)
    return response.created(classroom)
  }

  async update({ params, request, response }: HttpContext) {
    const classroom = await Classroom.find(params.id)
    if (!classroom) {
      return response.notFound({ message: 'Classroom not found' })
    }

    const data = request.only(['name', 'capacity', 'house_id'])
    classroom.merge(data)
    await classroom.save()

    return response.ok(classroom)
  }

  async destroy({ params, response }: HttpContext) {
    const classroom = await Classroom.find(params.id)
    if (!classroom) {
      return response.notFound({ message: 'Classroom not found' })
    }

    await classroom.delete()
    return response.ok({ message: 'Classroom deleted successfully' })
  }
}
