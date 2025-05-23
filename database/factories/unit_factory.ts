import factory from '@adonisjs/lucid/factories'
import Unit from '#models/unit'
import { faker } from '@faker-js/faker'

export const UnitFactory = factory
  .define(Unit, async () => {
    return {
      module_id: faker.number.int({ min: 1, max: 12 }),
      element_id: faker.number.int({ min: 1, max: 3 }),
    }
  })
  .build()
