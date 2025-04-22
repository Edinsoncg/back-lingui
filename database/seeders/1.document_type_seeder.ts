import DocumentType from '#models/document_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const document_type = await DocumentType.create({
      name: 'Cédula de Ciudadanía',
      abbreviation: 'CC',
    })
  }
}
