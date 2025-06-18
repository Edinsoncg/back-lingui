// start/controllers/menu_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import RolePermissionItem from '#models/role_permission_item'
import Permission from '#models/permission'
import Item from '#models/item'
import UserRole from '#models/user_role'

export default class MenuController {
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const userId = user.id

      // 1. Obtener los roles del usuario
      const userRoles = await UserRole.query().where('user_id', userId)
      const roleIds = userRoles.map((r) => r.role_id)

      // 2. Obtener las relaciones rol-permiso-ítem
      const rolePermissions = await RolePermissionItem
        .query()
        .whereIn('role_id', roleIds)
        .preload('item')
        .preload('permission')

      // 3. Construir un mapa de ítems con los permisos asociados
      const menu: Record<number, {
        item: {
          id: number
          name: string
          url: string
          icon: string
          parent_id: number | null
        }
        permissions: string[]
      }> = {}

      for (const rp of rolePermissions) {
        const item = rp.item
        const permission = rp.permission.name

        if (!menu[item.id]) {
          menu[item.id] = {
            item: {
              id: item.id,
              name: item.name,
              url: item.url,
              icon: item.icon,
              parent_id: item.item_id,
            },
            permissions: [],
          }
        }

        if (!menu[item.id].permissions.includes(permission)) {
          menu[item.id].permissions.push(permission)
        }
      }

      // 4. Retornar el menú como array
      return response.ok(Object.values(menu))
    } catch (error) {
      console.error('Error en MenuController:', error)
      return response.internalServerError({ message: 'No se pudo generar el menú' })
    }
  }
}
