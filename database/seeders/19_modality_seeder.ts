import Modality from '#models/modality'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const modality = await Modality.createMany([
      { kind: 'Presencial' },
      { kind: 'Virtual' },
      { kind: 'Mixto' },
    ])
  }
}
