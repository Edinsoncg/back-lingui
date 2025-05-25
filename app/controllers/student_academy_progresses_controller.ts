import StudentProgress from '#models/student_progress'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentAcademyProgressesController {
  async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')

    const query = StudentProgress.query()
      .preload('student', (studetQuery) => {
        studetQuery.preload('user').preload('status')
      })
      .preload('level')
      .preload('unit', (unitQuery) => {
        unitQuery.preload('element').preload('module')
      })
      .preload('component')

    // Filtro por nombre (opcional)
    if (search) {
      query.whereILike('student', `%${search}%`)
    }

    // Ordenamiento
    query.orderBy('created_at', 'desc')

    // Paginación
    const paginator = await query.paginate(page, limit)

    // Mapeo de los resultados
    const data = paginator.all().map((item) => {
      const unit = item.unit
      const element = unit?.element
      const module = unit?.module

      return {
        id: item.id,
        nivel: item.level?.name,
        unidad: element && module ? `${element.number}${module.letter}` : null,
        componente: item.component?.name,
        estudiante: `${item.student?.user?.first_name} ${item.student?.user?.first_last_name}`,
        estado: item.student?.status?.name,
        // ...otros campos que necesites
      }
    })

    return response.ok({
      data,
      total: paginator.getMeta().total,
    })
  }

  // solo se hizo el list para obtener el listado de los estudiantes falta el resto de los metodos
  async get({ params, response }: HttpContext) {
    const material = await StudentProgress.query()
      .where('id', params.id)
      .preload('level')
      .firstOrFail()

    return response.ok(material)
  }

  async create({ request, response }: HttpContext) {
    const data = request.only(['name', 'level_id', 'description', 'link'])
    const material = await StudentProgress.create(data)
    return response.created(material)
  }

  async update({ params, request, response }: HttpContext) {
    const material = await StudentProgress.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    const data = request.only(['name', 'level_id', 'description', 'link'])
    material.merge(data)
    await material.save()

    return response.ok(material)
  }

  async destroy({ params, response }: HttpContext) {
    const material = await StudentProgress.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    await material.delete()
    return response.ok({ message: 'Material deleted successfully' })
  }
}
