import factory from '@adonisjs/lucid/factories'
import StudentProgress from '#models/student_progress'
import { faker } from '@faker-js/faker'
import is from '@adonisjs/core/helpers/is'

let studentProgressId = 1
export const StudentProgressFactory = factory
  .define(StudentProgress, async () => {
    return {
      student_id: studentProgressId++,
      unit_component_id: faker.number.int({ min: 1, max: 936 }),
    }
  })
  .build()
