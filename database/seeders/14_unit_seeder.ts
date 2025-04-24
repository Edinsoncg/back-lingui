import Unit from '#models/unit'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const unit = await Unit.createMany([
      { name: '1A' },
      { name: '1B' },
      { name: '1C' },
      { name: '2A' },
      { name: '2B' },
      { name: '2C' },
      { name: '3A' },
      { name: '3B' },
      { name: '3C' },
      { name: '4A' },
      { name: '4B' },
      { name: '4C' },
      { name: '5A' },
      { name: '5B' },
      { name: '5C' },
      { name: '6A' },
      { name: '6B' },
      { name: '6C' },
    ])
  }
}
