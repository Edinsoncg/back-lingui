import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Item from '#models/item'
import Permission from '#models/permission'
import PermissionItem from '#models/permission_item'
import RolePermissionItem from '#models/role_permission_item'

export default class StudentPermissionSeeder extends BaseSeeder {
  public async run() {
    const studentRole = await Role.findByOrFail('name', 'Estudiante')

    const permissions = await Permission.all()
    const permissionMap = Object.fromEntries(permissions.map((p) => [p.name, p.id]))

    const allowedPermissionsPerItem: Record<string, string[]> = {
      'Dashboard': ['view'],
      'Mi Perfil': ['view', 'edit'],
      'Seguimiento Académico': ['view'],
      'Seguimiento Contrato': ['view'],
      'Material de Soporte': ['view'],
      'Soporte': ['view'],
    }

    const items = await Item.all()

    const permissionItems = await PermissionItem.all()

    const data: {
      role_id: number
      item_id: number
      permission_id: number
    }[] = []

    for (const item of items) {
      const allowedPerms = allowedPermissionsPerItem[item.name]
      if (!allowedPerms) continue

      for (const permName of allowedPerms) {
        const permissionId = permissionMap[permName]
        const exists = permissionItems.find(
          (pi) => pi.permission_id === permissionId && pi.item_id === item.id
        )
        if (exists) {
          data.push({
            role_id: studentRole.id,
            item_id: item.id,
            permission_id: permissionId,
          })
        }
      }
    }

    await RolePermissionItem.createMany(data)
  }
}
