import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DashboardComponent from '#models/dashboard_component'

export default class extends BaseSeeder {
  async run() {
    const dashboardComponent = await DashboardComponent.createMany([
      { name: 'House' },
      { name: 'Permission' },
      { name: 'User' },
      { name: 'Role' },
      { name: 'Dashboard' },
    ])
  }
}
