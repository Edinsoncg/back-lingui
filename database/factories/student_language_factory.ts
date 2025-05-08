import factory from '@adonisjs/lucid/factories'
import StudentLanguage from '#models/student_language'
import { faker } from '@faker-js/faker'

let student = 1

export const StudentLanguageFactory = factory
  .define(StudentLanguage, async () => {
    student++
    return {
      student_id: student,
      language_id: faker.number.int({ min: 1, max: 5 }),
    }
  })
  .build()
