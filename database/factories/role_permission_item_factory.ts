import factory from '@adonisjs/lucid/factories'
import RolePermissionItem from '#models/role_permission_item'

export const RolePermissionItemFactory = factory
  .define(RolePermissionItem, async ({ faker }) => {
    return {}
  })
  .build()