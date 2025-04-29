import factory from '@adonisjs/lucid/factories'
import StudentLanguage from '#models/student_language'

export const StudentLanguageFactory = factory
  .define(StudentLanguage, async ({ faker }) => {
    return {}
  })
  .build()