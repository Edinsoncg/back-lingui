import factory from '@adonisjs/lucid/factories'
import ClassroomSession from '#models/classroom_session'
import { fa, faker } from '@faker-js/faker'

export const ClassroomSessionFactory = factory
  .define(ClassroomSession, async () => {
    const start_at = faker.date.between({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(Date.now() - 1000 * 60 * 60), // antes de ahora
    })
    // duración aleatoria entre 1 y 3 horas
    const duration = faker.number.int({ min: 1, max: 3 })
    const end_at = new Date(start_at.getTime() + duration * 60 * 60 * 1000)

    return {
      classroom_id: faker.number.int({ min: 1, max: 5 }),
      modality_id: faker.number.int({ min: 1, max: 3 }),
      level_id: faker.number.int({ min: 1, max: 6 }),
      unit_id: faker.number.int({ min: 1, max: 18 }),
      component_id: faker.number.int({ min: 1, max: 6 }),
      teacher_user_language_id: faker.number.int({ min: 1, max: 21 }),
      class_type_id: faker.number.int({ min: 1, max: 3 }),
      start_at,
      end_at,
      duration,
    }
  })
  .build()
