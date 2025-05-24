import { PermissionItemFactory } from '#database/factories/permission_item_factory'
import PermissionItem from '#models/permission_item'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const permissionItem = await PermissionItem.create({
      permission_id: 1,
      item_id: 1,
    })
    await PermissionItemFactory.createMany(9)
  }
}
