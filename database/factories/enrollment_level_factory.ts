import factory from '@adonisjs/lucid/factories'
import EnrollmentLevel from '#models/enrollment_level'

export const EnrollmentLevelFactory = factory
  .define(EnrollmentLevel, async ({ faker }) => {
    return {}
  })
  .build()