import House from '#models/house'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const house = await House.createMany([
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
    ])
  }
}
