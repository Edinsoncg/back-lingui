import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { createStatusValidator, updateStatusValidator } from '#validators/status'

export default class StatusesController {
  public async list({ response }: HttpContext) {
    const status = await Status.all()
    return response.ok(status)
  }

  // ✅ Obtener con paginación y búsqueda por nombre
  public async paginated({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = Status.query()

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

  // ✅ Crear nuevo estado
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createStatusValidator)
    const status = await Status.create(data)
    return response.created(status)
  }

  // ✅ Actualizar estado existente
  public async update({ params, request, response }: HttpContext) {
    const status = await Status.find(params.id)
    if (!status) return response.notFound({ message: 'Status not found' })

    const data = await request.validateUsing(updateStatusValidator)
    status.merge(data)
    await status.save()

    return response.ok(status)
  }

  // ✅ Eliminar estado
  public async destroy({ params, response }: HttpContext) {
    const status = await Status.find(params.id)
    if (!status) return response.notFound({ message: 'Status not found' })

    await status.delete()
    return response.ok({ message: 'Status deleted successfully' })
  }
}
