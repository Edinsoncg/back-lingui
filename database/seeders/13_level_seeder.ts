import Level from '#models/level'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const level = await Level.createMany([
      { name: 'Kids', sequence_order: 1 },
      { name: 'Elementary', sequence_order: 2 },
      { name: 'Pre-intermediate', sequence_order: 3 },
      { name: 'Intermediate', sequence_order: 4 },
      { name: 'Upper', sequence_order: 5 },
      { name: 'Advance', sequence_order: 6 },
    ])
  }
}
