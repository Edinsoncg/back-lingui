// start/controllers/document_type_controller.ts
import DocumentType from '#models/document_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class DocumentTypeController {
  public async list({ response }: HttpContext) {
    const documentTypes = await DocumentType.all()
    return response.ok(documentTypes)
  }
}
