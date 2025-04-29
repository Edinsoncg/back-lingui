import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    const permission = await Permission.createMany([
      { name: 'view_dashboard' },
      { name: 'edit_dashboard' },
      { name: 'delete_dashboard' },
      { name: 'create_dashboard' },
      { name: 'view_house' },
      { name: 'edit_house' },
      { name: 'delete_house' },
      { name: 'create_house' },
    ])
  }
}
