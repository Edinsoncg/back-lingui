import { ItemFactory } from '#database/factories/item_factory'
import Item from '#models/item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const item = await Item.create({
      name: 'Test Item',
      url: 'https://example.com/test-item',
      icon: 'https://example.com/icon.png',
      item_id: null,
    })
    await ItemFactory.createMany(5)
  }
}
