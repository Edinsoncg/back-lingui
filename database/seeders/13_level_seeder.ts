import Level from '#models/level'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const level = await Level.createMany([
      { name: 'Kids' },
      { name: 'Elementary' },
      { name: 'Pre-intermediate' },
      { name: 'Intermediate' },
      { name: 'Upper' },
      { name: 'Advance' },
    ])
  }
}
