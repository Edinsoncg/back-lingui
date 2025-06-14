// start/controllers/document_type_controller.ts
import DocumentType from '#models/document_type'
import { createDocumentTypeValidator } from '#validators/document_type'
import { updateDocumentTypeValidator } from '#validators/document_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class DocumentTypeController {
  public async list({ response }: HttpContext) {
    const documentTypes = await DocumentType.all()
    return response.ok(documentTypes)
  }

  // Paginado + búsqueda
  public async paginated({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const name = request.input('name')

    const query = DocumentType.query()

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

  public async get({ params, response }: HttpContext) {
    const documentType = await DocumentType.find(params.id)
    if (!documentType) return response.notFound({ message: 'Tipo de documento no encontrado' })
    return response.ok(documentType)
  }

  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createDocumentTypeValidator)
    const documentType = await DocumentType.create(data)
    return response.created(documentType)
  }

  public async update({ params, request, response }: HttpContext) {
    const documentType = await DocumentType.find(params.id)
    if (!documentType) return response.notFound({ message: 'Tipo de documento no encontrado' })

    const data = await request.validateUsing(updateDocumentTypeValidator)
    documentType.merge(data)
    await documentType.save()

    return response.ok(documentType)
  }

  public async destroy({ params, response }: HttpContext) {
    const documentType = await DocumentType.find(params.id)
    if (!documentType) return response.notFound({ message: 'Tipo de documento no encontrado' })

    await documentType.delete()
    return response.ok({ message: 'Tipo de documento eliminado correctamente' })
  }
}
