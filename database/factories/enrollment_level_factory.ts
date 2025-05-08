import factory from '@adonisjs/lucid/factories'
import EnrollmentLevel from '#models/enrollment_level'
import { faker } from '@faker-js/faker'

export const EnrollmentLevelFactory = factory
  .define(EnrollmentLevel, async () => {
    return {
      student_language_id: faker.number.int({ min: 1, max: 5 }),
      level_id: faker.number.int({ min: 1, max: 6 }),
      start_date: faker.date.past(1, { refDate: new Date() }),
      end_date: faker.date.future(1, { refDate: new Date() }),
    }
  })
  .build()
