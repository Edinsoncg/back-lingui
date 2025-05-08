import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { faker } from '@faker-js/faker'

let user_id = 1
export const UserFactory = factory
  .define(User, async () => {

    user_id++
    const isFirst70 = user_id <= 70

    return {
      first_name: faker.person.firstName(),
      middle_name: Math.random() < 0.2
      ? null
      : faker.person.middleName(),
      first_last_name: faker.person.lastName(),
      second_last_name: faker.person.lastName(),
      document_type_id: isFirst70
      ? faker.number.int({ min: 1, max: 2})
      : 1,
      document_number: faker.string.numeric({ length: 10 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone_number: '+57 3' + faker.string.numeric( { length: 9 }),
      workday_id: isFirst70
      ? null
      : faker.number.int({ min: 1, max: 3}),
    }
  })
  .build()
