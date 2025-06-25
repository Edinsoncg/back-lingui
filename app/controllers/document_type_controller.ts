// start/controllers/document_type_controller.ts
import DocumentType from '#models/document_type'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/document_type'

export default class DocumentTypeController {
  public async list({ response }: HttpContext) {
    const documentTypes = await DocumentType.all()
    return response.ok(documentTypes)
  }

  public async get({ params, response }: HttpContext) {
    const type = await DocumentType.find(params.id)
    if (!type) {
      return response.notFound({ message: 'Document type not found' })
    }
    return response.ok(type)
  }

  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const type = await DocumentType.create(payload)
    return response.created(type)
  }

  public async update({ params, request, response }: HttpContext) {
    const type = await DocumentType.find(params.id)
    if (!type) {
      return response.notFound({ message: 'Document type not found' })
    }
    const payload = await request.validateUsing(updateValidator)
    type.merge(payload)
    await type.save()
    return response.ok(type)
  }

  public async destroy({ params, response }: HttpContext) {
    const type = await DocumentType.find(params.id)
    if (!type) {
      return response.notFound({ message: 'Document type not found' })
    }
    await type.delete()
    return response.ok({ message: 'Document type deleted successfully' })
  }
}
