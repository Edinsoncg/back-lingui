import SupportMaterial from '#models/support_material'
import { createSupportMaterialValidator } from '#validators/support_material'
import { updateSupportMaterialValidator } from '#validators/support_material'
import type { HttpContext } from '@adonisjs/core/http'

export default class SupportMaterialsController {
  async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = SupportMaterial.query().preload('level')

    // Filtro por nombre (opcional)
    if (name) {
      query.whereILike('name', `%${name}%`)
    }

    // Ordenamiento
    query.orderBy('created_at', 'desc')

    // Paginación
    const paginator = await query.paginate(page, limit)

    return response.ok({
      data: paginator.all(), // devuelve los registros de la página actual
      total: paginator.getMeta().total, // toDo: meta:paginator.getMeta(),
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
    const data = await request.validateUsing(createSupportMaterialValidator)
    const material = await SupportMaterial.create(data)
    return response.created(material)
  }

  async update({ params, request, response }: HttpContext) {
    const material = await SupportMaterial.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    const data = request.validateUsing(updateSupportMaterialValidator)
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
