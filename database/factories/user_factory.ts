import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { faker } from '@faker-js/faker'

export const UserFactory = factory
  .define(User, async () => {
    return {
      first_name: faker.person.firstName(),
      middle_name: Math.random() < 0.2
      ? null
      : faker.person.middleName(),
      first_last_name: faker.person.lastName(),
      second_last_name: faker.person.lastName(),
      document_type_id: faker.number.int({ min: 1, max: 2}),
      document_number: faker.string.numeric({ length: 10 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone_number: '+57 3' + faker.string.numeric( { length: 9 }),
      workday_id: Math.random() < 0.8
      ? null
      : faker.number.int({ min: 1, max: 3}),
    }
  })
  .build()
