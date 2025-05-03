import SupportMaterial from '#models/support_material'
import type { HttpContext } from '@adonisjs/core/http'

export default class SupportMaterialsController {
  async index({ response }: HttpContext) {
    const material = await SupportMaterial.all()
    return response.ok(material)
  }

  async show({ params, response }: HttpContext) {
    const material = await SupportMaterial.findOrFail(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }
    return response.ok(material)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'level_id', 'description', 'link'])
    const material = await SupportMaterial.create(data)
    return response.created(material)
  }

  async update({ params, request, response }: HttpContext) {
    const material = await SupportMaterial.find(params.id)
    if (!material) {
      return response.notFound({ message: 'Material not found' })
    }

    const data = request.only(['name', 'level_id', 'description', 'link'])
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
