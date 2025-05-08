import factory from '@adonisjs/lucid/factories'
import Item from '#models/item'
import { faker } from '@faker-js/faker'

export const ItemFactory = factory
  .define(Item, async () => {
    return {
      name: faker.word.noun(),
      url: faker.internet.url(),
      icon: faker.image.avatar(),
      item_id: null,
    }
  })
  .build()
