import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PermissionItem from '#models/permission_item'
import Permission from '#models/permission'
import Item from '#models/item'

export default class PermissionItemSeeder extends BaseSeeder {
  public async run() {
    const permissions = await Permission.all()
    const permissionMap = Object.fromEntries(permissions.map((p) => [p.name, p.id]))
    const items = await Item.all()

    const data: { permission_id: number; item_id: number }[] = []

    for (const item of items) {
      switch (item.name) {
        case 'Dashboard':
        case 'Mi Perfil':
        case 'Seguimiento Académico':
        case 'Seguimiento Contrato':
        case 'Soporte':
        case 'Reporte Estudiantes':
        case 'Reporte Salones':
        case 'Reporte Profesores':
          data.push({ permission_id: permissionMap.view, item_id: item.id })
          break

        case 'Agenda':
          data.push(
            { permission_id: permissionMap.view, item_id: item.id },
            { permission_id: permissionMap.create, item_id: item.id },
            { permission_id: permissionMap.edit, item_id: item.id },
            { permission_id: permissionMap.cancel, item_id: item.id }
          )
          break

        case 'Material de Soporte':
        case 'Lenguaje y Notificaciones':
          data.push(
            { permission_id: permissionMap.view, item_id: item.id },
            { permission_id: permissionMap.create, item_id: item.id },
            { permission_id: permissionMap.edit, item_id: item.id },
            { permission_id: permissionMap.delete, item_id: item.id }
          )
          break

        case 'Usuarios':
          data.push(
            { permission_id: permissionMap.view, item_id: item.id },
            { permission_id: permissionMap.create, item_id: item.id },
            { permission_id: permissionMap.edit, item_id: item.id },
            { permission_id: permissionMap.delete, item_id: item.id },
            { permission_id: permissionMap.inactive, item_id: item.id }
          )
          break

        case 'Usuarios Inactivos':
          data.push(
            { permission_id: permissionMap.view, item_id: item.id },
            { permission_id: permissionMap.restore, item_id: item.id },
            { permission_id: permissionMap.delete, item_id: item.id }
          )
          break

        case 'Permisos':
          data.push(
            { permission_id: permissionMap.view, item_id: item.id },
            { permission_id: permissionMap.edit, item_id: item.id }
          )
          break
      }
    }

    await PermissionItem.createMany(data)
  }
}
