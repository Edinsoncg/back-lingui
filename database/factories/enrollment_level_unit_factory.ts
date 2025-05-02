import factory from '@adonisjs/lucid/factories'
import EnrollmentLevelUnit from '#models/enrollment_level_unit'
import { faker } from '@faker-js/faker'

export const EnrollmentLevelUnitFactory = factory
  .define(EnrollmentLevelUnit, async () => {
    return {
      enrollment_level_id: faker.number.int({ min: 1, max: 6 }),
      unit_id: faker.number.int({ min: 1, max: 18 }),
      start_date: faker.date.past(),
      end_date: faker.date.future(),
    }
  })
  .build()
