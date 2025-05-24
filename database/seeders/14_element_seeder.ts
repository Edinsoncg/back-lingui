import Element from '#models/element'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const element = await Element.createMany([
      { name: 'A', order: '1' },
      { name: 'B', order: '2' },
      { name: 'C', order: '3' },
    ])
  }
}
