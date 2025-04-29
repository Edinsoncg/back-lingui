import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import UserRole from '#models/user_role'

export const UserRoleFactory = factory
  .define(UserRole, async () => {
    return {
      user_id: faker.number.int({ min: 1, max: 99 }),
      role_id: faker.number.int({ min: 1, max: 4 }),
    }
  })
  .build()