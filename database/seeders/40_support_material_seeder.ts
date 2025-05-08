import { SupportMaterialFactory } from '#database/factories/support_material_factory'
import SupportMaterial from '#models/support_material'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const supportMaterial = await SupportMaterial.create({
      name: 'Material de apoio',
      level_id: 1,
      description: 'Descrição do material de apoio',
      link: 'https://example.com/material-de-apoio',
    })
    await SupportMaterialFactory.createMany(9)
  }
}
