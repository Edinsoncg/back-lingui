import factory from '@adonisjs/lucid/factories'
import Student from '#models/student'
import { faker } from '@faker-js/faker'

export const StudentFactory = factory
  .define(Student, async () => {
    return {
      user_id: 1,
      student_code: faker.string.numeric({ length: 4 }),
      status_id: 1,
    }
  })
  .build()