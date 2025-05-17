import SupportMaterial from '#models/support_material'
import type { HttpContext } from '@adonisjs/core/http'

export default class SupportMaterialsController {
  async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')
    const name = request.input('name')

    const query = SupportMaterial.query().preload('level')

    // Filtro por nombre (opcional)
    if (name) {
      query.whereILike('name', `%${name}%`)
    }

    // Ordenamiento
    query.orderBy(sortBy, order)

    // Paginación
    const paginator = await query.paginate(page, limit)

    return response.ok({
      data: paginator.all(), // devuelve los registros de la página actual
      meta: paginator.getMeta(), // total de todos los registros
    })
  }

  async get({ params, response }: HttpContext) {
    const material = await SupportMaterial.query()
      .where('id', params.id)
      .preload('level')
      .firstOrFail()

    return response.ok(material)
  }

  async create({ request, response }: HttpContext) {
    const data = request.only(['name', 'level_id', 'description', 'link'])
    const material = await SupportMaterial.create(data)
    return response.created(material)
  }

  async update({ params, request, response }: HttpContext) {
    const material = await SupportMaterial.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    const data = request.only(['name', 'level_id', 'description', 'link'])
    material.merge(data)
    await material.save()

    return response.ok(material)
  }

  async destroy({ params, response }: HttpContext) {
    const material = await SupportMaterial.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    await material.delete()
    return response.ok({ message: 'Material deleted successfully' })
  }
}
