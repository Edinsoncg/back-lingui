import factory from '@adonisjs/lucid/factories'
import SupportMaterial from '#models/support_material'
import { faker } from '@faker-js/faker'

export const SupportMaterialFactory = factory
  .define(SupportMaterial, async () => {
    return {
      name: faker.book.title(),
      level_id: faker.number.int({ min: 1, max: 6 }), // Assuming level_id is an integer
      description: faker.lorem.paragraph(),
      link: faker.internet.url(),
    }
  })
  .build()
