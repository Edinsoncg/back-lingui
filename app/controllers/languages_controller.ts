import Language from '#models/language'
import { createLanguageValidator, updateLanguageValidator } from '#validators/language'
import type { HttpContext } from '@adonisjs/core/http'

export default class LanguagesController {
  // Listar todos los idiomas
  public async list({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = Language.query()

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

  // Obtener un idioma por ID
  public async get({ params, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) return response.notFound({ message: 'Language not found' })
    return response.ok(language)
  }

  // Crear un nuevo idioma
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createLanguageValidator)
    const language = await Language.create(data)
    return response.created(language)
  }

  // Actualizar un idioma
  public async update({ params, request, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) return response.notFound({ message: 'Language not found' })

    const data = await request.validateUsing(updateLanguageValidator)
    language.merge(data)
    await language.save()

    return response.ok(language)
  }

  // Eliminar un idioma
  public async destroy({ params, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) return response.notFound({ message: 'Language not found' })

    await language.delete()
    return response.ok({ message: 'Language deleted successfully' })
  }
}
