import factory from '@adonisjs/lucid/factories'
import RolePermissionItem from '#models/role_permission_item'
import { faker } from '@faker-js/faker'

export const RolePermissionItemFactory = factory
  .define(RolePermissionItem, async () => {
    return {
      role_id: faker.number.int({ min: 1, max: 4 }),
      permission_id: faker.number.int({ min: 1, max: 8 }),
      item_id: faker.number.int({ min: 1, max: 6 }),
    }
  })
  .build()
