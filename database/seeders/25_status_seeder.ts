import Status from '#models/status'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const status = await Status.createMany([
      { name: 'Activo' },
      { name: 'Inactivo' },
    ])
  }
}
