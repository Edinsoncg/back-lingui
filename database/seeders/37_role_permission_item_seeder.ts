// database/seeders/role_permission_item_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'
import RolePermissionItem from '#models/role_permission_item'
import Item from '#models/item'
import PermissionItem from '#models/permission_item'

export default class RolePermissionItemSeeder extends BaseSeeder {
  public async run() {
    const admin = await Role.findByOrFail('name', 'Administrativo')
    const permissions = await Permission.all()
    const items = await Item.all()

    const getPermId = (name: string) => permissions.find(p => p.name === name)?.id
    const getItemId = (name: string) => items.find(i => i.name === name)?.id

    const perms: Record<string, string[]> = {
      'Dashboard': ['view'],
      'Agenda': ['view', 'create', 'edit', 'cancel'],
      'Mi Perfil': ['view', 'edit'],
      'Académico': ['view', 'edit'],
      'Contrato': ['view', 'edit'],
      'Material de Soporte': ['view', 'create', 'edit', 'delete'],
      'Estudiantes': ['view'],
      'Salones': ['view'],
      'Profesores': ['view'],
      'Soporte': ['view'],
      'Usuarios': ['view', 'create', 'edit', 'inactive'],
      'Usuarios Inactivos': ['view', 'restore', 'delete'],
      'Permisos': ['view', 'edit'],
      'Lenguaje y Notificaciones': ['view'],
    }

    const data: {
      role_id: number
      permission_id: number
      item_id: number
    }[] = []

    for (const [itemName, permNames] of Object.entries(perms)) {
      const itemId = getItemId(itemName)
      if (!itemId) continue

      for (const permName of permNames) {
        const permId = getPermId(permName)
        if (!permId) continue

        data.push({
          role_id: admin.id,
          permission_id: permId,
          item_id: itemId,
        })
      }
    }

    await RolePermissionItem.createMany(data)
  }
}
