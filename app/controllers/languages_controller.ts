import type { HttpContext } from '@adonisjs/core/http'
import Language from '#models/language'

export default class LanguagesController {
  public async index({ response }: HttpContext) {
    const languages = await Language.all()
    return response.ok(languages)
  }
}
