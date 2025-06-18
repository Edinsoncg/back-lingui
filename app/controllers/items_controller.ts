// app/controllers/items_controller.ts
import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemsController {
  public async list({ response }: HttpContext) {
    const items = await Item.all()
    return response.ok(items)
  }
}
