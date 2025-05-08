import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRole from '#models/user_role'
import { UserRoleFactory } from '#database/factories/user_role_factory'

export default class extends BaseSeeder {
  async run() {
    const userRole = await UserRole.create({
    user_id: 1,
    role_id: 4,
  })
    await UserRoleFactory.createMany(99)
  }
}
