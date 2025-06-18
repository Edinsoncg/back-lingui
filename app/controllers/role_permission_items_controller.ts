import type { HttpContext } from '@adonisjs/core/http'
import RolePermissionItem from '#models/role_permission_item'
import PermissionItem from '#models/permission_item'
import { assignPermissionsValidator, removePermissionsValidator, updatePermissionsValidator } from '#validators/role_permission_item'

export default class RolePermissionItemsController {
  public async list({ params, response }: HttpContext) {
    try {
      const { role_id, item_id } = params

      // Consulta filtrada si hay params
      const query = RolePermissionItem.query()
        .preload('role')
        .preload('item')
        .select(['role_id', 'item_id', 'permission_id'])

      if (role_id) query.where('role_id', role_id)
      if (item_id) query.where('item_id', item_id)

      const records = await query

      // Obtener todos los permission_items que coincidan
      const allPermissionItems = await PermissionItem.query()

      const result: Record<
        string,
        {
          role_id: number
          role_name: string
          item_id: number
          item_name: string
          permission_item_ids: number[]
        }
      > = {}

      for (const record of records) {
        const key = `${record.role_id}_${record.item_id}`

        if (!result[key]) {
          result[key] = {
            role_id: record.role_id,
            role_name: record.role.name,
            item_id: record.item_id,
            item_name: record.item.name,
            permission_item_ids: [],
          }
        }

        // Buscar el permission_item correspondiente
        const permissionItem = allPermissionItems.find(
          (p) =>
            p.permission_id === record.permission_id &&
            p.item_id === record.item_id
        )

        if (permissionItem) {
          result[key].permission_item_ids.push(permissionItem.id)
        }
      }

      return response.ok(Object.values(result))
    } catch (error) {
      console.error('Error al listar asignaciones de permisos:', error)
      return response.internalServerError({
        message: 'Error al listar asignaciones de permisos',
      })
    }
  }

  /**
   * ✅ Asigna uno o varios permisos (permission_items) a un rol sobre un ítem
   */
  public async assign({ request, response }: HttpContext) {
    const { role_id, item_id, permission_item_ids } = await request.validateUsing(assignPermissionsValidator)

    try {
      // 1. Eliminar permisos anteriores del mismo ítem para ese rol
      await RolePermissionItem
        .query()
        .where('role_id', role_id)
        .where('item_id', item_id)
        .delete()

      // 2. Filtrar los permission_items válidos que pertenezcan a ese item
      const validPermissionItems = await PermissionItem
        .query()
        .whereIn('id', permission_item_ids)
        .where('item_id', item_id)

      // 3. Preparar inserts con los permission_id reales
      const inserts = validPermissionItems.map((item) => ({
        role_id,
        item_id,
        permission_id: item.permission_id,
      }))

      // 4. Insertar nuevos registros
      await RolePermissionItem.createMany(inserts)

      return response.ok({ message: 'Permisos asignados correctamente.' })
    } catch (error) {
      console.error('Error al asignar permisos:', error)
      return response.internalServerError({ message: 'Error al asignar permisos.' })
    }
  }

  /**
   * ❌ Elimina uno o varios permisos específicos de un rol sobre un ítem
   */
  public async remove({ request, response }: HttpContext) {
    const { role_id, item_id, permission_item_ids } =
      await request.validateUsing(removePermissionsValidator)

    try {
      const permissionItems = await PermissionItem
        .query()
        .whereIn('id', permission_item_ids)
        .where('item_id', item_id)

      const permissionIds = permissionItems.map((pi) => pi.permission_id)

      await RolePermissionItem
        .query()
        .where('role_id', role_id)
        .where('item_id', item_id)
        .whereIn('permission_id', permissionIds)
        .delete()

      return response.ok({ message: 'Permisos eliminados correctamente.' })
    } catch (error) {
      console.error('Error al eliminar permisos:', error)
      return response.internalServerError({ message: 'Error al eliminar permisos.' })
    }
  }

  /**
   * 🔍 Mostrar los permisos asignados de un rol sobre un ítem
   */
  public async show({ request, response }: HttpContext) {
    const roleId = Number(request.param('role_id'))
    const itemId = Number(request.param('item_id'))

    try {
      // 1. Obtener los permission_id ya asignados al rol + item
      const asignados = await RolePermissionItem
        .query()
        .where('role_id', roleId)
        .where('item_id', itemId)

      const assignedPermissionIds = asignados.map(p => p.permission_id)

      // 2. Obtener todos los PermissionItem disponibles para ese ítem
      const allPermissions = await PermissionItem
        .query()
        .where('item_id', itemId)
        .preload('permission')

      // 3. Filtrar los asignados desde la lista completa
      const assignedPermissions = allPermissions.filter(p =>
        assignedPermissionIds.includes(p.permission_id)
      )

      // 4. Respuesta estructurada
      return response.ok({
        allPermissions,
        assignedPermissions,
      })
    } catch (error) {
      console.error('Error al obtener permisos:', error)
      return response.internalServerError({ message: 'Error al obtener permisos.' })
    }
  }

  /**
   * ✏️ Actualizar permisos (igual que asignar, pero semánticamente diferente)
   */
  public async update({ request, response }: HttpContext) {
    const { role_id, item_id, permission_item_ids } = await request.validateUsing(updatePermissionsValidator)

    try {
      const validPermissionItems = await PermissionItem
        .query()
        .whereIn('id', permission_item_ids)
        .where('item_id', item_id)

      const inserts = validPermissionItems.map((item) => ({
        role_id,
        item_id,
        permission_id: item.permission_id,
      }))

      await RolePermissionItem
        .query()
        .where('role_id', role_id)
        .where('item_id', item_id)
        .delete()

      await RolePermissionItem.createMany(inserts)

      return response.ok({ message: 'Permisos actualizados correctamente.' })
    } catch (error) {
      console.error('Error al actualizar permisos:', error)
      return response.internalServerError({ message: 'Error al actualizar permisos.' })
    }
  }
}
