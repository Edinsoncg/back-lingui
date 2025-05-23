import ClassType from '#models/class_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const class_type = await ClassType.createMany([
      { type: 'Practica' },
      { type: 'Tecnica' },
      { type: 'Club' },
    ])
  }
}
