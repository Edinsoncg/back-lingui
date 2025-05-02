import { RoleDashboardComponentFactory } from '#database/factories/role_dashboard_component_factory'
import RoleDashboardComponent from '#models/role_dashboard_component'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const roleDashboardComponent = await RoleDashboardComponent.create({
      role_id: 1,
      dashboard_component_id: 1,
    })
    await RoleDashboardComponentFactory.createMany(9)
  }
}
