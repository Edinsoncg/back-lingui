import { RolePermissionItemFactory } from '#database/factories/role_permission_item_factory'
import RolePermissionItem from '#models/role_permission_item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const rolePermissionItem = await RolePermissionItem.create({
      role_id: 1,
      permission_id: 1,
      item_id: 1,
    })
    await RolePermissionItemFactory.createMany(29)
  }
}
