import factory from '@adonisjs/lucid/factories'
import TeacherUserLanguage from '#models/teacher_user_language'
import { faker } from '@faker-js/faker'

export const TeacherUserLanguageFactory = factory
  .define(TeacherUserLanguage, async () => {
    return {
      user_id: Math.random() < 0.7
      ? faker.number.int({ min: 1, max: 30}),
      language_id: faker.number.int({ min: 1, max: 5 }),
  })
  .build()
