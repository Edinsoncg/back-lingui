import DocumentType from '#models/document_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  public async run() {
    const document_type = await DocumentType.createMany([
      {
        name: 'Cédula de Ciudadanía',
        abbreviation: 'CC',
      },
      {
        name: 'Tarjeta de Identidad',
        abbreviation: 'TI',
      },
    ])
  }
}
