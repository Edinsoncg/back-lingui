import factory from '@adonisjs/lucid/factories'
import PermissionItem from '#models/permission_item'

export const PermissionItemFactory = factory
  .define(PermissionItem, async ({ faker }) => {
    return {}
  })
  .build()