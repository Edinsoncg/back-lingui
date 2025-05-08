import factory from '@adonisjs/lucid/factories'
import ClassroomSession from '#models/classroom_session'
import { fa, faker } from '@faker-js/faker'

export const ClassroomSessionFactory = factory
  .define(ClassroomSession, async () => {
    return {
      classroom_id: faker.number.int({ min: 1, max: 5 }),
      modality_id: faker.number.int({ min: 1, max: 3 }),
      level_id: faker.number.int({ min: 1, max: 6 }),
      unit_id: faker.number.int({ min: 1, max: 18 }),
      component_id: faker.number.int({ min: 1, max: 6 }),
      teacher_user_language_id: faker.number.int({ min: 1, max: 21 }),
      class_type_id: faker.number.int({ min: 1, max: 3 }),
      start_at: faker.date.soon({ days: 30, refDate: new Date() }),
      end_at: faker.date.soon({ days: 30, refDate: new Date() }),
      duration: faker.number.int({ min: 1, max: 120 }),
    }
  })
  .build()
