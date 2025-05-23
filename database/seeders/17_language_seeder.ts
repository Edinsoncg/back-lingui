import Language from '#models/language'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const language = await Language.createMany([
      {
        name: 'Inglés',
        abbreviation: 'EN',
      },
      {
        name: 'Francés',
        abbreviation: 'FR',
      },
      {
        name: 'Italiano',
        abbreviation: 'IT',
      },
      {
        name: 'Portugués',
        abbreviation: 'PT',
      },
      {
        name: 'Alemán',
        abbreviation: 'DE',
      },
    ])
  }
}
