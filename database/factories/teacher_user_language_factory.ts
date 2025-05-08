import factory from '@adonisjs/lucid/factories'
import TeacherUserLanguage from '#models/teacher_user_language'
import { faker } from '@faker-js/faker'

let teacher = 71

export const TeacherUserLanguageFactory = factory
  .define(TeacherUserLanguage, async () => {
    teacher++
    return {
      user_id: teacher,
      language_id: faker.number.int({ min: 1, max: 5 }),
    }
  })
  .build()
