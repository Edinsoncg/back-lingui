
import { UnitFactory } from '#database/factories/unit_factory'
import Unit from '#models/unit'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const unit = await Unit.createMany([
      {
        module_id: 1,
        element_id: 1,
      }
    ])
    await UnitFactory.createMany(35)
  }
}
