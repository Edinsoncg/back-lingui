// app/controllers/languages_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Language from '#models/language'
import { createValidator, updateValidator } from '#validators/language'

export default class LanguagesController {
  public async index({ response }: HttpContext) {
    const languages = await Language.all()
    return response.ok(languages)
  }

  public async get({ params, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) {
      return response.notFound({ message: 'Language not found' })
    }
    return response.ok(language)
  }

  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const language = await Language.create(payload)
    return response.created(language)
  }

  public async update({ params, request, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) {
      return response.notFound({ message: 'Language not found' })
    }
    const payload = await request.validateUsing(updateValidator)
    language.merge(payload)
    await language.save()
    return response.ok(language)
  }

  public async destroy({ params, response }: HttpContext) {
    const language = await Language.find(params.id)
    if (!language) {
      return response.notFound({ message: 'Language not found' })
    }
    await language.delete()
    return response.ok({ message: 'Language deleted successfully' })
  }
}
