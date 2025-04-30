import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import UserRole from '#models/user_role'

let user_role_id = 1

export const UserRoleFactory = factory
  .define(UserRole, async () => {
    user_role_id++
    const isFirst70 = user_role_id <= 70
    return {
      user_id: user_role_id,
      role_id: isFirst70
      ? 4
      : faker.number.int({ min: 1, max: 3 }),
    }
  })
  .build()
