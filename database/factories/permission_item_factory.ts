import factory from '@adonisjs/lucid/factories'
import PermissionItem from '#models/permission_item'
import { faker } from '@faker-js/faker'

export const PermissionItemFactory = factory
  .define(PermissionItem, async () => {
    return {
      permission_id: faker.number.int({ min: 1, max: 8 }),
      item_id: faker.number.int({ min: 1, max: 6 }),
    }
  })
  .build()
