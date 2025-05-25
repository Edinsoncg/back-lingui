import Unit from '#models/unit'
import Component from '#models/component'
import UnitComponent from '#models/unit_component'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const units = await Unit.all()
    const components = await Component.all()
    const data = []

    for (const unit of units) {
      for (const component of components) {
        data.push({ unit_id: unit.id, component_id: component.id })
      }
    }

    await UnitComponent.createMany(data)
  }
}
