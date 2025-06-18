import type { HttpContext } from '@adonisjs/core/http'
import RolePermissionItem from '#models/role_permission_item'
import Item from '#models/item'
import UserRole from '#models/user_role'

export default class MenuController {
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const userId = user.id

      // 1. Roles del usuario
      const userRoles = await UserRole.query().where('user_id', userId)
      const roleIds = userRoles.map((r) => r.role_id)

      // 2. Permisos por rol
      const rolePermissions = await RolePermissionItem
        .query()
        .whereIn('role_id', roleIds)
        .preload('item')
        .preload('permission')

      // 3. Mapear ítems con permisos
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

      const parentIds = new Set<number>()

      for (const rp of rolePermissions) {
        const item = rp.item
        const permission = rp.permission.name

        // Agregar ítem al menú
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

        // Registrar padres
        if (item.item_id) {
          parentIds.add(item.item_id)
        }
      }

      // 4. Incluir ítems padres (si no tienen permisos, pero tienen hijos con permisos)
      const existingItemIds = Object.keys(menu).map(Number)
      const missingParentIds = Array.from(parentIds).filter((pid) => !existingItemIds.includes(pid))

      if (missingParentIds.length > 0) {
        const parentItems = await Item.findMany(missingParentIds)

        for (const parent of parentItems) {
          menu[parent.id] = {
            item: {
              id: parent.id,
              name: parent.name,
              url: parent.url,
              icon: parent.icon,
              parent_id: parent.item_id,
            },
            permissions: [], // los padres no necesitan permisos directos
          }
        }
      }

      return response.ok(Object.values(menu))
    } catch (error) {
      console.error('Error en MenuController:', error)
      return response.internalServerError({ message: 'No se pudo generar el menú' })
    }
  }
}
