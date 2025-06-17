import type { HttpContext } from '@adonisjs/core/http'
import RolePermissionItem from '#models/role_permission_item'
import PermissionItem from '#models/permission_item'
import { assignPermissionsValidator, removePermissionsValidator } from '#validators/role_permission_item'

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

      const result: Record<
        string,
        {
          role_id: number
          role_name: string
          item_id: number
          item_name: string
          permission_ids: number[]
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
            permission_ids: [],
          }
        }

        result[key].permission_ids.push(record.permission_id)
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
    const { role_id, item_id, permission_ids } = await request.validateUsing(assignPermissionsValidator)

    try {
      // 1. Verificar que los permission_ids existan y obtener sus permission_id reales
      const permissionRows = await PermissionItem
        .query()
        .whereIn('id', permission_ids)

      // Validación adicional opcional
      if (permissionRows.length !== permission_ids.length) {
        return response.badRequest({ message: 'Algunos permission_ids no son válidos.' })
      }

      // 2. Construir los registros a insertar
      const inserts = permissionRows.map((row) => ({
        role_id,
        item_id,
        permission_id: row.permission_id,
      }))

      // 3. Eliminar asignaciones anteriores para ese rol + item
      await RolePermissionItem
        .query()
        .where('role_id', role_id)
        .where('item_id', item_id)
        .delete()

      // 4. Insertar nuevos permisos
      if (inserts.length > 0) {
        await RolePermissionItem.createMany(inserts)
      }

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
    const { role_id, item_id, permission_ids } = await request.validateUsing(removePermissionsValidator)

    try {
      // Obtener los permission_id asociados a esos permission_ids
      const permissionIds = await PermissionItem
        .query()
        .whereIn('id', permission_ids)
        .where('item_id', item_id)
        .select('permission_id')

      const idsToDelete = permissionIds.map((p) => p.permission_id)

      await RolePermissionItem
        .query()
        .where('role_id', role_id)
        .where('item_id', item_id)
        .whereIn('permission_id', idsToDelete)
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
      const permisos = await RolePermissionItem
        .query()
        .where('role_id', roleId)
        .where('item_id', itemId)
        .preload('permission')
        .preload('item')

      const permissionItems = await PermissionItem
        .query()
        .whereIn('permission_id', permisos.map(p => p.permission_id))
        .where('item_id', itemId)

      return response.ok({
        role_id: roleId,
        item_id: itemId,
        permission_ids: permissionItems.map(p => p.id),
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
    const { role_id, item_id, permission_ids } = await request.validateUsing(assignPermissionsValidator)

    try {
      const permissionRows = await PermissionItem
        .query()
        .whereIn('id', permission_ids)

      const inserts = permissionRows.map((row) => ({
        role_id,
        item_id,
        permission_id: row.permission_id,
        createdAt: new Date(),
        updatedAt: new Date(),
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
