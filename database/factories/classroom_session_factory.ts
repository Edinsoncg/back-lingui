import factory from '@adonisjs/lucid/factories'
import ClassroomSession from '#models/classroom_session'
import { faker } from '@faker-js/faker'

export const ClassroomSessionFactory = factory
  .define(ClassroomSession, async () => {
    return {
      classroom_id: faker.datatype.number({ min: 1, max: 5 }),
      modality_id: faker.datatype.number({ min: 1, max: 3 }),
      level_id: faker.datatype.number({ min: 1, max: 6 }),
      unit_id: faker.datatype.number({ min: 1, max: 18 }),
      component_id: faker.datatype.number({ min: 1, max: 5 }),
      teacher_user_language_id: faker.datatype.number({ min: 1, max: 100 }),
      class_type_id: faker.datatype.number({ min: 1, max: 3 }),
      start_at: faker.date.past(),
      end_at: faker.date.future(),
      duration: faker.datatype.number({ min: 1, max: 3 }),
    }
  })
  .build()
