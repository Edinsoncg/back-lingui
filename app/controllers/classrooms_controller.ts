import Classroom from '#models/classroom'
import { createClassroomValidator, updateClassroomValidator } from '#validators/classroom'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClassroomsController {
  // Listar todos los salones
  public async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = Classroom.query().preload('house')

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

  // Obtener un salón por ID
  public async get({ params, response }: HttpContext) {
    const classroom = await Classroom.query().where('id', params.id).preload('house').firstOrFail()
    return response.ok(classroom)
  }

  // Crear un nuevo salón
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createClassroomValidator)
    const classroom = await Classroom.create(data)
    return response.created(classroom)
  }

  // Actualizar un salón
  public async update({ params, request, response }: HttpContext) {
    const classroom = await Classroom.find(params.id)
    if (!classroom) return response.notFound({ message: 'Classroom not found' })

    const data = await request.validateUsing(updateClassroomValidator)
    classroom.merge(data)
    await classroom.save()

    return response.ok(classroom)
  }

  // Eliminar un salón
  public async destroy({ params, response }: HttpContext) {
    const classroom = await Classroom.find(params.id)
    if (!classroom) return response.notFound({ message: 'Classroom not found' })

    await classroom.delete()
    return response.ok({ message: 'Classroom deleted successfully' })
  }
}
