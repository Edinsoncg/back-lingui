import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RolePermissionItem from '#models/role_permission_item'
import Role from '#models/role'
import PermissionItem from '#models/permission_item'

export default class RolePermissionItemSeeder extends BaseSeeder {
  public async run() {
    // Buscar el rol 'Administrativo'
    const adminRole = await Role.findByOrFail('name', 'Administrativo')

    // Obtener todos los permission_items
    const permissionItems = await PermissionItem.all()

    const data = permissionItems.map((pi) => ({
      role_id: adminRole.id,
      permission_id: pi.permission_id,
      item_id: pi.item_id,
    }))

    await RolePermissionItem.createMany(data)
  }
}
