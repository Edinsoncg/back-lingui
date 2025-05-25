import factory from '@adonisjs/lucid/factories'
import StudentProgress from '#models/student_progress'
import { faker } from '@faker-js/faker'

export const StudentProgressFactory = factory
  .define(StudentProgress, async () => {
    return {
      student_id: faker.number.int({ min: 1, max: 70 }),
      level_id: faker.number.int({ min: 1, max: 6 }),
      unit_id: faker.number.int({ min: 1, max: 36 }),
      component_id: faker.number.int({ min: 1, max: 6 }),
    }
  })
  .build()
